import { BasicNodeType, SchemaCompTreePath } from '../component/type';
import { SchemaEventItem } from '../event/type';
import { SchemaStateItem, StateGetSetType } from '../state/type';
import { RefGetSetType, SchemaRefItem } from '../ref/type';
import { AnyType, JSONArray, JSONObject, JSONValue } from '../type';
import { ModulesMapType, SchemaLibItem } from '../lib/type';
import { SchemaEffectItem } from '../effect/type';
import { HookGetSetType, SchemaHookItem } from '../hook/type';
import { HookNodeType } from '../hook';
import { SchemaCompTreeItem } from '../component';
import { AnonymousFunctionNode } from '../func';
import { RefNodeType } from '../ref';
import { StateNodeType } from '../state';

/**
 * schema根对象
 */
export interface SchemaRootObj {
  /**
   * 引入的包
   */
  libModules?: SchemaLibItem[];
  // props参数
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
   * 自定义钩子函数
   */
  customHooks?: SchemaHookItem[];
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

export type StateRefHookGetSetType = Pick<
  StateGetSetType,
  'getState' | 'setState'
> &
  Pick<RefGetSetType, 'getRef'> &
  Pick<HookGetSetType, 'getHook'>;

/**
 * 生成节点
 */
export interface GenerateNodePropType<VNodeType>
  extends StateRefHookGetSetType {
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
  modulesMap: ModulesMapType;
  /**
   * 没有找到组件
   * @param obj
   * @returns
   */
  noMatchCompRender: (p: { schema: SchemaCompTreeItem }) => VNodeType;
  ctx?: ContextType;
  // /**
  //  * 没有找到包
  //  * @param obj
  //  * @returns
  //  */
  // noMatchLibRender: (p: { schema: SchemaCompTreeItem }) => VNodeType;
}

export type ContextType = Record<string, AnyType>;

export interface DeepRecursionParseType<
  VNodeType = AnyType,
  OP = ParseOptions
> {
  (p: { cur: JSONValue; path: SchemaCompTreePath; ctx: ContextType }, op: OP):
    | VNodeType
    | JSONValue
    | AnyType;
}

export interface ParseNodeBaseProp<SchemaNodeType, VNodeType, OP> {
  curSchema: SchemaNodeType;
  deepRecursionParse: DeepRecursionParseType<VNodeType, OP>;
  path: SchemaCompTreePath;
  ctx: ContextType;
}

export type ParseOptions = Record<string, AnyType>;

export interface ParseObjOptionType<VNodeType = AnyType, OP = ParseOptions> {
  node: JSONValue;
  nodePath: SchemaCompTreePath[];
  parseBasicNode?: (
    p: ParseNodeBaseProp<BasicNodeType, VNodeType, OP>,
    op: OP
  ) => AnyType;
  parseArrayNode?: (
    p: ParseNodeBaseProp<JSONArray, VNodeType, OP>,
    op: OP
  ) => AnyType;
  parseObjectNode?: (
    p: ParseNodeBaseProp<JSONObject, VNodeType, OP>,
    op: OP
  ) => AnyType;
  parseStateNode?: (
    p: ParseNodeBaseProp<StateNodeType, VNodeType, OP>,
    op: OP
  ) => AnyType;
  parseRefNode?: (
    p: ParseNodeBaseProp<RefNodeType, VNodeType, OP>,
    op: OP
  ) => AnyType;
  parseHookNode?: (
    p: ParseNodeBaseProp<HookNodeType, VNodeType, OP>,
    op: OP
  ) => AnyType;
  parseAnonymousFunctionNode?: (
    p: ParseNodeBaseProp<AnonymousFunctionNode, VNodeType, OP>,
    op: OP
  ) => AnyType;
  // customDeep?: boolean;
  parseSchemaComp?: (
    p: ParseNodeBaseProp<SchemaCompTreeItem, VNodeType, OP> & {
      props: AnyType;
    },
    op: OP
  ) => AnyType;
  ctx?: ContextType;
}
