/**
 * Promise链式调用
 */
export class PromiseChainPending {
  /**
   * 挂起的Promise链
   */
  private chain = Promise.resolve();
  /**
   * 触发链函数
   */
  private trigger: null | (() => void) = null;

  /**
   * 添加到调用链
   * @param cb
   */
  add(cb: () => void) {
    this.chain = this.chain.then(() => {
      return new Promise<void>((nextResolve, nextReject) => {
        try {
          if (this.trigger === null) {
            this.trigger = () => {
              cb();
              nextResolve();
            };
          } else {
            cb();
            nextResolve();
          }
        } catch (error) {
          nextReject(error);
        }
      });
    });
  }

  /**
   * 执行promise链
   */
  run() {
    this.trigger?.();
    this.chain.finally(() => {
      this.trigger = null;
      this.chain = Promise.resolve();
    });
  }
}

export class ToolBar extends PromiseChainPending {
  private mounted = false;
  private active = false;
  private dom?: HTMLDivElement;
  constructor() {
    super();
  }
  getDom() {
    if (!this.dom) {
      this.dom = document.createElement('div');
    }
    return this.dom;
  }
  /**
   * 只能被调用一次
   * @returns
   */
  onMounted() {
    if (this.mounted) {
      return;
    }
    this.mounted = true;
    this.changeActive(true);
  }

  /**
   * 等待active改编后再回调promise
   * @returns
   */
  onActive() {
    return new Promise<void>((resolve) => {
      if (this.active) {
        resolve();
      } else {
        this.add(resolve);
      }
    });
  }

  /**
   * 改变激活状态
   * @param active
   */
  changeActive(active: boolean) {
    this.active = active;
    if (this.active) {
      this.run();
    }
  }

  /**
   * 获取当前状态
   * @returns
   */
  getStatus() {
    return {
      active: this.active,
      mounted: this.mounted,
      dom: this.dom,
    };
  }
}
