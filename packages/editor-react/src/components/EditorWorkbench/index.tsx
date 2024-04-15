import { useCallback, useMemo, useRef, useState } from 'react';
import { Flex, Layout } from 'antd';
import LeftToolBar from './conponents/LeftToolBar';
import SimilatorRender from './conponents/SimilatorRender';
import { Plugin } from '@peeto/editor';

const { Header, Footer, Content } = Layout;

const layoutStyle = {
  overflow: 'hidden',
  width: '100%',
};

export const useEditorWokrBench = () => {
  const [injectLoading, setInjectLoading] = useState(false);
  const pluginRef = useRef(
    new Plugin({
      onAllMount: () => {
        setInjectLoading(false);
      },
    })
  );
  // 渲染的ui
  const workbench = useMemo(() => {
    if (injectLoading) {
      // TODO 加载中文案
    }
    return (
      <Flex>
        <Layout style={layoutStyle}>
          <LeftToolBar list={[...pluginRef.current.leftToolBarPluginList]} />
          <Layout>
            <Header>
              顶部工具栏:{pluginRef.current.topToolBarPluginList.length}
            </Header>
            <Content>
              悬浮工具栏 模拟器工具栏
              <SimilatorRender
                list={[...pluginRef.current.similatorPluginList]}
              />
            </Content>
            <Footer>Footer</Footer>
          </Layout>
          {/* <Sider width={200} style={siderStyle}>
            右侧工具栏
          </Sider> */}
        </Layout>
      </Flex>
    );
  }, [injectLoading]);
  const injectPlugin = useCallback<Plugin['injectPlugin']>((...p) => {
    return pluginRef.current.injectPlugin(...p).then(() => {
      setInjectLoading(true);
    });
  }, []);

  return {
    injectPlugin,
    workbench,
  };
};
