import { ReactNode, createElement, useState, useEffect, useRef } from 'react';

import { AnyType, AsyncRender } from '@peeto/parse';
import { ReactRenderProps, asyncLoadCompInPackages } from './utils';

const ReactRender = ({
  schemaStr,
  packageList,
  noMatchCompRender,
  noMatchPackageRender,
}: ReactRenderProps) => {
  const [dom, setDom] = useState<ReactNode>();
  const [packageListState, setPackageListState] = useState(packageList || []);
  const noMatchCompRenderRef = useRef(noMatchCompRender);
  noMatchCompRenderRef.current = noMatchCompRender;
  const noMatchPackageRenderRef = useRef(noMatchPackageRender);
  noMatchPackageRenderRef.current = noMatchPackageRender;

  // TODO 解析state
  const [stateMap, setStateMap] = useState<Record<string, AnyType>>({
    title: '123123',
  });

  // 监听包是否有变更，直接监听packageList，很有肯能会多次渲染
  useEffect(() => {
    if (
      !packageList.every((p) =>
        packageListState.some((_p) => _p.name === p.name)
      )
    ) {
      setPackageListState(packageList);
    }
  }, [packageList, packageListState]);

  useEffect(() => {
    if (!schemaStr || !packageListState) {
      setDom(undefined);
      return;
    }
    AsyncRender<ReactNode>({
      schemaCompTree: JSON.parse(schemaStr),
      getState: (stateNameList) => {
        return stateNameList.map((name) => stateMap?.[name]);
      },
      setState(li) {
        setStateMap({
          ...stateMap,
          ...Object.fromEntries(li.map((i) => [i.name, i.value])),
        });
      },
      onCreateNode: (comp, props, children) => {
        return createElement(comp, props, children);
      },
      asyncLoadComp: (obj) =>
        asyncLoadCompInPackages({
          obj,
          packageList: packageListState,
          noMatchCompRender: noMatchCompRenderRef.current,
          noMatchPackageRender: noMatchPackageRenderRef.current,
        }),
    }).then((res) => {
      setDom(res);
    });
  }, [schemaStr, packageListState, stateMap]);
  return <>{dom}</>;
};
export default ReactRender;
