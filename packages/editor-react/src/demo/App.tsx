import 'element-plus/dist/index.css';

import { ReactNode, useEffect, useLayoutEffect, useState } from 'react';
import { createApp } from 'vue';
import VueApp from './components/VueApp/App.vue';
import ReactApp from './components/ReactApp';
import { Radio } from 'antd';

const VUE_APP_ID = 'vue-app';
let VUE_APP_OBJ: ReturnType<typeof createApp> | null = null;

const Index = () => {
  const [type, setType] = useState<'vue' | 'react'>();
  const [child, setChild] = useState<ReactNode>(<div>当前版本:{type}</div>);
  useEffect(() => {
    if (type === 'vue') {
      setChild(<div id={VUE_APP_ID}>vue编辑器</div>);
    }
    if (type === 'react') {
      setChild(<ReactApp />);
    }
  }, [type]);

  useLayoutEffect(() => {
    if (type === 'vue' && document.getElementById(VUE_APP_ID)) {
      const app = createApp(VueApp);
      app.mount(`#${VUE_APP_ID}`);
      VUE_APP_OBJ = app;
    }

    return () => {
      if (VUE_APP_OBJ) {
        VUE_APP_OBJ.unmount();
        VUE_APP_OBJ = null;
      }
    };
  }, [child, type]);
  return (
    <div>
      <div>
        <Radio.Group
          onChange={(v) => {
            if (VUE_APP_OBJ) {
              VUE_APP_OBJ.unmount();
              VUE_APP_OBJ = null;
            }
            setType(v.target.value);
          }}
          value={type}
        >
          <Radio value={'react'}>react</Radio>
          <Radio value={'vue'}>vue</Radio>
        </Radio.Group>
      </div>
      <div>{child}</div>
    </div>
  );
};

export default Index;
