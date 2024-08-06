import { AnonymousFunctionNode, AnyType, ConditionTypeEnum } from '@peeto/core';
import { getCompTreeStr } from '../comp-tree';

export type GenerateFuncBaseOptionType = {
  curSchema: AnonymousFunctionNode;
  deepRecursionParse: (
    d: AnyType,
    op: Parameters<typeof getCompTreeStr>[1]
  ) => AnyType;
};

/**
 * 执行普通函数执行结果
 * @returns
 */
export const generateFuncRes = ({ curSchema }: GenerateFuncBaseOptionType) => {
  const { body = '' } = curSchema.func || {};
  // 立即执行函数
  let parseBody = body;
  if (curSchema.IIFE) {
    parseBody = `${body}`;
  }
  return parseBody;
};

/**
 * 渲染函数执行结果
 * @returns
 */
export const generateRenderFuncDefaultRes = ({
  curSchema,
  deepRecursionParse,
}: GenerateFuncBaseOptionType) => {
  const { compTree } = curSchema.renderFunc || {};
  return `${deepRecursionParse(compTree, { parentNode: 'object' })}`;
};

/**
 * 布尔渲染
 * @returns
 */
export const generateRenderFuncBoolean = (p: GenerateFuncBaseOptionType) => {
  const { curSchema, deepRecursionParse /* path, ctx  */ } = p;
  const { boolean } = curSchema.renderFunc || {};

  const { data = '' } = boolean || {};
  // 获取数组数据
  const booleanData = deepRecursionParse(data, { parentNode: 'object' });

  return `${booleanData} && ${generateRenderFuncDefaultRes(p)}`;
};

/**
 * 数组渲染
 * @returns
 */
export const generateRenderFuncListLoop = ({
  curSchema,
  deepRecursionParse,
}: GenerateFuncBaseOptionType) => {
  const { listLoop, compTree } = curSchema.renderFunc || {};
  const { data, mapParams = [] } = listLoop || {};
  const mapData = deepRecursionParse(data, { parentNode: 'object' });
  // 获取数组数据
  const listData = (deepRecursionParse(compTree, {
    parentNode: 'object',
  }) || []) as AnyType[];

  return `${mapData}.map((${mapParams.join(',')})=>{
    return ${listData}
})`;
};

/**
 * 渲染函数
 * @returns
 */
export const generateRenderFuncRes = (p: GenerateFuncBaseOptionType) => {
  const { conditionType = ConditionTypeEnum.DEFAULT } =
    p.curSchema.renderFunc || {};
  let res = '';
  let neverRes: never;
  switch (conditionType) {
    case ConditionTypeEnum.LISTLOOP:
      res = generateRenderFuncListLoop(p);
      break;
    case ConditionTypeEnum.BOOLEAN:
      res = generateRenderFuncBoolean(p);
      break;
    case ConditionTypeEnum.DEFAULT:
      res = `return ${generateRenderFuncDefaultRes(p)}`;
      break;
    default:
      neverRes = conditionType;
      if (neverRes) {
        res = '';
      }
      break;
  }
  return res;
};
