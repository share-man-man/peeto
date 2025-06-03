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

  constructor(c: EditorConfig) {
    this.editorConfig = c;
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
  }

  getExtensionByName(name: Extension['config']['name']): Extension | undefined {
    return this.extensionMap.get(name);
  }

  /**
   * 编辑器挂载完成
   */
  onMounted() {
    return new Promise<Editor>((res) => {
      setTimeout(() => {
        res(this);
      }, 3000);
    });
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
