import { Extension, ExtensionConfig } from '@peeto/extension';
import { EditorConfig } from './type';

export class Editor {
  /**
   * 编辑器配置
   */
  editorConfig?: EditorConfig;
  /**
   * 扩展集合
   */
  extensionMap = new Map<ExtensionConfig['name'], Extension>();
  /**
   * 加载中的插件数量
   */
  pendingExtensionNum: number = 0;
  // /**
  //  * 待分发事件
  //  */
  // pendingDispatchEventList: (() => Promise<void>)[] = [];
  // /**
  //  * 事件集合
  //  */
  // eventMap: EventMapType = new Map();
  // /**
  //  * 左侧工具栏
  //  */
  // leftToolBarExtensionList: ExtensionRenderProps<LeftToolBarExtensionItemProps>[] =
  //   [];
  // /**
  //  * 顶部工具栏
  //  */
  // topToolBarExtensionList: ExtensionRenderProps<TopToolBarExtensionItemProps>[] =
  //   [];
  // /**
  //  * 悬浮工具栏
  //  */
  // suspenseToolBarExtensionList: ExtensionRenderProps<SuspenseToolBarExtensionItemProps>[] =
  //   [];

  constructor(c: EditorConfig) {
    this.editorConfig = c;
    this._start();
  }

  /**
   * 启动编辑器
   */
  private async _start() {
    await this.editorConfig?.onBeforeInit?.();
    // 执行某些初始化操作
    // ... do sth
    // 初始化完成
    await this.editorConfig?.onMounted?.();
  }

  /**
   * 注册扩展
   */
  async injectExtension(extension: Extension) {
    if (this.extensionMap.has(extension.getName())) {
      throw new Error(`已注册扩展：${extension.getName()}`);
    }
    // 存储扩展实例
    this.extensionMap.set(extension.getName(), extension);

    this.editorConfig?.onInjectSuccess?.();

    // this.pendingExtensionNum += 1;

    // fn().then((config) => {
    //   if (this.extensionNames.has(config.name)) {
    //     throw new Error(`已有插件：${config.name}`);
    //   }
    //   this.extensionNames.add(config.name);

    //   let neverType: never;
    //   switch (config.type) {
    //     case EXTENSION_CONFIG_TYPE.LEFT_TOOL_BAR:
    //       this.leftToolBarExtensionList.push(
    //         this.createExtensionRenderProps(config)
    //       );
    //       break;
    //     case EXTENSION_CONFIG_TYPE.TOP_TOOL_BAR:
    //       this.topToolBarExtensionList.push(
    //         this.createExtensionRenderProps(config)
    //       );
    //       break;
    //     case EXTENSION_CONFIG_TYPE.SUSPENSE_TOOL_BAR:
    //       this.suspenseToolBarExtensionList.push(
    //         this.createExtensionRenderProps(config)
    //       );
    //       break;
    //     default:
    //       neverType = config;
    //       if (neverType) {
    //         throw new Error(`未知的工具栏类型：${neverType}`);
    //       }
    //       break;
    //   }
    // });
  }

  getExtensionByName(name: Extension['config']['name']): Extension | undefined {
    return this.extensionMap.get(name);
  }

  /**
   * 编辑器挂载完成
   */
  onMounted() {
    // 创建所有面板容器
    // 注册扩展（扩展订阅事件）
    // 遍历扩展，创建顶侧容器，并缓存
    // 遍历扩展，创建左侧容器，并缓存
    // 遍历扩展，创建底部容器，并缓存
    // 遍历扩展，创建随便容器，并缓存
    // 遍历扩展，创建模拟器容器，并缓存
    // 遍历扩展，创建······
    // 默认唤醒左侧面板第一个扩展
    // 默认唤醒······
    // 判断是否已有容器对象，没有需要调用创建容器，然后缓存
    // 切换面板，缓存最新容器对象
    // 创建底部容器
  }

  // /**
  //  * 创建插件渲染参数
  //  * @param config
  //  * @returns
  //  */
  // createExtensionRenderProps<
  //   T extends BaseToolBarExtensionProps = BaseToolBarExtensionProps
  // >(config: T): ExtensionRenderProps<T> {
  //   const res: ExtensionRenderProps<T> = {
  //     config,
  //     lifeCycleHooks: {
  //       onMount: () => {
  //         this.pendingExtensionNum -= 1;
  //         // 所有插件挂载完后，清空分发事件队列
  //         if (this.pendingExtensionNum === 0) {
  //           // console.log('所有插件加载完成');
  //           this.extensionConfig?.onAllMount?.();
  //           Promise.all(this.pendingDispatchEventList.map((i) => i())).then(
  //             () => {
  //               this.pendingDispatchEventList = [];
  //             }
  //           );
  //         }
  //       },
  //     },
  //     injectProps: {
  //       subscribeEvent: (subList) => {
  //         subList.forEach((s) => {
  //           if (!this.eventMap.has(s.name)) {
  //             this.eventMap.set(s.name, []);
  //           }
  //           // TODO 优化点：排除多次订阅的情况
  //           this.eventMap.get(s.name)?.push({
  //             name: s.name,
  //             renderProps: res,
  //             run: s.run,
  //           });
  //         });
  //       },
  //       dispatchEvent: (li) => {
  //         this.dispatchEvent(li);
  //       },
  //     },
  //   };

  //   return res;
  // }

  // /**
  //  * 分发事件
  //  * @param disList
  //  */
  // dispatchEvent(disList: DispatchEventItem[]) {
  //   const doEachDispatch = () => {
  //     disList.forEach((d) => {
  //       let li = this.eventMap.get(d.name);
  //       if (d.filtert) {
  //         li = li?.filter(d.filtert);
  //       }
  //       li?.forEach(({ run }) => {
  //         run(d.paylod);
  //       });
  //     });
  //   };
  //   // 所有插件还未挂载完成时,放入待执行队列
  //   if (this.pendingExtensionNum !== 0) {
  //     // console.log('还有插件未加载');
  //     this.pendingDispatchEventList.push(async () => {
  //       doEachDispatch();
  //     });
  //   } else {
  //     doEachDispatch();
  //   }
  // }
}

export default Editor;
