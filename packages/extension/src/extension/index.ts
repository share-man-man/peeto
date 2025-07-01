import { AnyType, GetSetType } from '@peeto/core';
import { ExtensionConfig } from './type';
import { ToolBar } from '../utils/promise-pending';

export enum EVENT_NAME {
  /**
   * 顶部工具栏状态改变
   */
  TOP_TOOL_BAR_ACTIVE_CHANGE = 'TOP_TOOL_BAR_ACTIVE_CHANGE',
}

export class Extension {
  private name: ExtensionConfig['name'];
  private activityBarIcon?: HTMLElement;
  panel = new ToolBar();
  simulator = new ToolBar();
  suspenseToolBar = new ToolBar();
  topToolBar = new ToolBar();
  rightToolPanel = new ToolBar();
  private apiMap = new Map<string, AnyType>();
  private _events = {
    [EVENT_NAME.TOP_TOOL_BAR_ACTIVE_CHANGE]: new Set<(f: boolean) => void>(),
  };
  config: ExtensionConfig;

  constructor(c: ExtensionConfig) {
    this.name = c.name;
    this.config = c;
    // this.suspenseToolBarContainer = document.createElement('div');
    this.activityBarIcon = c.activityBarIcon?.();
    // this.topToolBarIcon = c.topToolBarIcon?.({ extension: this });
  }

  /**
   * 获取扩展名称
   * @returns
   */
  getName() {
    return this.name;
  }

  // getSuspenseToolBarContainer() {
  //   return this.suspenseToolBarContainer;
  // }

  getActivityBarIcon() {
    return this.activityBarIcon;
  }
  // getTopToolBarIcon() {
  //   return this.topToolBarIcon;
  // }

  // /**
  //  * 浮动层挂载，只会调用一次
  //  * @returns
  //  */
  // handleSuspenseToolBarMounted() {
  //   if (this.suspenseToolBarMounted || !this.suspenseToolBarContainer) {
  //     return;
  //   }
  //   this.config.lifeCycleHooks?.suspenseToolBarMounted?.({
  //     dom: this.suspenseToolBarContainer,
  //     extension: this,
  //   });
  //   this.suspenseToolBarMounted = true;
  // }

  /**
   * 设置api
   */
  setApi(k: string, v: AnyType) {
    this.apiMap.set(k, v);
  }
  /**
   * 获取api
   * @param k
   * @returns
   */
  getApi(k: string) {
    return this.apiMap.get(k);
  }
  /**
   * 修改顶部工具栏的激活状态
   */
  changeTopToolBarActive(f: boolean) {
    this.topToolBar.changeActive(f);
    this.dispatchEvent(EVENT_NAME.TOP_TOOL_BAR_ACTIVE_CHANGE, f);
  }

  /**
   * 监听事件
   * @param eventName
   * @param listener
   */
  addEventListener<T extends EVENT_NAME>(
    eventName: T,
    listener: GetSetType<(typeof this._events)[T]>
  ) {
    this._events[eventName].add(listener as AnyType);
  }

  /**
   * 取消监听
   * @param eventName
   * @param listener
   */
  removeEventListener(eventName: EVENT_NAME, listener: AnyType) {
    this._events[eventName]?.delete(listener);
  }

  /**
   * 分发事件
   * @param eventName
   * @param data
   */
  private dispatchEvent<T extends EVENT_NAME>(
    eventName: EVENT_NAME,
    ...data: Parameters<GetSetType<(typeof this._events)[T]>>
  ) {
    this._events[eventName]?.forEach((listener) => {
      (listener as (...p: AnyType[]) => void)(...data);
    });
  }
}

export default Extension;
