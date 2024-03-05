import { AnyType } from '@peeto/parse';
import { ReactElement } from 'react';

export interface FiberNode {
  child?: FiberNode;
  key?: ReactElement['key'];
  return?: FiberNode;
  sibling?: FiberNode;
  stateNode?: AnyType;
  pendingProps?: AnyType;
}
