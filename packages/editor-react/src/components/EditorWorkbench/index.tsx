import { useCallback, useMemo, useRef, useState } from 'react';
import { Flex, Layout } from 'antd';
import {
  BaseToolBarPluginProps,
  InjectPluginFnType,
  PluginRenderProps,
  SubscribeEventItem,
} from './type';
import LeftToolBar from './conponents/LeftToolBar';
import SimilatorRender from './conponents/SimilatorRender';

const { Header, Footer, Content } = Layout;

const layoutStyle = {
  overflow: 'hidden',
  width: '100%',
};

export const useEditorWokrBench = () => {
  const pluginNameRef = useRef(new Set<BaseToolBarPluginProps['name']>());
  const eventMap = useRef(
    new Map<SubscribeEventItem['name'], SubscribeEventItem['run'][]>()
  );
  // 模拟器
  const [similatorList, setSimilatorList] = useState<PluginRenderProps[]>([]);
  // 左侧工具栏
  const [leftToolBarList, setLeftToolBarList] = useState<PluginRenderProps[]>(
    []
  );
  // 顶部工具栏
  const [topToolBarList, setTopToolBarList] = useState<PluginRenderProps[]>([]);

  const pendingRef = useRef<(() => Promise<void>)[]>([]);
  const pendingNumRef = useRef(0);

  /**
   * 注册插件
   */
  const injectPlugin = useCallback<InjectPluginFnType>(async (runInject) => {
    pendingNumRef.current += 1;
    const pluginProps = runInject();

    const renderProps: PluginRenderProps = {
      config: pluginProps,
      lifeCycleHooks: {
        onMount: () => {
          pendingNumRef.current -= 1;
          // 所有插件挂载完后，清空分发事件队列
          if (pendingNumRef.current === 0) {
            // console.log('所有插件加载完成');
            Promise.all(pendingRef.current.map((i) => i())).then(() => {
              pendingRef.current = [];
            });
          }
        },
      },
      injectProps: {
        subscribeEvent: (subList) => {
          subList.forEach((s) => {
            if (!eventMap.current.has(s.name)) {
              eventMap.current.set(s.name, []);
            }
            eventMap.current.get(s.name)?.push(s.run);
          });
        },
        dispatchEvent: (disList) => {
          // console.log(pluginProps.name, '分发事件');
          // 所有插件还未挂载完成时,放入待执行队列
          if (pendingNumRef.current !== 0) {
            // console.log('还有插件未加载');
            pendingRef.current.push(async () => {
              renderProps.injectProps.dispatchEvent(disList);
            });
          } else {
            disList.forEach((d) => {
              eventMap.current.get(d.name)?.forEach((run) => {
                run(d.paylod);
              });
            });
          }
        },
      },
    };

    if (pluginNameRef.current.has(pluginProps.name)) {
      throw new Error(`已有插件：${pluginProps.name}`);
    }
    pluginNameRef.current.add(pluginProps.name);

    let neverType: never;
    switch (pluginProps.type) {
      case 'left-tool-bar':
        setLeftToolBarList((prev) => {
          return [...prev, renderProps];
        });
        break;
      case 'top-tool-bar':
        setTopToolBarList((prev) => {
          return [...prev, renderProps];
        });
        break;
      case 'similator':
        setSimilatorList((prev) => {
          return [...prev, renderProps];
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
            <Header>顶部工具栏:{topToolBarList.length}</Header>
            <Content>
              悬浮工具栏
              <SimilatorRender list={similatorList} />
            </Content>
            <Footer>Footer</Footer>
          </Layout>
          {/* <Sider width={200} style={siderStyle}>
            右侧工具栏
          </Sider> */}
        </Layout>
      </Flex>
    );
  }, [leftToolBarList, similatorList, topToolBarList.length]);

  return {
    workbench,
    injectPlugin,
  };
};
