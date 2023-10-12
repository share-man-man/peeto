import { h, defineComponent, watchEffect, shallowRef } from 'vue';
import { defaultLoading, defaultProps } from './utils';
import vueUsePackageMap from './hooks/usePackageMap';
import RenderByPackage from './components/RenderByPackage';

const VueRender = defineComponent({
  ...defaultProps,
  setup(props, ctx) {
    const schemaStr = shallowRef<string>();
    const { packageMap } = vueUsePackageMap({
      schemaStr: props.schemaStr,
      packageList: props.packageList,
    });

    watchEffect(() => {
      if (schemaStr.value !== props?.schemaStr) {
        schemaStr.value = props?.schemaStr;
      }
    });

    return () => {
      // schema变化，重置渲染节点，避免状态管理出现混乱的问题
      if (packageMap.value === null || schemaStr.value !== props?.schemaStr) {
        return h(ctx?.slots?.loading || defaultLoading);
      }

      return h(
        RenderByPackage,
        { packageMap: packageMap.value, ...props },
        ctx.slots
      );
    };
  },
});

export default VueRender;
