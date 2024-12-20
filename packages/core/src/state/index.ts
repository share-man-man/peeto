import { NodeType } from '../root';
import { AnyType } from '../type';
import { SchemaStateItem } from './type';
// import { StateNodeType } from './type';

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

export class StateMap<
  ValueType,
  KeyType extends SchemaStateItem['name'] = SchemaStateItem['name'],
  SetValeuType extends (v: ValueType) => void = (v: ValueType) => void
> {
  private map: Map<
    KeyType,
    {
      stateValue: ValueType;
      setStateValue: SetValeuType;
    }
  >;
  constructor() {
    this.map = new Map();
  }
  addState(name: KeyType, value: ValueType, setValue: SetValeuType) {
    this.map.set(name, { stateValue: value, setStateValue: setValue });
  }
  getValue(name: KeyType) {
    return this.map.get(name)?.stateValue;
  }
  setValue(name: KeyType, value: ValueType) {
    this.map.get(name)?.setStateValue(value);
  }
}
