import { ReactRender, ReactRenderProps } from '@peeto/render-react';
import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ReactAppProps } from './type';

import {
  AppActionRef,
  SimilatorPluginCompDomMap,
  SimilatorPluginConfig,
} from '../../type';
import { generateKey } from '../..';
import { getCompDomMap } from './util';

const App = ({ actionRef }: ReactAppProps) => {
  const [schemaStr, setSchemaStr] =
    useState<SimilatorPluginConfig['schemaStr']>();
  const [packageList, setPackageList] =
    useState<SimilatorPluginConfig['packageList']>();
  const peetoPrivateKey = useMemo(() => generateKey(), []);
  const renderNodeRef = useRef<ReactNode | ReactNode[] | null>(null);

  const onGetMap = useCallback<AppActionRef['getMap']>(() => {
    // 获取组件包含的dom（不包含子组件的dom）
    const node = renderNodeRef.current;
    let map: SimilatorPluginCompDomMap = new Map();
    if (schemaStr && packageList) {
      map = getCompDomMap({
        node,
        schemaStr,
        peetoPrivateKey,
      });
    }
    return map;
  }, [packageList, peetoPrivateKey, schemaStr]);
  const onGetMapRef = useRef(onGetMap);
  onGetMapRef.current = onGetMap;

  useEffect(() => {
    actionRef({
      getMap: () => {
        return onGetMapRef.current();
      },
      setConfig: (config) => {
        setSchemaStr(config.schemaStr);
        setPackageList(config.packageList);
      },
    });
  }, [actionRef]);

  const onNodeChange = useCallback<Required<ReactRenderProps>['onNodeChange']>(
    (node) => {
      // 存储虚拟dom
      renderNodeRef.current = node;
    },
    []
  );

  const onCreateNode = useCallback<Required<ReactRenderProps>['onCreateNode']>(
    (Comp, p, children) => {
      const res = (
        <Comp
          {...{
            ...p,
            // 传入私有参数原因：@antd.Button会重新定义子组件的key，导致无法在fiber节点通过key获取组件配置
            [peetoPrivateKey]: p?.key,
          }}
        >
          {children}
        </Comp>
      );

      return res;
    },
    [peetoPrivateKey]
  );

  return (
    <div>
      {schemaStr && packageList && (
        <ReactRender
          schemaStr={schemaStr}
          packageList={packageList}
          onNodeChange={onNodeChange}
          onCreateNode={onCreateNode}
          loadingRender={() => {
            return <div>react-loading</div>;
          }}
          noMatchPackageRender={({ id: componentId, packageName }) => (
            <div
              key={`nomatch-package-${componentId}`}
              style={{
                color: 'red',
                borderWidth: 2,
                borderStyle: 'solid',
                borderColor: 'red',
                padding: 12,
              }}
            >
              没有找到包:{packageName}
            </div>
          )}
          noMatchCompRender={({
            id: componentId,
            componentName,
            packageName,
          }) => (
            <div
              key={`nomatch-package-component-${componentId}`}
              style={{
                color: 'red',
                borderWidth: 2,
                borderStyle: 'solid',
                borderColor: 'red',
                padding: 12,
              }}
            >
              包:{packageName}里没有找到组件:{componentName}
            </div>
          )}
        />
      )}
    </div>
  );
};

export default App;
