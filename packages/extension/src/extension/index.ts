import {
  BaseToolBarExtensionProps,
  DispatchEventItem,
  EventMapType,
  EXTENSION_CONFIG_TYPE,
  ExtensionConfig,
  ExtensionRenderProps,
  InjectExtensionConfigFn,
  LeftToolBarExtensionItemProps,
  SimilatorExtensionItemProps,
  SuspenseToolBarExtensionItemProps,
  TopToolBarExtensionItemProps,
} from './type';

export class Extension {
  /**
   * 记录注册的插件
   */
  extensionNames = new Set<BaseToolBarExtensionProps['name']>();
  /**
   * 加载中的插件
   */
  pendingExtensionNum: number = 0;
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
  leftToolBarExtensionList: ExtensionRenderProps<LeftToolBarExtensionItemProps>[] =
    [];
  /**
   * 模拟器
   */
  similatorExtensionList: ExtensionRenderProps<SimilatorExtensionItemProps>[] =
    [];
  /**
   * 顶部工具栏
   */
  topToolBarExtensionList: ExtensionRenderProps<TopToolBarExtensionItemProps>[] =
    [];
  /**
   * 悬浮工具栏
   */
  suspenseToolBarExtensionList: ExtensionRenderProps<SuspenseToolBarExtensionItemProps>[] =
    [];
  /**
   * 配置
   */
  extensionConfig?: ExtensionConfig;

  constructor(c: ExtensionConfig) {
    this.extensionConfig = c;
  }

  /**
   * 注册插件
   * @param fn 插件配置
   */
  async injectExtension(fn: InjectExtensionConfigFn) {
    this.pendingExtensionNum += 1;
    fn().then((config) => {
      if (this.extensionNames.has(config.name)) {
        throw new Error(`已有插件：${config.name}`);
      }
      this.extensionNames.add(config.name);

      let neverType: never;
      switch (config.type) {
        case EXTENSION_CONFIG_TYPE.LEFT_TOOL_BAR:
          this.leftToolBarExtensionList.push(
            this.createExtensionRenderProps(config)
          );
          break;
        case EXTENSION_CONFIG_TYPE.TOP_TOOL_BAR:
          this.topToolBarExtensionList.push(
            this.createExtensionRenderProps(config)
          );
          break;
        case EXTENSION_CONFIG_TYPE.SIMILATOR:
          this.similatorExtensionList.push(
            this.createExtensionRenderProps(config)
          );
          break;
        case EXTENSION_CONFIG_TYPE.SUSPENSE_TOOL_BAR:
          this.suspenseToolBarExtensionList.push(
            this.createExtensionRenderProps(config)
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
  createExtensionRenderProps<
    T extends BaseToolBarExtensionProps = BaseToolBarExtensionProps
  >(config: T): ExtensionRenderProps<T> {
    const res: ExtensionRenderProps<T> = {
      config,
      lifeCycleHooks: {
        onMount: () => {
          this.pendingExtensionNum -= 1;
          // 所有插件挂载完后，清空分发事件队列
          if (this.pendingExtensionNum === 0) {
            // console.log('所有插件加载完成');
            this.extensionConfig?.onAllMount?.();
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
    if (this.pendingExtensionNum !== 0) {
      // console.log('还有插件未加载');
      this.pendingDispatchEventList.push(async () => {
        doEachDispatch();
      });
    } else {
      doEachDispatch();
    }
  }
}

export default Extension;
