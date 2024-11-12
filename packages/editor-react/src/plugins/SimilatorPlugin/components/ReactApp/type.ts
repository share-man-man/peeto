import { AnyType } from '@peeto/core';
import { ReactElement } from 'react';
import { AppActionRef } from '../../type';

export interface ReactAppProps {
  actionRef: (ctx: AppActionRef) => void;
  onMount: () => void;
}

export interface FiberNode {
  child?: FiberNode;
  key?: ReactElement['key'];
  return?: FiberNode;
  sibling?: FiberNode;
  stateNode?: AnyType;
  pendingProps?: AnyType;
}
