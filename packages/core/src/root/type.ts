import { SchemaCompTreeItem, SchemaCompTreePath } from '../component/type';
import { SchemaEventItem } from '../event/type';
import { SchemaStateItem, StateGetSetType, StateNodeType } from '../state/type';
import { SchemaRefItem } from '../ref/type';
import { AnyType, JSONValue } from '../type';
import { LibListMapType } from '../lib/type';
import { SchemaEffectItem } from '../effect/type';
import { AnonymousFunctionNode } from '../func/type';

/**
 * schema根对象
 */
export interface SchemaRootObj {
  /**
   * 状态集合
   */
  states?: SchemaStateItem[];
  /**
   * 事件集合
   */
  events?: SchemaEventItem[];
  /**
   * ref集合
   */
  refs?: SchemaRefItem[];
  /**
   * 组件树
   */
  compTree?: SchemaCompTreeItem[];
  /**
   * 需要特殊处理的节点路径
   */
  schemaNodePaths?: SchemaCompTreePath[];
  /**
   * 状态副作用
   */
  effects?: SchemaEffectItem[];
}

/**
 * 生成节点
 */
export interface GenerateNodePropType<VNodeType>
  extends Pick<StateGetSetType, 'getState' | 'setState'> {
  /**
   * schema对象
   */
  schemaRootObj: SchemaRootObj;
  /**
   * 创建组件节点
   * @param comp 组件渲染函数
   * @param props 组件参数
   * @returns 节点对象（虚拟dom）
   */
  onCreateCompNode: (p: { comp: AnyType; props: AnyType }) => VNodeType;
  /**
   * 依赖包集合
   */
  libListMap: LibListMapType;
  /**
   * 没有找到组件
   * @param obj
   * @returns
   */
  noMatchCompRender: (p: { schema: SchemaCompTreeItem }) => VNodeType;
  /**
   * 没有找到包
   * @param obj
   * @returns
   */
  noMatchLibRender: (p: { schema: SchemaCompTreeItem }) => VNodeType;
}

export type ContextType = Record<string, AnyType>;

export interface DeepRecursionParseType<VNodeType = AnyType> {
  (p: { cur: JSONValue; path: SchemaCompTreePath; ctx: ContextType }):
    | VNodeType
    | JSONValue
    | AnyType;
}

export interface ParseNodeBaseProp<SchemaNodeType, VNodeType> {
  curSchema: SchemaNodeType;
  deepRecursionParse: DeepRecursionParseType<VNodeType>;
  path: SchemaCompTreePath;
  ctx: ContextType;
}

export interface ParseObjOptionType<VNodeType = AnyType> {
  node: JSONValue;
  nodePath: SchemaCompTreePath[];
  parseStateNode?: (p: ParseNodeBaseProp<StateNodeType, VNodeType>) => AnyType;
  parseAnonymousFunctionNode?: (
    p: ParseNodeBaseProp<AnonymousFunctionNode, VNodeType>
  ) => AnyType;
  customDeep?: boolean;
  parseSchemaComp?: (
    p: ParseNodeBaseProp<SchemaCompTreeItem, VNodeType> & {
      props: AnyType;
    }
  ) => AnyType;
}
