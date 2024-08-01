import { AnyType } from '../../../../../../packages/core/src/type';
import { GenerateFuncBaseOptionType } from '../../../../../../packages/core/src/func/type';
import { ConditionTypeEnum } from '../../../../../../packages/core/src/func';

/**
 * 执行普通函数执行结果
 * @returns
 */
export const generateFuncRes = <VNodeType>({
  curSchema,
}: //   argList,
//   argNameList,
GenerateFuncBaseOptionType<VNodeType>) => {
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
export const generateRenderFuncDefaultRes = <VNodeType>({
  curSchema,
  deepRecursionParse,
  path,
  argList,
  argNameList,
  ctx,
}: GenerateFuncBaseOptionType<VNodeType>) => {
  const { compTree } = curSchema.renderFunc || {};
  return `${deepRecursionParse(compTree, { parentNode: 'object' })}`;
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
  const booleanData = deepRecursionParse(data, { parentNode: 'object' });

  return `${booleanData} && ${generateRenderFuncDefaultRes(p)}`;
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
  const mapData = deepRecursionParse(data, { parentNode: 'object' });
  // 获取数组数据
  const listData = (deepRecursionParse(compTree, {
    parentNode: 'object',
  }) || []) as AnyType[];

  return `${mapData}.map((${mapParams.join(',')})=>{
    return ${listData}
})`;

  // return listData.map((...mapParamsValueList) => {
  //   // 将map的渲染函数放入上下文
  //   const newCtx = {
  //     ...ctx,
  //     // 将函数参数传入下级的上下文
  //     ...Object.fromEntries([
  //       ...argNameList.map((n, index) => [n, argList[index]]),
  //       ...mapParams.map((mapParamItem, mapParamItemIndex) => [
  //         mapParamItem,
  //         mapParamsValueList[mapParamItemIndex],
  //       ]),
  //     ]),
  //   };
  //   const r = deepRecursionParse({
  //     cur: compTree,
  //     path: [...path, 'renderFunc', 'compTree'],
  //     ctx: newCtx,
  //   });
  //   return r;
  // });
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
      res = `return ${generateRenderFuncDefaultRes(p)}`;
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
