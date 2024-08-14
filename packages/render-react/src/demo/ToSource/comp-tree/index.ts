import {
  AnyType,
  FuncTypeEnum,
  generateArguments,
  JSONObject,
  parseObj,
  SchemaRootObj,
} from '@peeto/core';
import { generateFuncRes, generateRenderFuncRes } from '../func';
import { ReactNode } from 'react';

export class StateNode {
  config: AnyType = null;
  constructor(c: AnyType) {
    this.config = c;
  }
}

export class RefNode {
  config: AnyType = null;
  constructor(c: AnyType) {
    this.config = c;
  }
}

export class AnonymousFunctionNode {
  config: AnyType = null;
  constructor(c: AnyType) {
    this.config = c;
  }
}
export class CompNode {
  config: AnyType = null;
  constructor(c: AnyType) {
    this.config = c;
  }
}

export type CustomOpType = { parentNode: 'comp' | 'prop' | 'object' };

export const getCompTreeStr = (obj: SchemaRootObj, op: CustomOpType) => {
  const resStr = parseObj<ReactNode, CustomOpType>(
    {
      node: obj.compTree as unknown as JSONObject,
      nodePath: obj.schemaNodePaths || [],
      parseBasicNode: ({ curSchema: v }, { parentNode }) => {
        if (['[object String]'].includes(Object.prototype.toString.call(v))) {
          if (parentNode === 'prop') {
            return `"${v}"`;
          }
          if (parentNode === 'object') {
            return `"${v}"`;
          }
          return `${v}`;
        }
        if (
          [
            '[object Boolean]',
            '[object Number]',
            '[object Null]',
            '[object Undefined]',
          ].includes(Object.prototype.toString.call(v))
        ) {
          if (parentNode === 'prop') {
            return `{${v}}`;
          }
          if (parentNode === 'comp') {
            return `{${v}}`;
          }
          return `${v}`;
        }
        return `=====不支持的类型======`;
      },
      parseObjectNode: (
        { curSchema: v, deepRecursionParse, path, ctx },
        { parentNode }
      ) => {
        const cv = v as unknown as JSONObject;
        let res = `{
  ${Object.keys(cv).map(
    (k) =>
      `${k}:${deepRecursionParse(
        { cur: cv[k], path: [...path, k], ctx },
        { parentNode: 'object' }
      )}`
  )}
  }`;
        if (parentNode === 'prop') {
          res = `{${res}}`;
        }
        if (parentNode === 'comp') {
          res = `{${res}}`;
        }
        return res;
      },
      parseArrayNode: (
        { curSchema, deepRecursionParse, path, ctx },
        { parentNode }
      ) => {
        let res = curSchema
          .map((i, index) =>
            deepRecursionParse(
              {
                cur: i,
                path: [...path, index],
                ctx,
              },
              {
                parentNode: parentNode === 'comp' ? 'comp' : 'object',
              }
            )
          )
          .join(parentNode === 'comp' ? '\n' : ',');

        if (parentNode === 'prop') {
          res = `{[${res}]}`;
        }
        if (parentNode === 'object') {
          res = `[${res}]`;
        }

        return res;
      },
      parseStateNode: ({ curSchema }, { parentNode }) => {
        let res = curSchema.name;
        if (['comp', 'prop'].includes(parentNode)) {
          res = `{${res}}`;
        }
        return res;
      },
      parseRefNode: ({ curSchema }, { parentNode }) => {
        let res = curSchema.name;
        if (parentNode === 'prop' || parentNode === 'comp') {
          res = `{${res}}`;
        }
        return res;
      },
      parseHookNode: ({ curSchema }, { parentNode }) => {
        let res = curSchema.name;
        if (parentNode === 'prop' || parentNode === 'comp') {
          res = `{${res}}`;
        }
        return res;
      },
      parseAnonymousFunctionNode: (
        { curSchema, path, ctx, deepRecursionParse },
        { parentNode }
      ) => {
        const {
          params = [],
          IIFE = false,
          isPromise = false,
          effectStates = [],
          dependences = [],
          funcType = FuncTypeEnum.FUNC,
        } = curSchema;

        const { argList, argNameList } = generateArguments({
          params,
          paramsValueList: [],
          dependences,
          getState: () => {
            //
          },
          effectStates,
          setState: () => {
            //
          },
          ctx,
          modulesMap: new Map(),
          getRef: () => {
            //
          },
          getHook: () => {
            //
          },
        });

        const mergeFuncParams = {
          curSchema,
          argList,
          argNameList,
          ctx,
          path,
          deepRecursionParse,
        };
        let res: string = '';
        let neverRes: never;
        switch (funcType) {
          case FuncTypeEnum.FUNC:
            res = generateFuncRes(mergeFuncParams);
            break;
          case FuncTypeEnum.RENDERFUNC:
            res = generateRenderFuncRes(mergeFuncParams);
            break;
          default:
            neverRes = funcType;
            if (neverRes) {
              res = '';
            }
            break;
        }
        if (!IIFE) {
          res = `${isPromise ? 'async' : ''}(${params.join(',')})=>{
          ${res}
        }`;
        }
        if (parentNode === 'comp' || parentNode === 'prop') {
          res = `{${res}}`;
        }
        return res;
      },
      parseSchemaComp: ({ curSchema, deepRecursionParse, path, ctx }) => {
        const { componentName, props } = curSchema;
        const { children, ...newProps } = props || {};

        return `<${componentName}
                    ${Object.keys(newProps)
                      .map(
                        (k) =>
                          `${k}=${deepRecursionParse(
                            {
                              cur: newProps[k],
                              path: [...path, 'props', k],
                              ctx,
                            },
                            {
                              parentNode: 'prop',
                            }
                          )}`
                      )
                      .join('\n')}
               ${
                 !children
                   ? ` />`
                   : `
                >
               ${deepRecursionParse(
                 {
                   cur: children,
                   path: [...path, 'props', 'children'],
                   ctx,
                 },
                 {
                   parentNode: 'comp',
                 }
               )}
                </${curSchema.componentName}>`
               }
          `;
      },
    },
    op
  );

  return resStr;
};
