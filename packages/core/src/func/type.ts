import { SchemaCompTreeItem } from '../component/type';
import { SchemaEffectItem } from '../effect/type';
import { ModulesMapType } from '../lib/type';
import { NodeType } from '../root';
import {
  ContextType,
  ParseObjOptionType,
  StateRefHookGetSetType,
} from '../root/type';
import { AnyType, JSONValue, PickRequired } from '../type';
import type { FuncTypeEnum, ConditionTypeEnum } from './';

export interface AnonymousFunctionNode {
  type: NodeType.ANONYMOUSFUNCTION;
  /**
   * 函数参数
   */
  params?: string[];
  /**
   * 立即执行
   * https://developer.mozilla.org/en-US/docs/Glossary/IIFE
   */
  IIFE?: boolean;
  /**
   * 是否是promise
   */
  isPromise?: boolean;
  /**
   * 影响的状态，使得在方法体内部可修改状态，以追踪哪那些函数修改了状态
   */
  effectStates?: SchemaEffectItem['effectStates'];
  /**
   * 依赖数组，以追踪状态影响哪些变化
   */
  dependences?: SchemaEffectItem['dependences'];
  /**
   * 函数类型
   * func：普通匿名函数
   * renderFunc：渲染函数，会返回组件
   */
  funcType?: FuncTypeEnum;
  /**
   * 普通函数配置
   */
  func?: {
    /**
     * 函数方法体
     */
    body?: string;
  };
  /**
   * 渲染函数配置
   */
  renderFunc?: {
    /* *
     * 条件渲染类型
     */
    conditionType?: ConditionTypeEnum;
    /**
     * 渲染函数返回的组件树
     */
    compTree?: SchemaCompTreeItem | SchemaCompTreeItem[];
    /**
     * 列表配置
     */
    listLoop?: {
      /**
       * 数组数据
       */
      data: JSONValue;
      /**
       * list.map的回掉函数参数，默认：item、index
       */
      mapParams: string[];
    };
    /**
     * 布尔配置
     */
    boolean?: {
      data: JSONValue;
    };
  };
}

export interface GenerateArgumentsType {
  (
    option: StateRefHookGetSetType &
      Pick<SchemaEffectItem, 'effectStates' | 'dependences'> &
      Pick<AnonymousFunctionNode, 'params'> & {
        paramsValueList?: AnyType[];
        ctx: ContextType;
      } & {
        modulesMap: ModulesMapType;
      }
  ): {
    argNameList: string[];
    argList: AnyType[];
  };
}

export type GenerateFuncBaseOptionType<VNodeType> = Parameters<
  PickRequired<
    ParseObjOptionType<VNodeType>,
    'parseAnonymousFunctionNode'
  >['parseAnonymousFunctionNode']
>[0] &
  ReturnType<GenerateArgumentsType>;
