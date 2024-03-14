import 'element-plus/dist/index.css';

import { PackageListType } from '@peeto/parse';
import { StepBackwardOutlined, PlusOutlined } from '@ant-design/icons';
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { Descriptions, Radio, Typography } from 'antd';
import { h } from 'vue';

import { EDITOR_LIB_TYPE } from '../type';

import VueTest from './components/MyTest.vue';
import MyButton from './components/MyButton.vue';
import { useEditorWokrBench } from '../components/EditorWorkbench';
import TestPlugin from './plugins/TestPlugin';
import TestPlugin2 from './plugins/TestPlugin2';
import TestVuePlugin from './plugins/TestVuePlugin/SchemaChange.vue';
// import { SimilatorPluginCompDomMap } from '../components/EditorSimilator/type';
import ChangeProp from './plugins/ChangeProp';
import SimilatorPlugin from '../plugins/SimilatorPlugin';

function Index() {
  // const mapRef = useRef<SimilatorPluginCompDomMap>(new Map());

  const { workbench, injectPlugin } = useEditorWokrBench();

  useEffect(() => {
    injectPlugin(() => {
      return {
        name: 'ChangeProp',
        icon: <StepBackwardOutlined />,
        type: 'left-tool-bar',
        renderProps: {
          libType: EDITOR_LIB_TYPE.REACT,
          node: ChangeProp,
        },
      };
    });
    injectPlugin(() => {
      return {
        name: 'similator',
        type: 'similator',
        renderProps: {
          libType: EDITOR_LIB_TYPE.REACT,
          node: SimilatorPlugin,
        },
      };
    });
    // injectPlugin(() => {
    //   return {
    //     name: 'TestPlugin',
    //     icon: <StepBackwardOutlined />,
    //     type: 'left-tool-bar',
    //     renderProps: {
    //       libType: EDITOR_LIB_TYPE.REACT,
    //       node: TestPlugin,
    //     },
    //   };
    // });
    // injectPlugin(() => {
    //   return {
    //     name: 'TestPlugin2',
    //     icon: <PlusOutlined />,
    //     type: 'left-tool-bar',
    //     renderProps: {
    //       libType: EDITOR_LIB_TYPE.REACT,
    //       node: TestPlugin2,
    //     },
    //     pannelWidth: 500,
    //   };
    // });
    // injectPlugin(() => {
    //   return {
    //     name: 'TestVuePlugin',
    //     icon: <PlusOutlined />,
    //     type: 'left-tool-bar',
    //     renderProps: {
    //       libType: EDITOR_LIB_TYPE.VUE,
    //       node: TestVuePlugin,
    //     },
    //     pannelWidth: 500,
    //   };
    // });
  }, [injectPlugin]);

  return (
    <div>
      {workbench}

      <Typography.Title level={3}>渲染效果</Typography.Title>
      {/* <div
        onClick={(e) => {
          mapRef.current.forEach((doms, key) => {
            if (doms.includes(e.target as HTMLElement)) {
              // TODO 合并dom，获取最大宽高
              console.log(11, key);
            }
          });
        }}
      >
        {libType && curConfig?.schema && curConfig.packageList && (
          <EditorSimilator
            type={libType}
            schemaStr={curConfig.schema}
            packageList={curConfig.packageList}
            // delay={500}
            onMapChange={(map) => {
              // console.log('映射关系', map);
              mapRef.current = map;
            }}
          />
        )}
      </div> */}
    </div>
  );
}

export default Index;
