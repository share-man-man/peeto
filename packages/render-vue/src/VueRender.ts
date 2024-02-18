import { defineComponent, watchEffect, shallowRef } from 'vue';
import {
  defaultLoading,
  defaultNoMatchCompRender,
  defaultNoMatchPackageRender,
  defaultProps,
} from './utils';
import RenderByPackage from './components/RenderByPackage';
import vueUseCreateNodeFunc from './hooks/useCreateNodeFunc';
import {
  CompMapType,
  PackageMapType,
  SchemaRootObj,
  parseComponent,
  parsePackage,
} from '@peeto/parse';

const VueRender = defineComponent({
  ...defaultProps,
  setup(props, { slots }) {
    const loading = shallowRef(true);
    const schemaStr = shallowRef<string>();
    // 包集合
    const packageMap = shallowRef<PackageMapType>(new Map());
    // 组件集合
    const compMap = shallowRef<CompMapType>(new Map());

    const onCreateNode = vueUseCreateNodeFunc(props);

    watchEffect(() => {
      if (schemaStr.value !== props?.schemaStr) {
        loading.value = true;
        const schemaObj = JSON.parse(props?.schemaStr) as SchemaRootObj;
        // 加载依赖包
        parsePackage(schemaObj, props?.packageList).then((res) => {
          // 加载组件
          const compRes = parseComponent({
            schemaCompTree: schemaObj?.compTree,
            packageMap: res,
            noMatchCompRender: slots.noMatchComp || defaultNoMatchCompRender,
            noMatchPackageRender:
              slots.noMatchPackage || defaultNoMatchPackageRender,
          });
          packageMap.value = res;
          compMap.value = compRes;
          schemaStr.value = props?.schemaStr;
          loading.value = false;
        });
      }
    });

    return () => {
      // schema变化，重置渲染节点，避免状态管理出现混乱的问题
      if (loading.value || schemaStr.value !== props?.schemaStr) {
        return onCreateNode(
          slots?.loading || defaultLoading,
          undefined,
          undefined
        );
      }

      return onCreateNode(
        RenderByPackage,
        { packageMap: packageMap.value, compMap: compMap.value, ...props },
        slots
      );
    };
  },
});

export default VueRender;
