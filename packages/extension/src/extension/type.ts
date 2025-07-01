import Extension from '.';

/**
 * 参照：https://code.visualstudio.com/api/extension-capabilities/extending-workbench
 */
export type UIComponentType =
  | 'TitleBar'
  | 'ActivityBar'
  | 'SideBar'
  | 'Panel'
  | 'EditorGroup'
  | 'StatusBar';

/**
 * 所有生命周期钩子函数
 */
export type LifeCycleHooks = {
  /**
   * 挂载到面板，只会调用一次
   * @param dom
   * @returns
   */
  onMounted: (p: { dom: HTMLDivElement }) => Promise<void>;
  /**
   * 激活
   * @returns
   */
  onActive: () => Promise<void>;
  /**
   * 失活
   * @returns
   */
  onDeActive: () => Promise<void>;
};

// /**
//  * 扩展面板和钩子函数的映射
//  */
// export type LifeCycleHooksPannelMap = {
//   [key in ExtensionPannelType]: key extends 'top'
//     ? Pick<LifeCycleHooks, 'onMounted' | 'onActive' | 'onDeActive'>
//     : key extends 'right'
//     ? Pick<LifeCycleHooks, 'onMounted' | 'onActive' | 'onDeActive'>
//     : key extends 'bottom'
//     ? Pick<LifeCycleHooks, 'onActive' | 'onDeActive'>
//     : key extends 'left'
//     ? Pick<LifeCycleHooks, 'onMounted' | 'onActive' | 'onDeActive'>
//     : key extends 'simulator'
//     ? Pick<LifeCycleHooks, 'onMounted' | 'onActive' | 'onDeActive'>
//     : key extends 'suspense'
//     ? Pick<LifeCycleHooks, 'onMounted' | 'onActive' | 'onDeActive'>
//     : never;
// };

/**
 * 扩展配置
 */
export interface ExtensionConfig {
  /**
   * 名称
   */
  name: string;
  /**
   * 版本
   */
  version: string;
  /**
   * 生命周期
   */
  lifeCycleHooks: {
    /**
     * 面板挂载
     */
    panelMounted?: (p: { dom: HTMLDivElement; extension: Extension }) => void;
    /**
     * 模拟器挂载
     * @param dom
     * @returns
     */
    simulatorMounted?: (p: {
      dom: HTMLDivElement;
      extension: Extension;
    }) => void;
    /**
     * 浮动层挂载
     * @param p
     * @returns
     */
    suspenseToolBarMounted?: (p: {
      dom: HTMLDivElement;
      extension: Extension;
    }) => void;
    /**
     *
     * @param p 右侧工具栏挂载
     * @returns
     */
    rightToolPanelMounted?: (p: {
      dom: HTMLDivElement;
      extension: Extension;
    }) => void;
  };
  /**
   * 描述
   */
  description?: string;
  activityBarIcon?: () => HTMLElement;
  topToolBarIcon?: (p: { extension: Extension }) => HTMLElement;
}

// /**
//  * 插件类型：vue3、react-18
//  */
// export enum EXTENSION_LIB_TYPE {
//   VUE3 = 'vue-3',
//   REACT18 = 'react-18',
// }

// /**
//  * 插件类型
//  */
// export enum EXTENSION_CONFIG_TYPE {
//   LEFT_TOOL_BAR = 'left-tool-bar',
//   TOP_TOOL_BAR = 'top-tool-bar',
//   SIMULATOR = 'simulator',
//   SUSPENSE_TOOL_BAR = 'suspense-tool-bar',
// }

// /**
//  * 插件基础参数类型
//  */
// export interface BaseToolBarExtensionProps {
//   /**
//    * 插件名。唯一标识，不可重复
//    */
//   name: string;
//   /**
//    * 目前暂时只支持react、vue插件
//    */
//   renderProps: {
//     libType: EXTENSION_LIB_TYPE;
//     node: AnyType;
//     nodeProps?: Record<string, AnyType>;
//   };
//   icon?: string;
// }

