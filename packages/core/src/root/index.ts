import { isBasicNode, isSchemaCompTree } from '../component';
import { SchemaCompTreePath } from '../component/type';
import { SchemaEffectItem } from '../effect/type';
import { getSetStateFuncName, isAnonymousFunctionNode } from '../event';
import { AnonymousFunctionNode } from '../event/type';
import { LibListMapType, LibListItem } from '../lib/type';
import { isStateNode } from '../state';
import { StateGetSetType } from '../state/type';
import { AnyType } from '../type';
import {
  ContextType,
  DeepRecursionParseType,
  GenerateNodePropType,
  ParseObjOptionType,
  SchemaRootObj,
} from './type';

export enum NodeType {
  STATE = 'state',
  EVENT = 'event',
  COMPONENT = 'component',
  REF = 'ref',
  ANONYMOUSFUNCTION = 'anonymous-function',
}

export const generateFields = ({
  params: paramsNameList = [],
  paramsValueList = [],
  dependences,
  getState,
  effectStates,
  setState,
  ctx = {},
}: StateGetSetType &
  Pick<SchemaEffectItem, 'effectStates' | 'dependences'> &
  Pick<AnonymousFunctionNode, 'params'> & {
    paramsValueList?: AnyType[];
    ctx: ContextType;
  }) => {
  const fieldMap: Map<string, AnyType> = new Map();

  // 安全考虑，暴露特定的函数、状态
  dependences.forEach((name) => {
    fieldMap.set(name, getState({ stateName: name }));
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

/**
 * 判断路径是否相等
 * @param p1
 * @param p2
 * @returns
 */
const isPathEqual = (p1: SchemaCompTreePath, p2: SchemaCompTreePath) => {
  return p1.join('.') === p2.join('.');
};

/**
 * 转换树结构
 * @param param0
 * @returns
 */
export const parseObj = <VNodeType>({
  node,
  nodePath = [],
  parseStateNode,
  parseAnonymousFunctionNode,
  parseSchemaComp,
  customDeep = false,
}: ParseObjOptionType<VNodeType>) => {
  const deepRecursionParse: DeepRecursionParseType<VNodeType> = ({
    cur,
    path,
    ctx,
  }) => {
    // 普通节点继续遍历
    if (!nodePath.some((c) => isPathEqual(c, path))) {
      // 基础节点，直接返回
      if (isBasicNode(cur)) {
        return cur;
      }
      // 遍历数组
      if (Array.isArray(cur)) {
        return cur.map((o, oIndex) =>
          deepRecursionParse({ cur: o, path: [...path, oIndex], ctx })
        ) as VNodeType;
      }
      // null、undefined等非对象类型类型
      if (!(cur instanceof Object)) {
        return cur;
      }
      // 遍历对象
      return Object.fromEntries(
        Object.keys(cur).map((k) => [
          k,
          deepRecursionParse({ cur: cur[k], path: [...path, k], ctx }),
        ])
      );
    }

    // 状态节点
    if (isStateNode(cur)) {
      return parseStateNode
        ? parseStateNode({ curSchema: cur, deepRecursionParse, path, ctx })
        : cur;
    }
    // 匿名函数节点
    if (isAnonymousFunctionNode(cur)) {
      const newCur = cur;
      // 自动递归便利渲染函数的组件树结构
      if (
        !customDeep &&
        newCur?.funcType === 'renderFunc' &&
        newCur?.renderFunc?.compTree
      ) {
        newCur.renderFunc.compTree = deepRecursionParse({
          cur: newCur.renderFunc.compTree,
          path: [...path, 'renderFunc', 'compTree'],
          ctx,
        });
      }

      if (!parseAnonymousFunctionNode) {
        return newCur;
      }

      return parseAnonymousFunctionNode({
        curSchema: newCur,
        deepRecursionParse,
        path,
        ctx,
      });
    }
    // 组件节点
    if (isSchemaCompTree(cur)) {
      const obj = cur;
      // 组件参数，参数可能深层嵌套schema节点
      // 每个组件都默认有一个key
      const props = {
        key: obj.id,
        ...Object.fromEntries(
          Object.keys(obj.props || {}).map((k) => [
            k,
            deepRecursionParse({
              cur: obj.props?.[k],
              path: [...path, 'props', k],
              ctx,
            }),
          ])
        ),
      };

      return parseSchemaComp
        ? parseSchemaComp({
            curSchema: cur,
            deepRecursionParse,
            path,
            props,
            ctx,
          })
        : cur;
    }
  };
  return deepRecursionParse({ cur: node, path: [], ctx: {} });
};

export const generateNode = <VNodeType>({
  schemaRootObj,
  getState,
  onCreateCompNode,
  libListMap,
  noMatchCompRender,
  noMatchLibRender,
  setState,
}: GenerateNodePropType<VNodeType>) => {
  const { schemaNodePaths = [], compTree } = schemaRootObj;
  // 解析渲染组件
  const nodeObj = parseObj({
    customDeep: true,
    node: compTree,
    nodePath: schemaNodePaths || [],
    parseStateNode: ({ curSchema }) => {
      const curState = getState?.({ stateName: curSchema.stateName });
      return curState;
    },

    parseAnonymousFunctionNode: ({
      curSchema,
      ctx,
      path,
      deepRecursionParse,
    }) => {
      const {
        params = [],
        IIFE = false,
        effectStates = [],
        dependences = [],
        funcType = 'func',
      } = curSchema;

      // console.log(str);

      const res = (...paramsValueList: AnyType[]) => {
        // TODO 转为switch case
        if (funcType === 'func') {
          const { body = '' } = curSchema.func || {};
          // 立即执行函数
          let parseBody = body;
          if (IIFE) {
            parseBody = `
            return ${body}`;
          }
          // 融合函数参数
          const { argList, argNameList } = generateFields({
            params,
            paramsValueList,
            dependences,
            getState,
            effectStates,
            setState,
            ctx,
          });
          return new Function(...argNameList, parseBody).call({}, ...argList);
        } else if (funcType === 'renderFunc') {
          const {
            compTree: renderCompTree,
            conditionType = 'default',
            listLoop,
            boolean,
          } = curSchema.renderFunc || {};
          // 融合函数参数
          const { argList, argNameList } = generateFields({
            params,
            paramsValueList,
            dependences: [],
            getState,
            effectStates: [],
            setState,
            ctx,
          });
          // TODO 转为switch -case
          if (conditionType === 'listLoop') {
            const { data = '', mapParams = [] } = listLoop || {};
            // 获取数组数据
            const listData = deepRecursionParse({
              cur: data,
              path: [...path, 'renderFunc', 'listMap', 'data'],
              ctx,
            });

            return (listData as AnyType[]).map((...mapParamsValueList) => {
              // 将map的渲染函数放入上下文
              const newCtx = {
                ...ctx,
                // 将函数参数传入下级的上下文
                ...Object.fromEntries([
                  ...argNameList.map((n, index) => [n, argList[index]]),
                  ...mapParams.map((mapParamItem, mapParamItemIndex) => [
                    mapParamItem,
                    mapParamsValueList[mapParamItemIndex],
                  ]),
                ]),
              };
              const r = deepRecursionParse({
                cur: renderCompTree,
                path: [...path, 'renderFunc', 'compTree'],
                ctx: newCtx,
              });
              return r;
            });
          } else if (conditionType === 'boolean') {
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
          }

          return deepRecursionParse({
            cur: renderCompTree,
            path: [...path, 'renderFunc', 'compTree'],
            ctx: {
              ...ctx,
              // 讲函数参数传入下级的上下文
              ...Object.fromEntries(
                argNameList.map((n, index) => [n, argList[index]])
              ),
            },
          });
        }
      };

      if (IIFE) {
        const funcRes = res();
        return funcRes;
      }

      return res;
    },
    parseSchemaComp: ({ curSchema: obj, props }) => {
      const lib = libListMap.get(obj.packageName);
      // 没有找到包
      if (!lib) {
        return noMatchLibRender({
          schema: obj,
        });
      }

      const { componentName } = obj;
      // 组件可能包含子组件，比如Form.Item,Radio.Group
      const compPath = componentName.split('.');
      let matchComp = lib;
      compPath.forEach((name) => {
        matchComp = (matchComp || {})[name];
      });
      // 没找到组件
      if (!matchComp) {
        return noMatchCompRender({
          schema: obj,
        });
      }

      const compNode = onCreateCompNode({
        comp: matchComp,
        props,
      });

      return compNode;
    },
  });

  return nodeObj;
};

/**
 * 解析对象，加载实际用到的依赖包，配合懒加载，尽量剔除无用的资源
 * @param obj
 * @param packageList
 * @returns
 */
export const loadLibList = async (
  obj: SchemaRootObj,
  libList: LibListItem[]
): Promise<LibListMapType> => {
  // 1、分析依赖包
  const packageMap: LibListMapType = new Map();
  const nameList: string[] = [];
  // 组件树所用到的组件
  parseObj({
    node: obj.compTree,
    nodePath: obj.schemaNodePaths || [],
    parseSchemaComp: ({ curSchema }) => {
      nameList.push(curSchema.packageName);
    },
  });
  // 后面可以从stat、event、ref提取
  // 2、异步加载依赖包
  const loadList = Array.from(new Set(nameList)).map((name) => {
    return (
      libList.find((p) => p.name === name)?.load?.() || Promise.resolve()
    ).then((res) => {
      if (res) {
        packageMap.set(name, res);
      }
    });
  });

  await Promise.all(loadList);

  return packageMap;
};

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
