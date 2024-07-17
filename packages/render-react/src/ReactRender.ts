import { useState, useEffect } from 'react';
import {
  defaultLoading,
  defaultNoMatchCompRender,
  defaultNoMatchLibRender,
} from './utils';
import SchemaComp, { SchemaCompProps } from './components/SchemaComp';
import { ReactRenderProps } from './type';
import useCreateNodeFunc from './hooks/useCreateNodeFunc';
import { getSchemaObjFromStr, loadLibList } from '@peeto/core';

const ReactRender = (props: ReactRenderProps) => {
  const [loading, setLoading] = useState(true);
  const [schemaStr, setSchemaStr] = useState<string>();
  // 包集合
  const [libListMap, setLibListMap] = useState<SchemaCompProps['libListMap']>(
    new Map()
  );

  const onCreateCompNode = useCreateNodeFunc(props);

  useEffect(() => {
    if (schemaStr !== props?.schemaStr) {
      setLoading(true);
      const schemaObj = getSchemaObjFromStr(props?.schemaStr);
      // 加载依赖包
      loadLibList(schemaObj, props?.libList).then((res) => {
        setLibListMap(res);
        setSchemaStr(props?.schemaStr);
        setLoading(false);
      });
    }
  }, [props?.libList, props?.schemaStr, schemaStr]);

  // schema变化，重置渲染节点，避免状态管理出现混乱的问题
  if (loading || schemaStr !== props?.schemaStr) {
    return onCreateCompNode({
      comp: props?.loadingRender || defaultLoading,
      props: undefined,
    });
  }

  const res = onCreateCompNode({
    comp: SchemaComp,
    props: {
      schemaStr,
      onCreateCompNode,
      onNodeChange: props.onNodeChange,
      libListMap,
      noMatchCompRender: props.noMatchCompRender || defaultNoMatchCompRender,
      noMatchLibRender: props.noMatchLibRender || defaultNoMatchLibRender,
    },
  });

  return res;
};
export default ReactRender;