// /**
//  * 左侧工具栏
//  *
//  */
// export interface LeftToolBarExtensionItemProps
//   extends BaseToolBarExtensionProps {
//   type: EXTENSION_CONFIG_TYPE.LEFT_TOOL_BAR;
//   /**
//    * 面板宽度
//    */
//   pannelWidth?: number;
// }

// /**
//  * 顶部工具栏
//  */
// export interface TopToolBarExtensionItemProps
//   extends BaseToolBarExtensionProps {
//   type: EXTENSION_CONFIG_TYPE.TOP_TOOL_BAR;
// }

// /**
//  * 模拟器插件
//  */
// export interface SimulatorExtensionItemProps extends BaseToolBarExtensionProps {
//   type: EXTENSION_CONFIG_TYPE.SIMULATOR;
// }

// /**
//  * 悬浮工具栏
//  */
// export interface SuspenseToolBarExtensionItemProps
//   extends BaseToolBarExtensionProps {
//   type: EXTENSION_CONFIG_TYPE.SUSPENSE_TOOL_BAR;
// }

// /**
//  * 事件集合
//  */
// export type EventMapType = Map<
//   SubscribeEventItem['name'],
//   EventMapValueItemType[]
// >;

// /**
//  * 事件集合触发列表单项类型
//  */
// export type EventMapValueItemType = SubscribeEventItem & {
//   renderProps: ExtensionRenderProps;
// };

// /**
//  * 订阅事件
//  */
// export type SubscribeEventItem = {
//   /**
//    * 事件名称
//    */
//   name: string;
//   /**
//    * 触发订阅回调
//    * @param p
//    * @returns
//    */
//   run: (p: AnyType) => void;
// };

// /**
//  * 分发事件
//  */
// export type DispatchEventItem = {
//   /**
//    * 事件名
//    */
//   name: string;
//   /**
//    * 过滤分发事件
//    */
//   filtert?: Parameters<Array<EventMapValueItemType>['filter']>[0];
//   /**
//    * 事件载荷
//    */
//   paylod?: AnyType;
// };

// /**
//  * 渲染插件组件参数
//  */
// export interface ExtensionRenderProps<
//   ExtensionConfig extends BaseToolBarExtensionProps = BaseToolBarExtensionProps
// > {
//   visible?: boolean;
//   /**
//    * 插件配置
//    */
//   config: ExtensionConfig;
//   /**
//    * 插件生命周期
//    */
//   lifeCycleHooks: {
//     /**
//      * 插件挂载完成
//      * @returns
//      */
//     onMount: () => void;
//   };
//   /**
//    * 内置插件的组件参数
//    */
//   injectProps: {
//     /**
//      * 订阅事件
//      * @param subList
//      * @returns
//      */
//     subscribeEvent: (subList: SubscribeEventItem[]) => void;
//     /**
//      * 分发事件
//      * @param disList
//      * @returns
//      */
//     dispatchEvent: (disList: DispatchEventItem[]) => void;
//   };
// }

// /**
//  * 注册插件所需参数集合
//  */
// export type InjectExtensionConfig =
//   | LeftToolBarExtensionItemProps
//   | TopToolBarExtensionItemProps
//   | SimulatorExtensionItemProps
//   | SuspenseToolBarExtensionItemProps;

// /**
//  * 注册插件回调函数
//  */
// export type InjectExtensionConfigFn = () => Promise<InjectExtensionConfig>;

// /**
//  * 作为插件的组件的默认参数
//  */
// export type InjectExtensionCompProps = ExtensionRenderProps['injectProps'];

// /**
//  * 配置
//  */
// export type ExtensionConfig = {
//   /**
//    * 加载插件完成后调用
//    * @returns
//    */
//   onAllMount?: () => void;
// };
