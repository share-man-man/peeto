import { NodeType } from '../root';
import { AnyType, JSONValue } from '../type';

export interface SchemaRefItem {
  name: string;
  desc?: string;
  initialValue?: JSONValue;
}

export interface RefNodeType {
  type: NodeType.REF;
  refName: string;
}

export interface RefGetSetType {
  getRef: (p: { refName: SchemaRefItem['name'] }) => AnyType;
}
