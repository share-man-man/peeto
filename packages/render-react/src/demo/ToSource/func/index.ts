import {
  ConditionTypeEnum,
  GenerateFuncBaseOptionType,
  generateRenderFuncDefaultRes,
  JSONValue,
} from '@peeto/core';
import { ReactNode } from 'react';

/**
 * 执行普通函数执行结果
 * @returns
 */
export const generateFuncRes = ({
  curSchema,
}: GenerateFuncBaseOptionType<ReactNode>) => {
  const { body = '' } = curSchema.func || {};
  // 立即执行函数
  let parseBody = body;
  if (curSchema.IIFE) {
    parseBody = `${body}`;
  }
  return parseBody;
};

/**
 * 布尔渲染
 * @returns
 */
export const generateRenderFuncBoolean = (
  p: GenerateFuncBaseOptionType<ReactNode>
) => {
  const { curSchema, deepRecursionParse, path, ctx } = p;
  const { boolean } = curSchema.renderFunc || {};

  const { data = '' } = boolean || {};
  // 获取数组数据
  const booleanData = deepRecursionParse(
    {
      cur: data,
      path: [...path, 'renderFunc', 'boolean', 'data'],
      ctx,
    },
    { parentNode: 'object' }
  );

  return `${booleanData} && ${generateRenderFuncDefaultRes(p, {
    parentNode: 'object',
  })}`;
};

/**
 * 数组渲染
 * @returns
 */
export const generateRenderFuncListLoop = ({
  curSchema,
  deepRecursionParse,
  ctx,
  path,
}: GenerateFuncBaseOptionType<ReactNode>) => {
  const { listLoop, compTree } = curSchema.renderFunc || {};
  const { data, mapParams = [] } = listLoop || {};
  const listData = deepRecursionParse(
    {
      cur: data,
      path: [...path, 'renderFunc', 'listLoop', 'data'],
      ctx,
    },
    { parentNode: 'object' }
  );
  const r = deepRecursionParse(
    {
      cur: compTree as JSONValue,
      path: [...path, 'renderFunc', 'compTree'],
      ctx,
    },
    { parentNode: 'object' }
  );

  return `${listData}.map((${mapParams.join(',')})=>{
    return ${r}
})`;
};

/**
 * 渲染函数
 * @returns
 */
export const generateRenderFuncRes = (
  p: GenerateFuncBaseOptionType<ReactNode>
) => {
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
      res = generateRenderFuncDefaultRes(p, {
        parentNode: 'object',
      });
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
