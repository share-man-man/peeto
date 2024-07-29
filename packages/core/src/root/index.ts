import { generateFuncRes, generateRenderFuncRes } from '../func';
import { GenerateFuncBaseOptionType } from '../func/type';
import { AnyType } from '../type';
import { GenerateNodePropType } from './type';
import { generateArguments, parseObj } from './utils';

export enum NodeType {
  STATE = 'state',
  EVENT = 'event',
  COMPONENT = 'component',
  REF = 'ref',
  ANONYMOUSFUNCTION = 'anonymous-function',
  LIB = 'lib',
}

/**
 * 生成节点
 * @returns
 */
export const generateNode = <VNodeType>({
  schemaRootObj,
  getState,
  getRef,
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
    parseRefNode: ({ curSchema }) => {
      const { refName } = curSchema;
      return getRef?.({ refName });
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
        isPromise = false,
        effectStates = [],
        dependences = [],
        funcType = 'func',
      } = curSchema;

      // 创建匿名函数
      const func = (...paramsValueList: AnyType[]) => {
        // 融合函数参数
        const { argList, argNameList } = generateArguments({
          params,
          paramsValueList,
          dependences,
          getState,
          effectStates,
          setState,
          ctx,
          libListMap,
          getRef,
        });

        //
        const mergeFuncParams: GenerateFuncBaseOptionType<VNodeType> = {
          curSchema,
          argList,
          argNameList,
          ctx,
          path,
          deepRecursionParse,
        };
        let res = null;
        let neverRes: never;
        switch (funcType) {
          case 'func':
            res = generateFuncRes(mergeFuncParams);
            break;
          case 'renderFunc':
            res = generateRenderFuncRes(mergeFuncParams);
            break;
          default:
            neverRes = funcType;
            if (neverRes) {
              res = null;
            }
            break;
        }

        if (isPromise) {
          return Promise.resolve(res);
        }

        return res;
      };

      if (IIFE) {
        const funcRes = func();
        return funcRes;
      }

      return func;
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
