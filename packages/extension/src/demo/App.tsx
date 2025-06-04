import { useRef } from 'react';
import { Button, Space } from 'antd';
import PromisePending from '../utils/promise-pending';

class MyClass {
  panelActive = false;
  panelPending = new PromisePending();
  /**
   * 改变panel激活状态
   * @param v
   */
  handlePanelActive(v: boolean) {
    this.panelActive = v;
    // 激活扩展后要执行挂起的promise
    if (this.panelActive) {
      this.panelPending.run();
    }
  }

  onPanelActive() {
    return new Promise<void>((resolve) => {
      if (this.panelActive) {
        resolve();
      } else {
        this.panelPending.add(resolve);
      }
    });
  }
}

const Index = () => {
  const cl = useRef(new MyClass());
  const cur = useRef(1);
  return (
    <Space>
      <Button
        onClick={async () => {
          const num = cur.current + 1;
          cur.current = num;
          await cl.current.onPanelActive();
          console.warn(`${num}次`);
        }}
      >
        添加任务
      </Button>
      <Button
        onClick={async () => {
          cl.current.handlePanelActive(true);
        }}
      >
        激活扩展
      </Button>
      <Button
        onClick={async () => {
          cl.current.handlePanelActive(false);
        }}
      >
        失活扩展
      </Button>
    </Space>
  );
};

export default Index;
