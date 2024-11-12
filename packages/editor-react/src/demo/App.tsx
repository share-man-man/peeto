import 'element-plus/dist/index.css';

import './style.less';

// import { StepBackwardOutlined } from '@ant-design/icons';
import { useEffect } from 'react';

import { useEditorWokrBench } from '../components/EditorWorkbench';
import '../style.less';
import ChangeProp from './plugins/ChangeProp';
import SimilatorPlugin, {
  SIMILATOR_CONFIG_CHANGE_EVENT,
} from '../plugins/SimilatorPlugin';
import { EXTENSION_CONFIG_TYPE, EXTENSION_LIB_TYPE } from '@peeto/extension';
import PickComp from '../plugins/PickComp';
import CompConfigEdit from '../plugins/CompConfigEdit';

function Index() {
  const { workbench, injectPlugin } = useEditorWokrBench();

  useEffect(() => {
    injectPlugin(async () => {
      return {
        name: 'ChangeProp',
        // icon: <StepBackwardOutlined />,
        type: EXTENSION_CONFIG_TYPE.LEFT_TOOL_BAR,
        renderProps: {
          libType: EXTENSION_LIB_TYPE.REACT18,
          node: ChangeProp,
        },
      };
    });
    injectPlugin(async () => {
      return {
        name: 'similator',
        type: EXTENSION_CONFIG_TYPE.SIMILATOR,
        renderProps: {
          libType: EXTENSION_LIB_TYPE.REACT18,
          node: SimilatorPlugin,
          nodeProps: {
            configChangeEventName: SIMILATOR_CONFIG_CHANGE_EVENT,
          },
        },
      };
    });
    injectPlugin(async () => {
      return {
        name: 'pick-comp',
        type: EXTENSION_CONFIG_TYPE.TOP_TOOL_BAR,
        renderProps: {
          libType: EXTENSION_LIB_TYPE.REACT18,
          node: PickComp,
        },
      };
    });
    injectPlugin(async () => {
      return {
        name: 'comp-config-edit',
        type: EXTENSION_CONFIG_TYPE.SUSPENSE_TOOL_BAR,
        renderProps: {
          libType: EXTENSION_LIB_TYPE.REACT18,
          node: CompConfigEdit,
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
