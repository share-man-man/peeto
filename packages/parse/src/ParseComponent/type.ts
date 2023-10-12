import type {
  JSExpressionType,
  JSFunctionType,
  JSONObject,
  JSONValue,
} from '../type';

export interface SchemaCompTree extends JSONObject {
  id: string;
  /**
   * 组件名，支持子组件链式调用，比如antd的：Collapse.Panel、Typography.Text等
   */
  componentName: string;
  /**
   * 组件所属包名
   */
  packageName: string;
  /**
   * 组件参数
   */
  props?:
    | Record<string, JSONValue | JSExpressionType | JSFunctionType>
    | undefined;
  children?: SchemaCompTree | SchemaCompTree[] | undefined;
}
