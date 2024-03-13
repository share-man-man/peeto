import { useCallback, useMemo, useRef, useState } from 'react';
import { Flex, Layout } from 'antd';
import {
  BaseToolBarPluginProps,
  InjectPluginCompProps,
  InjectPluginProps,
  LeftToolBarPluginItemProps,
  SubscribeEventItem,
  TopToolBarPluginItemProps,
} from './type';
import LeftToolBar from './conponents/LeftToolBar';

const { Header, Footer, Content } = Layout;

// TODO
const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  height: 64,
  paddingInline: 48,
  lineHeight: '64px',
  backgroundColor: '#4096ff',
};

const contentStyle: React.CSSProperties = {
  textAlign: 'center',
  minHeight: 120,
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#0958d9',
};

const footerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  backgroundColor: '#4096ff',
};

const layoutStyle = {
  // borderRadius: 8,
  overflow: 'hidden',
  width: '100%',
};

export const useEditorWokrBench = () => {
  const pluginNameRef = useRef(new Set<BaseToolBarPluginProps['name']>());
  const eventMap = useRef(
    new Map<SubscribeEventItem['name'], SubscribeEventItem['run'][]>()
  );
  // 左侧工具栏
  const [leftToolBarList, setLeftToolBarList] = useState<
    LeftToolBarPluginItemProps[]
  >([]);
  // 顶部工具栏
  const [topToolBarList, setTopToolBarList] = useState<
    TopToolBarPluginItemProps[]
  >([]);

  /**
   * 注册插件
   */
  const injectPlugin = useCallback<InjectPluginProps>(async (runInject) => {
    // 插件订阅事件
    const subscribeEvent: InjectPluginCompProps['subscribeEvent'] = (
      subList
    ) => {
      subList.forEach((s) => {
        if (!eventMap.current.has(s.name)) {
          eventMap.current.set(s.name, []);
        }
        eventMap.current.get(s.name)?.push(s.run);
      });
    };
    // 插件分发事件
    const dispatchEvent: InjectPluginCompProps['dispatchEvent'] = (disList) => {
      disList.forEach((d) => {
        eventMap.current.get(d.name)?.forEach((run) => {
          run(d.paylod);
        });
      });
    };
    const pluginProps = runInject();

    if (pluginNameRef.current.has(pluginProps.name)) {
      throw new Error(`已有插件：${pluginProps.name}`);
    }
    pluginNameRef.current.add(pluginProps.name);
    pluginProps.renderProps.props = {
      dispatchEvent,
      subscribeEvent,
      ...pluginProps.renderProps.props,
    };

    let neverType: never;
    switch (pluginProps.type) {
      case 'left-tool-bar':
        setLeftToolBarList((prev) => {
          return [...prev, pluginProps];
        });
        break;
      case 'top-tool-bar':
        setTopToolBarList((prev) => {
          return [...prev, pluginProps];
        });
        break;
      default:
        neverType = pluginProps;
        if (neverType) {
          throw new Error(`未知的工具栏类型：${neverType}`);
        }
        break;
    }
  }, []);

  // 渲染的ui
  const workbench = useMemo(() => {
    return (
      <Flex>
        <Layout style={layoutStyle}>
          <LeftToolBar list={leftToolBarList} />
          <Layout>
            <Header style={headerStyle}>
              顶部工具栏:{topToolBarList.length}
            </Header>
            <Content style={contentStyle}>
              悬浮工具栏
              <div>渲染器</div>
            </Content>
            <Footer style={footerStyle}>Footer</Footer>
          </Layout>
          {/* <Sider width={200} style={siderStyle}>
            右侧工具栏
          </Sider> */}
        </Layout>
      </Flex>
    );
  }, [leftToolBarList, topToolBarList.length]);

  return {
    workbench,
    injectPlugin,
  };
};
