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
   * 标识引入的包和模块。
   * 用例
   * import { muudleA as A } from 'pkg-a'
   */
  libModules?: SchemaLibItem[];
  /**
   * 状态集合
   */
  states?: SchemaStateItem[];
  /**
   * 事件集合
   */
  // TODO 暂时还未出现适用场景
  events?: SchemaEventItem[];
  /**
   * ref集合
   */
  refs?: SchemaRefItem[];
  /**
   * 自定义hooks。
   * 用例
   * const [ form ] = Form.useForm()
   * const { run as request } = useRequest(api,{manaul:true})
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
   * 用例
   * react: useEffect(()=>{ alert(title) },[title])
   * vue3: watch(()=>title, (v)=>{ alert(v) })
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
export type GenerateNodePropType<
  VNodeType,
  OP = ParseOptions
> = StateRefHookGetSetType &
  Pick<ParseObjOptionType<VNodeType, OP>, 'parseSchemaCompFields'> & {
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
    onCreateCompNode: (p: {
      comp: AnyType;
      /**
       * 深度解析组件里的字段，其中key值为parseSchemaCompFields中配置的字段，默认解析props字段
       */
      fields: Record<string, AnyType>;
      parseProps: Parameters<
        Required<ParseObjOptionType<VNodeType, OP>>['parseSchemaComp']
      >[0];
    }) => VNodeType;
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
    /**
     * 错误边界
     * @param p
     * @returns
     */
    errorBoundaryRender: (error: AnyType, p: AnyType) => VNodeType;
    ctx?: ContextType;
    // /**
    //  * 没有找到包
    //  * @param obj
    //  * @returns
    //  */
    // noMatchLibRender: (p: { schema: SchemaCompTreeItem }) => VNodeType;
  };

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
  parseSchemaCompFields?: string[];
  parseSchemaComp?: (
    p: ParseNodeBaseProp<SchemaCompTreeItem, VNodeType, OP> & {
      fields: Record<string, AnyType>;
    },
    op: OP
  ) => AnyType;
  ctx?: ContextType;
}
