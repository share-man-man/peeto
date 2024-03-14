import { AnyType } from '@peeto/parse';
import { ReactElement } from 'react';
import { SimilatorPluginCompDomMap, SimilatorPluginConfig } from '../../type';

export interface ReactAppProps {
  subConfig: (cb: (c: SimilatorPluginConfig) => void) => void;
  onMapChange?: (map: SimilatorPluginCompDomMap) => void;
}

export interface FiberNode {
  child?: FiberNode;
  key?: ReactElement['key'];
  return?: FiberNode;
  sibling?: FiberNode;
  stateNode?: AnyType;
  pendingProps?: AnyType;
}
