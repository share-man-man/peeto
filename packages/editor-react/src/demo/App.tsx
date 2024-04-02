import 'element-plus/dist/index.css';

import { StepBackwardOutlined } from '@ant-design/icons';
import { useEffect } from 'react';

import { EDITOR_LIB_TYPE } from '../type';

import { useEditorWokrBench } from '../components/EditorWorkbench';
import ChangeProp from './plugins/ChangeProp';
import SimilatorPlugin from '../plugins/SimilatorPlugin';

function Index() {
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

  return <div>{workbench}</div>;
}

export default Index;
