import { NodeType } from '../root';
import { AnyType } from '../type';
// import { StateNodeType } from './type';

// TODO 只有react用到了，vue没有用到

/**
 * 状态节点
 */
export class StateNodeType {
  public type = NodeType.STATE;
  public name: string = '';
  constructor(p: Omit<StateNodeType, 'type'>) {
    Object.assign(this, p);
  }
}

/**
 * 是否为状态节点
 * @param obj
 * @returns
 */
export const isStateNode = (obj: AnyType): obj is StateNodeType => {
  return obj?.type === NodeType.STATE;
};

export class StateMap {
  private map: Map<
    string,
    {
      stateValue: AnyType;
      setStateValue: AnyType;
    }
  >;

  constructor() {
    this.map = new Map();
  }

  addState(name: string, value: AnyType, setValue: AnyType) {
    this.map.set(name, { stateValue: value, setStateValue: setValue });
  }

  get(name: string) {
    return this.map.get(name)?.stateValue;
  }

  set(name: string, value: AnyType) {
    this.map.get(name)?.setStateValue(value);
  }
}
