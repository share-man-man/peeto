// import { BridgeEvents, isBrowser } from '@vue-devtools/shared-utils'
// import type { BackendContext, DevtoolsBackend } from '@vue-devtools/app-backend-api'
// import type { ComponentInstance } from '@vue/devtools-api'
import { SchemaCompTree } from '@peeto/parse';
import { isBrowser } from './commom';
import { SimilatorPluginCompDomMap } from '../type';
import { JobQueue } from './queue';

export default class ComponentPicker {
  private map: SimilatorPluginCompDomMap = new Map();
  private selectedInstance?: string;
  private overlay?: HTMLDivElement;
  private overlayContent?: HTMLDivElement;
  private jobQueue = new JobQueue();
  private updateTimer?: NodeJS.Timeout;

  constructor(/* ctx: BackendContext */) {
    // this.ctx = ctx;
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
  updateMap(newMap: SimilatorPluginCompDomMap) {
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
    let compId: SchemaCompTree['id'] = '';
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

  // TODO
  /**
   * 更新遮罩框
   */
  updateOverlay() {
    if (this.selectedInstance) {
      // const bounds = await backend.api.getComponentBounds(currentInstance);
      // if (bounds) {
      //   const sizeEl = overlayContent.children.item(3);
      //   const widthEl = sizeEl.childNodes[0] as unknown as Text;
      //   widthEl.textContent = (Math.round(bounds.width * 100) / 100).toString();
      //   const heightEl = sizeEl.childNodes[2] as unknown as Text;
      //   heightEl.textContent = (
      //     Math.round(bounds.height * 100) / 100
      //   ).toString();
      //   positionOverlay(bounds);
      //   positionOverlayContent(bounds);
      // }
    }
  }

  highlight(instance?: string) {
    this.jobQueue.queue('highlight', async () => {
      this.createOverlay();
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
        document.body.appendChild(this.overlay);
      }
    });
  }

  async unHighlight() {
    await this.jobQueue.queue('unHighlight', async () => {
      this.overlay?.parentNode?.removeChild(this.overlay);
      this.overlayContent?.parentNode?.removeChild(this.overlayContent);
      this.stopUpdateTimer();
    });
  }

  // startUpdateTimer() {
  //   this.stopUpdateTimer();
  //   this.updateTimer = setInterval(() => {
  //     this.jobQueue.queue('updateOverlay', async () => {
  //       await this.updateOverlay();
  //     });
  //   }, 1000 / 30); // 30fps
  // }

  stopUpdateTimer() {
    clearInterval(this.updateTimer);
  }

  /**
   * Selects an instance in the component view
   */
  async elementClicked(/* e: MouseEvent */) {
    // this.cancelEvent(e);
    // if (this.selectedInstance && this.selectedBackend) {
    //   const parentInstances =
    //     await this.selectedBackend.api.walkComponentParents(
    //       this.selectedInstance
    //     );
    //   this.ctx.bridge.send(BridgeEvents.TO_FRONT_COMPONENT_PICK, {
    //     id: this.selectedInstance.__VUE_DEVTOOLS_UID__,
    //     parentIds: parentInstances.map((i) => i.__VUE_DEVTOOLS_UID__),
    //   });
    // } else {
    //   this.ctx.bridge.send(BridgeEvents.TO_FRONT_COMPONENT_PICK_CANCELED, null);
    // }
    // this.stopSelecting();
  }

  /**
   * Cancel a mouse event
   */
  cancelEvent(e: MouseEvent) {
    e.stopImmediatePropagation();
    e.preventDefault();
  }
}
