import { FuncTypeEnum, generateFuncRes, generateRenderFuncRes } from '../func';
import { GenerateFuncBaseOptionType } from '../func/type';
import { AnyType, JSONValue } from '../type';
import { GenerateNodePropType } from './type';
import { generateArguments, parseObj } from './utils';

/**
 * 生成节点
 * @returns
 */
export const generateNode = <VNodeType>({
  schemaRootObj,
  getState,
  getRef,
  getHook,
  onCreateCompNode,
  modulesMap,
  noMatchCompRender,
  // noMatchLibRender,
  errorBoundaryRender,
  setState,
  parseSchemaCompFields = ['props'],
  ...rest
}: GenerateNodePropType<VNodeType, AnyType>) => {
  const { schemaNodePaths = [], compTree } = schemaRootObj;
  // 解析渲染组件
  const nodeObj = parseObj<VNodeType>(
    {
      // customDeep: true,
      ...rest,
      parseSchemaCompFields,
      node: compTree as unknown as JSONValue,
      nodePath: schemaNodePaths || [],
      parseStateNode: ({ curSchema }) => {
        const curState = getState?.({ stateName: curSchema.name });
        return curState;
      },
      parseRefNode: ({ curSchema }) => {
        const { name } = curSchema;
        return getRef?.({ refName: name });
      },
      parseHookNode: ({ curSchema }) => {
        const { name } = curSchema;
        return getHook?.({ name });
      },
      parseAnonymousFunctionNode: (
        { curSchema, ctx, path, deepRecursionParse },
        op
      ) => {
        const {
          params = [],
          IIFE = false,
          isPromise = false,
          effectStates = [],
          dependences = [],
          funcType = FuncTypeEnum.FUNC,
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
            modulesMap,
            getRef,
            getHook,
          });

          // 合并所需参数
          const mergeFuncParams: GenerateFuncBaseOptionType<
            VNodeType,
            typeof op
          > = {
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
            case FuncTypeEnum.FUNC:
              res = generateFuncRes(mergeFuncParams);
              break;
            case FuncTypeEnum.RENDERFUNC:
              res = generateRenderFuncRes(mergeFuncParams, op);
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
      parseSchemaComp: (p) => {
        let compNode: VNodeType;
        try {
          const { curSchema: obj, fields } = p;
          const { componentName } = obj;
          // 组件可能包含子组件，比如Form.Item,Radio.Group
          const compPath = componentName.split('.');
          let matchComp = { [compPath[0]]: modulesMap.get(compPath[0]) };
          compPath.forEach((name) => {
            matchComp = (matchComp || {})[name];
          });

          // 没找到组件
          if (!matchComp) {
            compNode = noMatchCompRender({
              schema: obj,
            });
          } else {
            compNode = onCreateCompNode({
              comp: matchComp,
              fields,
              parseProps: p,
            });
          }
        } catch (error) {
          console.error(error);
          compNode = errorBoundaryRender(error, p);
        }

        return compNode;
      },
    },
    {}
  );

  return nodeObj;
};
