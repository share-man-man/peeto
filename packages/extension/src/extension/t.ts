import { AnyType } from '@peeto/core';

/**
 * 插件类型：vue3、react-18
 */
export enum EXTENSION_LIB_TYPE {
  VUE3 = 'vue-3',
  REACT18 = 'react-18',
}

export interface ExtensionCtx {}

// 函数式插件
export type ExtensionFunc = (ctx: ExtensionCtx) => {
  /**
   * 插件名称
   */
  name: string;
  /**
   * 图标
   */
  icon?: string;
  /**
   * 主侧栏渲染
   */
  panelRender?: () => AnyType;
  /**
   * 描述
   */
  description?: string;
};
