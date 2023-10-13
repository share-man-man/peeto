import type {
  JSExpressionType,
  JSFunctionType,
  JSONObject,
  JSONValue,
  PackageMapType,
  SchemaRootObj,
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

export interface ParseComponentProps<VNodeType> {
  /**
   * 组件树
   */
  schemaCompTree: SchemaRootObj['compTree'];
  /**
   * 依赖包集合
   */
  packageMap: PackageMapType;
  /**
   * 没有找到组件
   * @param obj
   * @returns
   */
  noMatchCompRender: (obj: SchemaCompTree) => VNodeType;
  /**
   * 没有找到包
   * @param obj
   * @returns
   */
  noMatchPackageRender: (obj: SchemaCompTree) => VNodeType;
}
