// import { AnyType } from '@peeto/core';
// import { VNode } from 'vue';
import { AppActionRef } from '../../type';

export interface VueAppProps {
  actionRef: (ctx: AppActionRef) => void;
  peetoPrivateKey: string;
  // onMount: () => void;
}
