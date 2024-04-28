import {
  BaseToolBarPluginProps,
  DispatchEventItem,
  EventMapType,
  InjectPluginConfigFn,
  LeftToolBarPluginItemProps,
  PLUGIN_CONFIG_TYPE,
  PluginConfig,
  PluginRenderProps,
  SimilatorPluginItemProps,
  SuspenseToolBarPluginItemProps,
  TopToolBarPluginItemProps,
} from './type';

export class Plugin {
  /**
   * 记录注册的插件
   */
  pluginNames = new Set<BaseToolBarPluginProps['name']>();
  /**
   * 加载中的插件
   */
  pendingPluginNum: number = 0;
  /**
   * 待分发事件
   */
  pendingDispatchEventList: (() => Promise<void>)[] = [];
  /**
   * 事件集合
   */
  eventMap: EventMapType = new Map();
  /**
   * 左侧工具栏
   */
  leftToolBarPluginList: PluginRenderProps<LeftToolBarPluginItemProps>[] = [];
  /**
   * 模拟器
   */
  similatorPluginList: PluginRenderProps<SimilatorPluginItemProps>[] = [];
  /**
   * 顶部工具栏
   */
  topToolBarPluginList: PluginRenderProps<TopToolBarPluginItemProps>[] = [];
  /**
   * 悬浮工具栏
   */
  suspenseToolBarPluginList: PluginRenderProps<SuspenseToolBarPluginItemProps>[] =
    [];
  /**
   * 配置
   */
  pluginConfig?: PluginConfig;

  constructor(c: PluginConfig) {
    this.pluginConfig = c;
  }

  /**
   * 注册插件
   * @param fn 插件配置
   */
  async injectPlugin(fn: InjectPluginConfigFn) {
    this.pendingPluginNum += 1;
    fn().then((config) => {
      if (this.pluginNames.has(config.name)) {
        throw new Error(`已有插件：${config.name}`);
      }
      this.pluginNames.add(config.name);

      let neverType: never;
      switch (config.type) {
        case PLUGIN_CONFIG_TYPE.LEFT_TOOL_BAR:
          this.leftToolBarPluginList.push(this.createPluginRenderProps(config));
          break;
        case PLUGIN_CONFIG_TYPE.TOP_TOOL_BAR:
          this.topToolBarPluginList.push(this.createPluginRenderProps(config));
          break;
        case PLUGIN_CONFIG_TYPE.SIMILATOR:
          this.similatorPluginList.push(this.createPluginRenderProps(config));
          break;
        case PLUGIN_CONFIG_TYPE.SUSPENSE_TOOL_BAR:
          this.suspenseToolBarPluginList.push(
            this.createPluginRenderProps(config)
          );
          break;
        default:
          neverType = config;
          if (neverType) {
            throw new Error(`未知的工具栏类型：${neverType}`);
          }
          break;
      }
    });
  }

  /**
   * 创建插件渲染参数
   * @param config
   * @returns
   */
  createPluginRenderProps<
    T extends BaseToolBarPluginProps = BaseToolBarPluginProps
  >(config: T): PluginRenderProps<T> {
    const res: PluginRenderProps<T> = {
      config,
      lifeCycleHooks: {
        onMount: () => {
          this.pendingPluginNum -= 1;
          // 所有插件挂载完后，清空分发事件队列
          if (this.pendingPluginNum === 0) {
            // console.log('所有插件加载完成');
            this.pluginConfig?.onAllMount?.();
            Promise.all(this.pendingDispatchEventList.map((i) => i())).then(
              () => {
                this.pendingDispatchEventList = [];
              }
            );
          }
        },
      },
      injectProps: {
        subscribeEvent: (subList) => {
          subList.forEach((s) => {
            if (!this.eventMap.has(s.name)) {
              this.eventMap.set(s.name, []);
            }
            // TODO 优化点：排除多次订阅的情况
            this.eventMap.get(s.name)?.push({
              name: s.name,
              renderProps: res,
              run: s.run,
            });
          });
        },
        dispatchEvent: (li) => {
          this.dispatchEvent(li);
        },
      },
    };

    return res;
  }

  /**
   * 分发事件
   * @param disList
   */
  dispatchEvent(disList: DispatchEventItem[]) {
    const doEachDispatch = () => {
      disList.forEach((d) => {
        let li = this.eventMap.get(d.name);
        if (d.filtert) {
          li = li?.filter(d.filtert);
        }
        li?.forEach(({ run }) => {
          run(d.paylod);
        });
      });
    };
    // 所有插件还未挂载完成时,放入待执行队列
    if (this.pendingPluginNum !== 0) {
      // console.log('还有插件未加载');
      this.pendingDispatchEventList.push(async () => {
        doEachDispatch();
      });
    } else {
      doEachDispatch();
    }
  }
}

export default Plugin;
