import 'element-plus/dist/index.css';
import '../components/EditorWorkbench/style.less';

import './style.less';

// import { StepBackwardOutlined } from '@ant-design/icons';
import { useEffect } from 'react';

import { useEditorWokrBench } from '../components/EditorWorkbench';
import ChangeProp from './plugins/ChangeProp';
import SimilatorPlugin from '../plugins/SimilatorPlugin';
import { PLUGIN_CONFIG_TYPE, PLUGIN_LIB_TYPE } from '@peeto/editor';

function Index() {
  const { workbench, injectPlugin } = useEditorWokrBench();

  useEffect(() => {
    injectPlugin(async () => {
      return {
        name: 'ChangeProp',
        // icon: <StepBackwardOutlined />,
        type: PLUGIN_CONFIG_TYPE.LEFT_TOOL_BAR,
        renderProps: {
          libType: PLUGIN_LIB_TYPE.REACT18,
          node: ChangeProp,
        },
      };
    });
    injectPlugin(async () => {
      return {
        name: 'similator',
        type: PLUGIN_CONFIG_TYPE.SIMILATOR,
        renderProps: {
          libType: PLUGIN_LIB_TYPE.REACT18,
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

  return <div>{workbench}</div>;
}

export default Index;
