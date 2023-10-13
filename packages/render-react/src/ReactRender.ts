import { useState, useEffect, useRef } from 'react';
import {
  defaultLoading,
  defaultNoMatchCompRender,
  defaultNoMatchPackageRender,
} from './utils';
import RenderByPackage from './components/RenderByPackage';
import { ReactRenderProps } from './type';
import useCreateNodeFunc from './hooks/useCreateNodeFunc';
import {
  CompMapType,
  PackageMapType,
  SchemaRootObj,
  parseComponent,
  parsePackage,
} from '@peeto/parse';

const ReactRender = (props: ReactRenderProps) => {
  const [loading, setLoading] = useState(true);
  const [schemaStr, setSchemaStr] = useState<string>();
  // 包集合
  const [packageMap, setPackageMap] = useState<PackageMapType>(new Map());
  // 组件集合
  const [compMap, setCompMap] = useState<CompMapType>(new Map());

  const noMatchCompRenderRef = useRef(props?.noMatchCompRender);
  noMatchCompRenderRef.current = props?.noMatchCompRender;
  const noMatchPackageRenderRef = useRef(props?.noMatchPackageRender);
  noMatchPackageRenderRef.current = props?.noMatchPackageRender;

  const onCreateNode = useCreateNodeFunc(props);

  useEffect(() => {
    if (schemaStr !== props?.schemaStr) {
      setLoading(true);
      const schemaObj = JSON.parse(props?.schemaStr) as SchemaRootObj;
      // 加载依赖包
      parsePackage(schemaObj, props?.packageList).then((res) => {
        // 加载组件
        const compRes = parseComponent({
          schemaCompTree: schemaObj?.compTree,
          packageMap: res,
          noMatchCompRender:
            noMatchCompRenderRef.current || defaultNoMatchCompRender,
          noMatchPackageRender:
            noMatchPackageRenderRef.current || defaultNoMatchPackageRender,
        });
        setPackageMap(res);
        setCompMap(compRes);
        setSchemaStr(props?.schemaStr);
        setLoading(false);
      });
    }
  }, [props?.packageList, props?.schemaStr, schemaStr]);

  // schema变化，重置渲染节点，避免状态管理出现混乱的问题
  if (loading || schemaStr !== props?.schemaStr) {
    return onCreateNode(
      props?.loadingRender || defaultLoading,
      undefined,
      undefined
    );
  }

  return onCreateNode(
    RenderByPackage,
    { packageMap, compMap, ...props, onCreateNode },
    undefined
  );
};
export default ReactRender;
