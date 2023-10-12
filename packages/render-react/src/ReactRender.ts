import { createElement, useState, useEffect } from 'react';

import { ReactRenderProps } from './utils';
import usePackageMap from './hooks/usePackageMap';
import RenderByPackage from './components/RenderByPackage';

const ReactRender = (props: ReactRenderProps) => {
  const [schemaStr, setSchemaStr] = useState<string>();
  const { packageMap } = usePackageMap({
    schemaStr: props.schemaStr,
    packageList: props.packageList,
  });

  useEffect(() => {
    if (schemaStr !== props?.schemaStr) {
      setSchemaStr(props?.schemaStr);
    }
  }, [props?.schemaStr, schemaStr]);

  // schema变化，重置渲染节点，避免状态管理出现混乱的问题
  if (packageMap === null || schemaStr !== props?.schemaStr) {
    return;
  }

  return createElement(RenderByPackage, { packageMap, ...props });
};
export default ReactRender;
