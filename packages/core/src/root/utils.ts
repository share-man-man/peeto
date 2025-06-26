import { isBasicNode, isSchemaCompTree } from '../component';
import { SchemaCompTreePath } from '../component/type';
import { SchemaEffectDependenceType } from '../effect';
import { getSetStateFuncName, isAnonymousFunctionNode } from '../func';
import { GenerateArgumentsType } from '../func/type';
import { isHookNode } from '../hook';
import { isRefNode } from '../ref';
import { isStateNode } from '../state';
import { AnyType } from '../type';
import {
  DeepRecursionParseType,
  ParseObjOptionType,
  ParseOptions,
  SchemaRootObj,
} from './type';

/**
 * 字符串转对象
 * @param str
 * @returns
 */
export const getSchemaObjFromStr = (str?: string): SchemaRootObj => {
  if (!str) {
    throw new Error('没有schema');
  }
  let schemaObj: SchemaRootObj;
  try {
    schemaObj = JSON.parse(str);
  } catch (error) {
    throw new Error('schema格式错误');
  }
  return schemaObj;
};

/**
 * 转换组件树
 * @returns
 */
export const parseObj = <VNodeType, OP extends AnyType | null = ParseOptions>(
  {
    node,
    nodePath = [],
    parseBasicNode,
    parseArrayNode,
    parseObjectNode,
    parseStateNode,
    parseRefNode,
    parseHookNode,
    parseAnonymousFunctionNode,
    parseSchemaComp,
    parseSchemaCompFields = [],
    ctx: propCtx = {},
  }: ParseObjOptionType<VNodeType, OP>,
  parseOptions: OP
) => {
  const deepRecursionParse: DeepRecursionParseType<VNodeType, OP> = (
    { cur: orgCur, path, ctx },
    op
  ) => {
    const cur: AnyType = orgCur;
    // 普通节点继续遍历
    if (!nodePath.some((c) => isPathEqual(c, path))) {
      // 基础节点
      if (isBasicNode(cur) && parseBasicNode) {
        return parseBasicNode(
          { path, ctx, deepRecursionParse, curSchema: cur },
          op
        );
      }
      // 数组节点
      if (Array.isArray(cur)) {
        if (parseArrayNode) {
          return parseArrayNode(
            {
              curSchema: cur,
              path,
              ctx,
              deepRecursionParse,
            },
            op
          );
        }
        return cur.map((o, oIndex) =>
          deepRecursionParse({ cur: o, path: [...path, oIndex], ctx }, op)
        );
      }
      // 对象节点
      if (cur instanceof Object) {
        if (parseObjectNode) {
          return parseObjectNode(
            { curSchema: cur, path, ctx, deepRecursionParse },
            op
          );
        }
        return Object.fromEntries(
          Object.keys(cur).map((k) => [
            k,
            deepRecursionParse({ cur: cur[k], path: [...path, k], ctx }, op),
          ])
        );
      }
    }
    // 状态节点
    if (isStateNode(cur) && parseStateNode) {
      return parseStateNode(
        { curSchema: cur, deepRecursionParse, path, ctx },
        op
      );
    }
    // ref节点
    if (isRefNode(cur) && parseRefNode) {
      return parseRefNode(
        { curSchema: cur, deepRecursionParse, path, ctx },
        op
      );
    }
    // hook节点
    if (isHookNode(cur) && parseHookNode) {
      return parseHookNode(
        { curSchema: cur, deepRecursionParse, path, ctx },
        op
      );
    }
    // 匿名函数节点
    if (isAnonymousFunctionNode(cur) && parseAnonymousFunctionNode) {
      return parseAnonymousFunctionNode(
        {
          curSchema: cur,
          deepRecursionParse,
          path,
          ctx,
        },
        op
      );
    }
    // 组件节点
    if (isSchemaCompTree(cur)) {
      const obj = cur;
      const getFields = () =>
        Object.fromEntries(
          parseSchemaCompFields.map((field) => [
            field,
            Object.fromEntries(
              Object.keys((obj as AnyType)[field] || {}).map((k) => [
                k,
                deepRecursionParse(
                  {
                    cur: (obj as AnyType)[field]?.[k],
                    path: [...path, field, k],
                    ctx,
                  },
                  op
                ),
              ])
            ),
          ])
        );

      if (parseSchemaComp) {
        return parseSchemaComp(
          {
            curSchema: cur,
            deepRecursionParse,
            path,
            fields: getFields(),
            ctx,
          },
          op
        );
      }
      return { ...cur, ...getFields() };
    }
    return cur;
  };
  return deepRecursionParse(
    { cur: node, path: [], ctx: propCtx },
    parseOptions
  );
};

/**
 * 判断路径是否相等
 * @param p1
 * @param p2
 * @returns
 */
export const isPathEqual = (p1: SchemaCompTreePath, p2: SchemaCompTreePath) => {
  return p1.length === p2.length && p1.every((p, index) => p === p2[index]);
};

/**
 * 生成new Function()时所需的参数名、参数值
 * @returns
 */
export const generateArguments: GenerateArgumentsType = ({
  params: paramsNameList = [],
  paramsValueList = [],
  dependences = [],
  getState,
  effectStates = [],
  setState,
  ctx = {},
  modulesMap,
  getRef,
  getHook,
}) => {
  const fieldMap: Map<string, AnyType> = new Map();
  // 安全考虑，暴露特定的函数、状态
  dependences.forEach((d) => {
    const { type } = d;
    let neverRes: never;
    switch (type) {
      case SchemaEffectDependenceType.STATE:
        fieldMap.set(d.name, getState({ stateName: d.name }));
        break;
      case SchemaEffectDependenceType.MODULE:
        fieldMap.set(d.name, modulesMap.get(d.name));
        break;
      case SchemaEffectDependenceType.REF:
        fieldMap.set(d.name, getRef({ refName: d.name }));
        break;
      case SchemaEffectDependenceType.HOOK:
        fieldMap.set(d.name, getHook({ name: d.name }));
        break;
      default:
        neverRes = type;
        if (neverRes) {
          //
        }
        break;
    }
  });
  paramsNameList.forEach((pName, index) => {
    fieldMap.set(pName, paramsValueList[index]);
  });
  effectStates.forEach((name) => {
    const funcName = getSetStateFuncName({ stateName: name });
    const run = (v: AnyType) => {
      setState({
        fieldList: [
          {
            name,
            value: v,
          },
        ],
      });
    };
    fieldMap.set(funcName, run);
  });
  Object.keys(ctx).forEach((k) => {
    fieldMap.set(k, ctx[k]);
  });

  return {
    argNameList: Array.from(fieldMap.keys()),
    argList: Array.from(fieldMap.keys()).map((k) => fieldMap.get(k)),
  };
};
