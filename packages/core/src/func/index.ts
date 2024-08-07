import { NodeType } from '../root';
import { ContextType } from '../root/type';
import { SchemaStateItem } from '../state/type';
import { AnyType } from '../type';
import { AnonymousFunctionNode, GenerateFuncBaseOptionType } from './type';

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
export const generateFuncRes = <VNodeType>({
  curSchema,
  argList,
  argNameList,
}: GenerateFuncBaseOptionType<VNodeType>) => {
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
export const generateRenderFuncDefaultRes = <VNodeType>({
  curSchema,
  deepRecursionParse,
  path,
  argList,
  argNameList,
  ctx,
}: GenerateFuncBaseOptionType<VNodeType>) => {
  const { compTree } = curSchema.renderFunc || {};
  return deepRecursionParse({
    cur: compTree,
    path: [...path, 'renderFunc', 'compTree'],
    ctx: mergeCtx(
      ctx,
      argNameList.map((n, index) => [n, argList[index]])
    ),
  });
};

/**
 * 布尔渲染
 * @returns
 */
export const generateRenderFuncBoolean = <VNodeType>(
  p: GenerateFuncBaseOptionType<VNodeType>
) => {
  const { curSchema, deepRecursionParse, path, ctx } = p;
  const { boolean } = curSchema.renderFunc || {};

  const { data = '' } = boolean || {};
  // 获取数组数据
  const booleanData = deepRecursionParse({
    cur: data,
    path: [...path, 'renderFunc', 'boolean', 'data'],
    ctx,
  });
  if (!booleanData) {
    return undefined;
  }
  return generateRenderFuncDefaultRes(p);
};

/**
 * 数组渲染
 * @returns
 */
export const generateRenderFuncListLoop = <VNodeType>({
  curSchema,
  deepRecursionParse,
  path,
  ctx,
  argList,
  argNameList,
}: GenerateFuncBaseOptionType<VNodeType>) => {
  const { listLoop, compTree } = curSchema.renderFunc || {};
  const { data, mapParams = [] } = listLoop || {};
  // 解析数组数据，有可能是state、或其他表达式
  const listData = (deepRecursionParse({
    cur: data,
    path: [...path, 'renderFunc', 'listLoop', 'data'],
    ctx,
  }) || []) as AnyType[];

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
    const r = deepRecursionParse({
      cur: compTree,
      path: [...path, 'renderFunc', 'compTree'],
      ctx: newCtx,
    });
    return r;
  });
};

/**
 * 渲染函数
 * @returns
 */
export const generateRenderFuncRes = <VNodeType>(
  p: GenerateFuncBaseOptionType<VNodeType>
) => {
  const { conditionType = ConditionTypeEnum.DEFAULT } =
    p.curSchema.renderFunc || {};
  let res = null;
  let neverRes: never;
  switch (conditionType) {
    case ConditionTypeEnum.LISTLOOP:
      res = generateRenderFuncListLoop(p);
      break;
    case ConditionTypeEnum.BOOLEAN:
      res = generateRenderFuncBoolean(p);
      break;
    case ConditionTypeEnum.DEFAULT:
      res = generateRenderFuncDefaultRes(p);
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
