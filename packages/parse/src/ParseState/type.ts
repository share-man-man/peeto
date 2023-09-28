import { JSONValue } from '../type';

/**
 * 状态数组
 */
export interface SchemaStateItem {
  /**
   * 状态名
   */
  name: string;
  /**
   * 状态外显名称
   */
  desc?: string;
  /**
   * 初始值
   */
  initialValue?: JSONValue;
  /**
   * 依赖副作用
   */
  dependences?: {
    /**
     * 依赖的其他状态
     */
    states: string[];
    /**
     * 副作用函数
     */
    effect: string;
  };
}

// // TODO 校验参数、状态、函数名不可重复
// export interface ComponentSchemaCompTree {
//     // 参数
//     props: {
//       name: string;
//       // TODO 定义参数类型
//       type: '';
//     }[];
//     // 状态
//     states: {
//       name: string;
//       default: AnyType;
//     }[];
//     // 方法
//     methods: {
//       name: string;
//       desc?: string;
//       value: string;
//       effects: string[];
//       otherMethods: string[];
//     }[];
//     // 状态依赖
//     effets: {
//       name: string;
//       dependence: string[];
//       computed: string;
//       desc?: string;
//     }[];
//     schema: SchemaCompTree;
//   }
