import { AnyType } from '@peeto/core';
import { ExtensionConfig } from './type';

export enum EVENT_NAME {
  /**
   * 模拟器初始化
   */
  TOP_TOOL_BAR_ACTIVE_CHANGE = 'TOP_TOOL_BAR_ACTIVE_CHANGE',
}

export class Extension {
  private name: ExtensionConfig['name'];
  private activityBarIcon?: HTMLElement;
  private topToolBarIcon?: HTMLElement;
  topToolBarActive: boolean = false;
  private panelContainer?: HTMLDivElement;
  private panelMounted: boolean = false;
  private suspenseToolBarContainer?: HTMLDivElement;
  private suspenseToolBarMounted: boolean = false;
  private apiMap = new Map<string, AnyType>();
  private _events = {
    [EVENT_NAME.TOP_TOOL_BAR_ACTIVE_CHANGE]: new Set<(f: boolean) => void>(),
  };
  config: ExtensionConfig;

  constructor(c: ExtensionConfig) {
    this.name = c.name;
    this.config = c;
    // TODO 暂时默认使用document.createElement创建
    this.panelContainer = document.createElement('div');
    this.suspenseToolBarContainer = document.createElement('div');
    this.activityBarIcon = c.activityBarIcon?.();
    this.topToolBarIcon = c.topToolBarIcon?.({ extension: this });
  }

  /**
   * 获取扩展名称
   * @returns
   */
  getName() {
    return this.name;
  }

  getPanelContainer() {
    return this.panelContainer;
  }

  getSuspenseToolBarContainer() {
    return this.suspenseToolBarContainer;
  }

  getActivityBarIcon() {
    return this.activityBarIcon;
  }
  getTopToolBarIcon() {
    return this.topToolBarIcon;
  }

  /**
   * 面板挂载，只会调用一次
   * @returns
   */
  handlePanelMounted() {
    if (this.panelMounted || !this.panelContainer) {
      return;
    }
    this.config.lifeCycleHooks?.panelMounted?.(this.panelContainer);
    this.panelMounted = true;
  }

  /**
   * 浮动层挂载，只会调用一次
   * @returns
   */
  handleSuspenseToolBarMounted() {
    if (this.suspenseToolBarMounted || !this.suspenseToolBarContainer) {
      return;
    }
    this.config.lifeCycleHooks?.suspenseToolBarMounted?.({
      dom: this.suspenseToolBarContainer,
      extension: this,
    });
    this.suspenseToolBarMounted = true;
  }

  /**
   * 设置扩展的api
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
  changeTopToolBarActive() {
    this.topToolBarActive = !this.topToolBarActive;
    this.dispatchEvent(
      EVENT_NAME.TOP_TOOL_BAR_ACTIVE_CHANGE,
      this.topToolBarActive
    );
  }

  addEventListener(eventName: EVENT_NAME, listener: AnyType) {
    if (!this._events[eventName]) {
      this._events[eventName] = new Set();
    }
    this._events[eventName].add(listener);
  }

  removeEventListener(eventName: EVENT_NAME, listener: AnyType) {
    this._events[eventName]?.delete(listener);
  }

  private dispatchEvent(eventName: EVENT_NAME, data: AnyType) {
    this._events[eventName]?.forEach((listener) => {
      listener(data);
    });
  }
}

export default Extension;
