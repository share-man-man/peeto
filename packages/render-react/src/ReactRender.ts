import { useState, useEffect, useRef } from 'react';
import {
  defaultLoading,
  defaultNoMatchCompRender,
  defaultNoMatchPackageRender,
} from './utils';
// import RenderByPackage from './components/RenderByPackage';
import SchemaComp, { SchemaCompProps } from './components/SchemaComp';
import { ReactRenderProps } from './type';
import useCreateNodeFunc from './hooks/useCreateNodeFunc';
import {
  // CompMapType,
  // LibListMapType,
  getSchemaObjFromStr,
  loadLibList,
  // parseComponent,
} from '@peeto/parse';

const ReactRender = (props: ReactRenderProps) => {
  const [loading, setLoading] = useState(true);
  const [schemaStr, setSchemaStr] = useState<string>();
  // 包集合
  const [libListMap, setLibListMap] = useState<SchemaCompProps['libListMap']>(
    new Map()
  );
  // // 组件集合
  // const [compMap, setCompMap] = useState<CompMapType>(new Map());

  const noMatchCompRenderRef = useRef(props?.noMatchCompRender);
  noMatchCompRenderRef.current = props?.noMatchCompRender;
  const noMatchPackageRenderRef = useRef(props?.noMatchPackageRender);
  noMatchPackageRenderRef.current = props?.noMatchPackageRender;

  const onCreateNode = useCreateNodeFunc(props);

  useEffect(() => {
    if (schemaStr !== props?.schemaStr) {
      setLoading(true);

      const schemaObj = getSchemaObjFromStr(props?.schemaStr);
      // 加载依赖包
      loadLibList(schemaObj, props?.libList).then((res) => {
        // // 加载组件
        // const compRes = parseComponent({
        //   schemaCompTree: schemaObj?.compTree,
        //   libListMap: res,
        //   compTreeLibMap: schemaObj.compTreeLibMap,
        //   noMatchCompRender:
        //     noMatchCompRenderRef.current || defaultNoMatchCompRender,
        //   noMatchPackageRender:
        //     noMatchPackageRenderRef.current || defaultNoMatchPackageRender,
        // });
        // setPackageMap(res);
        // setCompMap(compRes);
        setLibListMap(res);
        setSchemaStr(props?.schemaStr);
        setLoading(false);
      });
    }
  }, [props?.libList, props?.schemaStr, schemaStr]);

  // schema变化，重置渲染节点，避免状态管理出现混乱的问题
  if (loading || schemaStr !== props?.schemaStr) {
    return onCreateNode({
      comp: props?.loadingRender || defaultLoading,
      props: undefined,
      children: undefined,
    });
  }

  const res = onCreateNode({
    comp: SchemaComp,
    props: {
      schemaStr,
      onCreateNode,
      onNodeChange: props.onNodeChange,
      libListMap,
      noMatchCompRender:
        noMatchCompRenderRef.current || defaultNoMatchCompRender,
      noMatchPackageRender:
        noMatchPackageRenderRef.current || defaultNoMatchPackageRender,
    },
    children: undefined,
  });

  return res;
};
export default ReactRender;
