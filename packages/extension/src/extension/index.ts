import { AnyType } from '@peeto/core';
import { ExtensionConfig } from './type';

export enum EVENT_NAME {
  /**
   * 模拟器初始化
   */
  TOP_TOOL_BAR_ACTIVE_CHANGE = 'TOP_TOOL_BAR_ACTIVE_CHANGE',
  // TODO 挂载后触发
}

export class Extension {
  private name: ExtensionConfig['name'];
  private acvitityBarIcon?: HTMLElement;
  private topToolBarIcon?: HTMLElement;
  topToolBarActive: boolean = false;
  private panelContainer?: HTMLDivElement;
  private panelMounted: boolean = false;
  private apiMap = new Map<string, AnyType>();
  private _events = {
    [EVENT_NAME.TOP_TOOL_BAR_ACTIVE_CHANGE]: new Set<(f: boolean) => void>(),
  };
  config: ExtensionConfig;

  constructor(c: ExtensionConfig) {
    this.name = c.name;
    this.config = c;
    // TODO 暂时默认使用window.document.createElement创建
    this.panelContainer = window.document.createElement('div');
    this.acvitityBarIcon = c.activityBarIcon?.();
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

  getAcvitityBarIcon() {
    return this.acvitityBarIcon;
  }
  getTopToolBarIcon() {
    return this.topToolBarIcon;
  }

  /**
   * 面板挂载，根据panelMounted只会调用一次
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
