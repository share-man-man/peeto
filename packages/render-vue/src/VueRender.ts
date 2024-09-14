import { defineComponent, toRefs } from 'vue';
import {
  defaultErrorBoundaryRender,
  defaultLoading,
  defaultNoMatchCompRender,
  defaultProps,
  vueEffect,
  vueState,
} from './utils';
import vueUseCreateNodeFunc from './hooks/useCreateNodeFunc';
import { getSchemaObjFromStr, loadLibList, NodeType } from '@peeto/core';
import { SchemaCompProps } from './type';
import SchemaComp from './components/SchemaComp';

const VueRender = defineComponent({
  ...defaultProps,
  setup(originProps, { slots }) {
    const {
      schemaStr: prevSchemaStr,
      libList,
      onCreateCompNode,
      ...props
    } = toRefs(originProps);

    const [loading, setLoading] = vueState(true);
    const [schemaStr, setSchemaStr] = vueState<string>();
    // 包集合
    const [modulesMap, setModulesMap] = vueState<SchemaCompProps['modulesMap']>(
      new Map()
    );

    const curOnCreateCompNode = vueUseCreateNodeFunc({
      onCreateCompNode: onCreateCompNode?.value,
    });

    vueEffect(
      () => {
        if (schemaStr.value !== prevSchemaStr.value) {
          setLoading(true);
          const schemaObj = getSchemaObjFromStr(prevSchemaStr.value);
          // 加载依赖包
          loadLibList(schemaObj, libList.value).then((res) => {
            setModulesMap(res);
            setSchemaStr(prevSchemaStr.value);
            setLoading(false);
          });
        }
      },
      () => [libList.value, prevSchemaStr.value, schemaStr.value]
    );

    // 显示调用.value，以实现响应式渲染
    return () => {
      // schema变化，重置渲染节点，避免状态管理出现混乱的问题
      if (loading.value || schemaStr.value !== prevSchemaStr.value) {
        return curOnCreateCompNode({
          comp: slots.loadingRender || defaultLoading,
          fields: {},
          parseProps: {
            curSchema: {
              id: '__$loadingRender',
              type: NodeType.COMPONENT,
              componentName: 'loadingRender',
            },
            deepRecursionParse: () => {},
            ctx: {},
            path: [],
            fields: {},
          },
        });
      }
      const res = curOnCreateCompNode({
        comp: SchemaComp,
        fields: {
          props: {
            modulesMap: modulesMap.value,
            schemaStr: schemaStr.value,
            onCreateCompNode: curOnCreateCompNode,
            noMatchCompRender:
              slots.noMatchCompRender || defaultNoMatchCompRender,
            errorBoundaryRender:
              slots.errorBoundaryRender || defaultErrorBoundaryRender,
            ...Object.fromEntries(
              Object.keys(props).map((k) => [
                k,
                props[k as keyof typeof props].value,
              ])
            ),
          },
        },
        parseProps: {
          curSchema: {
            id: '__$schemaComp',
            type: NodeType.COMPONENT,
            componentName: 'SchemaComp',
          },
          deepRecursionParse: () => {},
          ctx: {},
          path: [],
          fields: {},
        },
      });
      return res;
    };
  },
});

export default VueRender;
