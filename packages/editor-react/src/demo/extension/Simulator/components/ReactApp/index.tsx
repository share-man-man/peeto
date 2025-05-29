import { ReactRender, ReactRenderProps } from '@peeto/render-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactAppProps } from './type';

import { SimulatorConfigType } from '../../type';

const App = ({ actionRef, peetoPrivateKey }: ReactAppProps) => {
  const [schemaStr, setSchemaStr] =
    useState<SimulatorConfigType['schemaStr']>();
  const [packageList, setPackageList] =
    useState<SimulatorConfigType['packageList']>();

  useEffect(() => {
    actionRef({
      setConfig: (config) => {
        setSchemaStr(config.schemaStr);
        setPackageList(config.packageList);
      },
    });
  }, [actionRef]);

  const onCreateNode = useCallback<
    Required<ReactRenderProps>['onCreateCompNode']
  >(
    ({ comp: Comp, fields, parseProps }) => {
      const k = fields.props?.key || parseProps.curSchema.id;
      const res = (
        <Comp
          {...{
            key: k,
            ...fields.props,
            // 传入私有参数原因：@antd.Button会重新定义子组件的key，导致无法在fiber节点通过key获取组件配置
            [peetoPrivateKey]: k,
          }}
        />
      );

      return res;
    },
    [peetoPrivateKey]
  );

  const renderFlag = useMemo(() => {
    return schemaStr && packageList;
  }, [packageList, schemaStr]);

  return (
    <div>
      {renderFlag && (
        <ReactRender
          schemaStr={schemaStr || '{}'}
          libList={packageList || []}
          // onNodeChange={onNodeChange}
          onCreateCompNode={onCreateNode}
          loadingRender={() => {
            return <div>react-loading</div>;
          }}
          // noMatchPackageRender={({ id: componentId, packageName }) => (
          //   <div
          //     key={`nomatch-package-${componentId}`}
          //     style={{
          //       color: 'red',
          //       borderWidth: 2,
          //       borderStyle: 'solid',
          //       borderColor: 'red',
          //       padding: 12,
          //     }}
          //   >
          //     没有找到包:{packageName}
          //   </div>
          // )}
          // noMatchCompRender={({
          //   id: componentId,
          //   componentName,
          //   packageName,
          // }) => (
          //   <div
          //     key={`nomatch-package-component-${componentId}`}
          //     style={{
          //       color: 'red',
          //       borderWidth: 2,
          //       borderStyle: 'solid',
          //       borderColor: 'red',
          //       padding: 12,
          //     }}
          //   >
          //     包:{packageName}里没有找到组件:{componentName}
          //   </div>
          // )}
        />
      )}
    </div>
  );
};

export default App;
