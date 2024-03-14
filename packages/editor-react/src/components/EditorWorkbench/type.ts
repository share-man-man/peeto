import type { AnyType } from '@peeto/parse';
import type { EDITOR_LIB_TYPE } from '../../type';
import type { FunctionComponent, ComponentClass, ReactNode } from 'react';
import type { Component } from 'vue';

export interface BaseToolBarPluginProps {
  name: string;
  icon: ReactNode;
  /**
   * 目前暂时只支持react、vue插件
   */
  renderProps:
    | {
        libType: EDITOR_LIB_TYPE.REACT;
        node: FunctionComponent<AnyType> | ComponentClass<AnyType>;
        props?: Record<string, AnyType>;
      }
    | {
        libType: EDITOR_LIB_TYPE.VUE;
        node: Component;
        props?: Record<string, AnyType>;
      };
}

/**
 * 左侧工具栏
 *
 */
export interface LeftToolBarPluginItemProps extends BaseToolBarPluginProps {
  /**
   * 面板宽度
   */
  pannelWidth?: number;
}

export interface TopToolBarPluginItemProps extends BaseToolBarPluginProps {}

/**
 * 模拟器插件
 */
export interface SimilatorPluginItemProps
  extends Omit<BaseToolBarPluginProps, 'icon'> {}

/**
 * 注册插件所需参数
 */
export type InjectFnResType =
  | ({
      type: 'left-tool-bar';
    } & LeftToolBarPluginItemProps)
  | ({ type: 'top-tool-bar' } & TopToolBarPluginItemProps)
  | ({ type: 'similator' } & SimilatorPluginItemProps);

export type InjectPluginProps = (
  injectFn: () => InjectFnResType
) => Promise<void>;

export type SubscribeEventItem = {
  name: string;
  run: (p: AnyType) => void;
};

export type DispatchEventItem = {
  name: string;
  paylod: AnyType;
};

/**
 * 注册的插件组件，默认注入的参数
 */
export type InjectPluginCompProps = {
  /**
   * 插件挂载完成
   * @returns
   */
  onMount: () => void;
  /**
   * 订阅事件
   * @param subList
   * @returns
   */
  subscribeEvent: (subList: SubscribeEventItem[]) => void;
  /**
   * 分发事件
   * @param disList
   * @returns
   */
  dispatchEvent: (disList: DispatchEventItem[]) => void;
};

export interface EditorWorkbenchProps {}
