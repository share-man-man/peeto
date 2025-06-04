class PromisePending {
  /**
   * 挂起的Promise链
   */
  private chain = Promise.resolve();
  /**
   * 触发链函数
   */
  private trigger: null | (() => void) = null;

  /**
   * 挂起回调
   * @param cb
   */
  add(cb: () => void) {
    this.chain = this.chain.then(() => {
      return new Promise<void>((nextResolve) => {
        if (this.trigger === null) {
          this.trigger = () => {
            cb();
            nextResolve();
          };
        } else {
          cb();
          nextResolve();
        }
      });
    });
  }

  /**
   * 执行挂起完成后，初始化
   */
  run() {
    this.trigger?.();
    this.chain.finally(() => {
      this.trigger = null;
      this.chain = Promise.resolve();
    });
  }
}

export default PromisePending;
