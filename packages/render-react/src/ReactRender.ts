import { useState, useEffect } from 'react';
import {
  defaultLoading,
  defaultNoMatchCompRender,
  // defaultNoMatchLibRender,
} from './utils';
import SchemaComp from './components/SchemaComp';
import { ReactRenderProps, SchemaCompProps } from './type';
import useCreateNodeFunc from './hooks/useCreateNodeFunc';
import { getSchemaObjFromStr, loadLibList } from '@peeto/core';

const ReactRender = ({
  schemaStr: prevSchemaStr,
  libList,
  loadingRender,
  onCreateCompNode,
  noMatchCompRender = defaultNoMatchCompRender,
  ...props
}: ReactRenderProps) => {
  const [loading, setLoading] = useState(true);
  const [schemaStr, setSchemaStr] = useState<string>();
  // 包集合
  const [modulesMap, setModulesMap] = useState<SchemaCompProps['modulesMap']>(
    new Map()
  );

  const curOnCreateCompNode = useCreateNodeFunc({ onCreateCompNode });

  useEffect(() => {
    if (schemaStr !== prevSchemaStr) {
      setLoading(true);
      const schemaObj = getSchemaObjFromStr(prevSchemaStr);
      // 加载依赖包
      loadLibList(schemaObj, libList).then((res) => {
        setModulesMap(res);
        setSchemaStr(prevSchemaStr);
        setLoading(false);
      });
    }
  }, [libList, prevSchemaStr, schemaStr]);

  // schema变化，重置渲染节点，避免状态管理出现混乱的问题
  if (loading || schemaStr !== prevSchemaStr) {
    return onCreateCompNode({
      comp: loadingRender || defaultLoading,
      props: undefined,
    });
  }

  const res = onCreateCompNode({
    comp: SchemaComp,
    props: {
      modulesMap,
      schemaStr,
      onCreateCompNode: curOnCreateCompNode,
      noMatchCompRender,
      ...props,
    },
  });

  return res;
};
export default ReactRender;
