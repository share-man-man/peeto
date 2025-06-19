// import { BridgeEvents, isBrowser } from '@vue-devtools/shared-utils'
// import type { BackendContext, DevtoolsBackend } from '@vue-devtools/app-backend-api'
// import type { ComponentInstance } from '@vue/devtools-api'
import { SchemaCompTreeItem } from '@peeto/core';
import { isBrowser } from './commom';

import { JobQueue } from './queue';
import { CompDomMap } from '../type';

export interface CompPickerContext {
  onCheckComp?: (compList: string[]) => void;
  onStopSelect: () => void;
}

export default class ComponentPicker {
  /**
   * 组件、dom映射关系
   */
  private map: CompDomMap = new Map();
  /**
   * 当前预选的组件id
   */
  private selectedInstance?: string;
  /**
   * 预选框
   */
  private overlay?: HTMLDivElement;
  private overlayContent?: HTMLDivElement;
  private jobQueue = new JobQueue();
  private updateTimer?: NodeJS.Timeout;
  private checkCompList: string[] = [];
  private ctx?: CompPickerContext = {
    onStopSelect: () => {
      //
    },
  };

  constructor(ctx: CompPickerContext) {
    this.ctx = ctx;
    this.bindMethods();
  }

  /**
   * Bind class methods to the class scope to avoid rebind for event listeners
   */
  bindMethods() {
    this.startSelecting = this.startSelecting.bind(this);
    this.stopSelecting = this.stopSelecting.bind(this);
    this.elementMouseOver = this.elementMouseOver.bind(this);
    this.elementClicked = this.elementClicked.bind(this);
  }

  /**
   * 更新映射
   * @param newMap
   */
  updateMap(newMap: CompDomMap) {
    this.map = newMap;
  }

  /**
   * 开始预选
   */
  startSelecting() {
    if (!isBrowser) {
      return;
    }
    window.addEventListener('mouseover', this.elementMouseOver, true);
    window.addEventListener('click', this.elementClicked, true);
    window.addEventListener('mouseout', this.cancelEvent, true);
    window.addEventListener('mouseenter', this.cancelEvent, true);
    window.addEventListener('mouseleave', this.cancelEvent, true);
    window.addEventListener('mousedown', this.cancelEvent, true);
    window.addEventListener('mouseup', this.cancelEvent, true);
  }

  /**
   * 停止预选
   */
  stopSelecting() {
    if (!isBrowser) {
      return;
    }
    window.removeEventListener('mouseover', this.elementMouseOver, true);
    window.removeEventListener('click', this.elementClicked, true);
    window.removeEventListener('mouseout', this.cancelEvent, true);
    window.removeEventListener('mouseenter', this.cancelEvent, true);
    window.removeEventListener('mouseleave', this.cancelEvent, true);
    window.removeEventListener('mousedown', this.cancelEvent, true);
    window.removeEventListener('mouseup', this.cancelEvent, true);

    this.unHighlight();
  }

  /**
   * Highlights a component on element mouse over
   */
  async elementMouseOver(e: MouseEvent) {
    this.cancelEvent(e);

    const el = e.target;
    if (el) {
      await this.selectElementComponent(el);
    }

    this.unHighlight();
    if (this.selectedInstance) {
      this.highlight(this.selectedInstance);
    }
  }

  /**
   * 根据dom，找出对应的组件
   * @param el
   */
  async selectElementComponent(el: EventTarget) {
    let compId: SchemaCompTreeItem['id'] = '';
    let curEl: HTMLElement | null = el as HTMLElement;
    while (curEl && !compId) {
      this.map.forEach((list, k) => {
        if (list.some((l) => l === curEl)) {
          compId = k;
        }
      });
      curEl = curEl?.parentElement || null;
    }

    if (compId) {
      this.selectedInstance = compId;
    }
  }

  /**
   * 创建遮罩框对象
   * @returns
   */
  createOverlay() {
    if (this.overlay || !isBrowser) {
      return;
    }
    this.overlay = document.createElement('div');
    this.overlay.style.backgroundColor = 'rgba(65, 184, 131, 0.35)';
    this.overlay.style.position = 'fixed';
    this.overlay.style.zIndex = '99999999999998';
    this.overlay.style.pointerEvents = 'none';
    this.overlay.style.borderRadius = '3px';
    this.overlayContent = document.createElement('div');
    this.overlayContent.style.position = 'fixed';
    this.overlayContent.style.zIndex = '99999999999999';
    this.overlayContent.style.pointerEvents = 'none';
    this.overlayContent.style.backgroundColor = 'white';
    this.overlayContent.style.fontFamily = 'monospace';
    this.overlayContent.style.fontSize = '11px';
    this.overlayContent.style.padding = '4px 8px';
    this.overlayContent.style.borderRadius = '3px';
    this.overlayContent.style.color = '#333';
    this.overlayContent.style.textAlign = 'center';
    this.overlayContent.style.border = 'rgba(65, 184, 131, 0.5) 1px solid';
    this.overlayContent.style.backgroundClip = 'padding-box';
  }

  positionOverlayToInstance(instance: string) {
    if (!instance || !this.overlay) {
      return;
    }
    const domList = this.map.get(instance);
    if (domList && (domList || [])?.length > 0) {
      const firstRect = domList[0].getBoundingClientRect();
      let t = firstRect.top;
      let l = firstRect.left;
      let r = firstRect.left + firstRect.width;
      let b = firstRect.top + firstRect.height;
      (domList || []).forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.height > 0 && rect.width > 0) {
          t = rect.top < t ? rect.top : t;
          l = rect.left < l ? rect.left : l;
          const rr = rect.left + rect.width;
          r = rr > r ? rr : r;
          const rb = rect.top + rect.height;
          b = rb > b ? rb : b;
        }
      });
      this.overlay.style.top = `${t}px`;
      this.overlay.style.left = `${l}px`;
      this.overlay.style.width = `${r - l}px`;
      this.overlay.style.height = `${b - t}px`;
    }
  }

  /**
   * 更新遮罩框
   */
  updateOverlay() {
    if (this.selectedInstance) {
      this.positionOverlayToInstance(this.selectedInstance);
    }
  }

  highlight(instance?: string) {
    this.jobQueue.queue('highlight', async () => {
      this.createOverlay();
      if (!instance || !this.overlay) {
        return;
      }
      document.body.appendChild(this.overlay);
      this.positionOverlayToInstance(instance);
      this.startUpdateTimer();
    });
  }

  async unHighlight() {
    await this.jobQueue.queue('unHighlight', async () => {
      this.overlay?.parentNode?.removeChild(this.overlay);
      this.overlayContent?.parentNode?.removeChild(this.overlayContent);
      this.stopUpdateTimer();
    });
  }

  startUpdateTimer() {
    this.stopUpdateTimer();
    this.updateTimer = setInterval(() => {
      this.jobQueue.queue('updateOverlay', async () => {
        await this.updateOverlay();
      });
    }, 500);
  }

  stopUpdateTimer() {
    clearInterval(this.updateTimer);
  }

  /**
   * 选中组件
   */
  async elementClicked(e: MouseEvent) {
    this.cancelEvent(e);
    if (this.selectedInstance) {
      // 默认单选
      this.checkCompList = [this.selectedInstance];
      this.ctx?.onCheckComp?.(this.checkCompList);
    }
    this.stopSelecting();

    this.ctx?.onStopSelect?.();
  }

  /**
   * Cancel a mouse event
   */
  cancelEvent(e: MouseEvent) {
    e.stopImmediatePropagation();
    e.preventDefault();
  }
}
