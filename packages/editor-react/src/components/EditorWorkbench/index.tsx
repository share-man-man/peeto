import { createContext, useCallback, useMemo, useRef, useState } from 'react';
import LeftToolBar from './conponents/LeftToolBar';
import SimilatorRender from './conponents/SimilatorRender';
import { Extension } from '@peeto/extension';
import TopToolBar from './conponents/TopToolBar';
import SuspenseToolBarRender from './conponents/SuspenseToolBarRender';

export const WorkBenchContext = createContext<{ plugin?: Extension }>({});

/**
 * 插件图标点击事件
 */
export const WORK_BENCH_ICON_CLICK_EVENT =
  '__peeto_work_bench_icon_click_event';

export const useEditorWokrBench = () => {
  const [injectLoading, setInjectLoading] = useState(false);
  const pluginRef = useRef(
    new Extension({
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
      // TODO 判断list长度，决定是否隐藏相关模块
      <WorkBenchContext.Provider
        value={{
          plugin: pluginRef.current,
        }}
      >
        <div className="peeto-workbench">
          <LeftToolBar list={[...pluginRef.current.leftToolBarExtensionList]} />
          <div className="peeto-workbench-content">
            <TopToolBar list={[...pluginRef.current.topToolBarExtensionList]} />
            <div className="peeto-workbench-content-similator">
              <div className="peeto-workbench-content-similator-content">
                {/* 悬浮工具栏 */}
                <SuspenseToolBarRender
                  list={[...pluginRef.current.suspenseToolBarExtensionList]}
                />
                {/* 模拟器工具栏 */}
                {/* TODO 所有Similator、simulator拼写错误，文件夹也要修改 */}
                <SimilatorRender
                  list={[...pluginRef.current.similatorExtensionList]}
                />
              </div>
            </div>
            <div className="peeto-workbench-content-footer">Footer</div>
          </div>
          {/* <div>右侧工具栏</div> */}
        </div>
      </WorkBenchContext.Provider>
    );
  }, [injectLoading]);
  const injectPlugin = useCallback<Extension['injectExtension']>((...p) => {
    return pluginRef.current.injectExtension(...p).then(() => {
      setInjectLoading(true);
    });
  }, []);

  return {
    injectPlugin,
    workbench,
  };
};
