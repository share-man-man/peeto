// import { AnyType } from '@peeto/parse';
// import { VNode } from 'vue';
import { SimilatorPluginCompDomMap, SimilatorPluginConfig } from '../../type';

export interface VueAppProps {
  subConfig: (cb: (c: SimilatorPluginConfig) => void) => void;
  onMapChange?: (map: SimilatorPluginCompDomMap) => void;
}

// export interface FiberNode {
//   child?: FiberNode;
//   key?: VNode['key'];
//   return?: FiberNode;
//   sibling?: FiberNode;
//   stateNode?: AnyType;
//   pendingProps?: AnyType;
// }
