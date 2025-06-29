import { SchemaCompTreeItem } from '../component';
import { SchemaEffectItem } from '../effect/type';
import { NodeType } from '../schema';
import { ContextType } from '../root/type';
import { SchemaStateItem } from '../state/type';
import { AnyType, JSONValue } from '../type';
import { GenerateFuncBaseOptionType } from './type';

/**
 * 函数类型
 */
export enum FuncTypeEnum {
  FUNC = 'func',
  RENDERFUNC = 'renderFunc',
}

/**
 * 条件渲染类型
 * default：直接渲染
 * listLoop： list.map(item=><div>{item.name}</div>)
 * boolean：flag && <div>111</div>
 */
export enum ConditionTypeEnum {
  DEFAULT = 'default',
  LISTLOOP = 'listLoop',
  BOOLEAN = 'boolean',
}

export class AnonymousFunctionNode {
  type = NodeType.ANONYMOUSFUNCTION;
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
  [FuncTypeEnum.FUNC]?: {
    /**
     * 函数方法体
     */
    body?: string;
  };
  /**
   * 渲染函数配置
   */
  [FuncTypeEnum.RENDERFUNC]?:
    | {
        /**
         * 默认渲染
         */
        conditionType: ConditionTypeEnum.DEFAULT;
        /**
         * 渲染函数返回的组件树
         */
        compTree: SchemaCompTreeItem | SchemaCompTreeItem[];
      }
    | {
        /* *
         * 数组渲染
         */
        conditionType: ConditionTypeEnum.LISTLOOP;
        /**
         * 列表配置
         */
        [ConditionTypeEnum.LISTLOOP]: {
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
         * 渲染函数返回的组件树
         */
        compTree: SchemaCompTreeItem | SchemaCompTreeItem[];
      }
    | {
        /* *
         * 条件渲染类型
         */
        conditionType: ConditionTypeEnum.BOOLEAN;

        /**
         * 布尔配置
         */
        [ConditionTypeEnum.BOOLEAN]: {
          data: JSONValue;
        };
        /**
         * 渲染函数返回的组件树
         */
        compTree: SchemaCompTreeItem | SchemaCompTreeItem[];
      };

  constructor(p: Omit<AnonymousFunctionNode, 'type'>) {
    Object.assign(this, p);
  }
}

/**
 * 生成setState函数名
 * @returns
 */
export const getSetStateFuncName = ({
  stateName,
}: {
  stateName: SchemaStateItem['name'];
}) => {
  return `set${stateName.charAt(0).toUpperCase()}${stateName.slice(1)}`;
};

/**
 * 合并上下文，并返回新的对象
 * @param ctx
 * @param list
 * @returns
 */
export const mergeCtx = (ctx: ContextType, list: [string, AnyType][] = []) => {
  return { ...ctx, ...Object.fromEntries(list) };
};

/**
 * 是否为匿名函数节点
 * @returns
 */
export const isAnonymousFunctionNode = (
  obj: AnyType
): obj is AnonymousFunctionNode => {
  return obj?.type === NodeType.ANONYMOUSFUNCTION;
};

/**
 * 执行普通函数执行结果
 * @returns
 */
export const generateFuncRes = <VNodeType, OP>({
  curSchema,
  argList,
  argNameList,
}: GenerateFuncBaseOptionType<VNodeType, OP>) => {
  const { body = '' } = curSchema.func || {};
  // 立即执行函数
  let parseBody = body;
  if (curSchema.IIFE) {
    parseBody = `
    return ${body}
    `;
  }
  return new Function(...argNameList, parseBody).call({}, ...argList);
};

/**
 * 渲染函数执行结果
 * @returns
 */
export const generateRenderFuncDefaultRes = <VNodeType, OP>(
  {
    curSchema,
    deepRecursionParse,
    path,
    argList,
    argNameList,
    ctx,
  }: GenerateFuncBaseOptionType<VNodeType, OP>,
  op: OP
) => {
  const { compTree } = curSchema.renderFunc || {};
  return deepRecursionParse(
    {
      cur: compTree as JSONValue,
      path: [...path, 'renderFunc', 'compTree'],
      ctx: mergeCtx(
        ctx,
        argNameList.map((n, index) => [n, argList[index]])
      ),
    },
    op
  );
};

/**
 * 布尔渲染
 * @returns
 */
export const generateRenderFuncBoolean = <VNodeType, OP>(
  p: GenerateFuncBaseOptionType<VNodeType, OP>,
  op: OP
) => {
  const { curSchema, deepRecursionParse, path, ctx } = p;

  if (curSchema.renderFunc?.conditionType !== ConditionTypeEnum.BOOLEAN) {
    throw new Error(
      `渲染函数必须配置conditionType为${ConditionTypeEnum.BOOLEAN}`
    );
  }

  const { boolean } = curSchema.renderFunc || {};

  const { data = '' } = boolean || {};
  // 获取数组数据
  const booleanData = deepRecursionParse(
    {
      cur: data,
      path: [...path, 'renderFunc', 'boolean', 'data'],
      ctx,
    },
    op
  );
  if (!booleanData) {
    return undefined;
  }
  return generateRenderFuncDefaultRes(p, op);
};

/**
 * 数组渲染
 * @returns
 */
export const generateRenderFuncListLoop = <VNodeType, OP>(
  {
    curSchema,
    deepRecursionParse,
    path,
    ctx,
    argList,
    argNameList,
  }: GenerateFuncBaseOptionType<VNodeType, OP>,
  op: OP
) => {
  if (curSchema.renderFunc?.conditionType !== ConditionTypeEnum.LISTLOOP) {
    throw new Error(
      `渲染函数必须配置conditionType为${ConditionTypeEnum.LISTLOOP}`
    );
  }
  const { listLoop, compTree } = curSchema.renderFunc || {};
  const { data, mapParams = [] } = listLoop || {};
  // 解析数组数据，有可能是state、或其他表达式
  const listData = (deepRecursionParse(
    {
      cur: data,
      path: [...path, 'renderFunc', 'listLoop', 'data'],
      ctx,
    },
    op
  ) || []) as AnyType[];

  return listData.map((...mapParamsValueList) => {
    // 将map的渲染函数放入上下文
    const newCtx = mergeCtx(
      mergeCtx(
        ctx,
        argNameList.map((n, index) => [n, argList[index]])
      ),
      mapParams.map((mapParamItem, mapParamItemIndex) => [
        mapParamItem,
        mapParamsValueList[mapParamItemIndex],
      ])
    );
    const r = deepRecursionParse(
      {
        cur: compTree as unknown as JSONValue,
        path: [...path, 'renderFunc', 'compTree'],
        ctx: newCtx,
      },
      op
    );
    return r;
  });
};

/**
 * 渲染函数
 * @returns
 */
export const generateRenderFuncRes = <VNodeType, OP>(
  p: GenerateFuncBaseOptionType<VNodeType, OP>,
  op: OP
) => {
  const { conditionType = ConditionTypeEnum.DEFAULT } =
    p.curSchema.renderFunc || {};
  let res = null;
  let neverRes: never;
  switch (conditionType) {
    case ConditionTypeEnum.LISTLOOP:
      res = generateRenderFuncListLoop(p, op);
      break;
    case ConditionTypeEnum.BOOLEAN:
      res = generateRenderFuncBoolean(p, op);
      break;
    case ConditionTypeEnum.DEFAULT:
      res = generateRenderFuncDefaultRes(p, op);
      break;
    default:
      neverRes = conditionType;
      if (neverRes) {
        res = null;
      }
      break;
  }
  return res;
};
