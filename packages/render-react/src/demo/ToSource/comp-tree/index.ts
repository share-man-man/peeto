import {
  AnyType,
  FuncTypeEnum,
  generateArguments,
  JSONObject,
  parseObj,
  ParseOptions,
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

export const getCompTreeStr = (obj: SchemaRootObj, op: ParseOptions) => {
  const resStr = parseObj<ReactNode>(
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

// export const getCompTreeStrOld = (
//   v: AnyType,
//   { parentNode }: { parentNode: 'comp' | 'prop' | 'object' }
// ): AnyType => {
//   // 状态
//   if (v && Object.getPrototypeOf(v) === StateNode.prototype) {
//     const { curSchema } = v.config as Parameters<
//       Required<ParseObjOptionType<AnyType>>['parseStateNode']
//     >[0];
//     let res = curSchema.name;
//     if (parentNode === 'prop' || parentNode === 'comp') {
//       res = `{${res}}`;
//     }
//     return res;
//   }
//   // ref
//   if (v && Object.getPrototypeOf(v) === RefNode.prototype) {
//     const { curSchema } = v.config as Parameters<
//       Required<ParseObjOptionType<AnyType>>['parseRefNode']
//     >[0];
//     let res = curSchema.name;
//     if (parentNode === 'prop' || parentNode === 'comp') {
//       res = `{${res}}`;
//     }
//     return res;
//   }
//   // hook
//   if (v && Object.getPrototypeOf(v) === HookNodeType.prototype) {
//     let res = (v as HookNodeType).name;
//     if (parentNode === 'prop' || parentNode === 'comp') {
//       res = `{${res}}`;
//     }
//     return res;
//   }
//   // 函数
//   if (v && Object.getPrototypeOf(v) === AnonymousFunctionNode.prototype) {
//     const { curSchema } = v.config as Parameters<
//       Required<ParseObjOptionType<AnyType>>['parseAnonymousFunctionNode']
//     >[0];

//     const { params = [], funcType = FuncTypeEnum.FUNC } = curSchema;

//     const mergeFuncParams: GenerateFuncBaseOptionType = {
//       curSchema,
//       deepRecursionParse: (d, op) => {
//         return getCompTreeStr(d, op || { parentNode });
//       },
//     };

//     let res: string = '';
//     let neverRes: never;
//     switch (funcType) {
//       case FuncTypeEnum.FUNC:
//         res = generateFuncRes(mergeFuncParams);
//         break;
//       case FuncTypeEnum.RENDERFUNC:
//         res = generateRenderFuncRes(mergeFuncParams);
//         break;
//       default:
//         neverRes = funcType;
//         if (neverRes) {
//           res = '';
//         }
//         break;
//     }

//     if (!curSchema.IIFE) {
//       res = `(${params.join(',')})=>{
//         ${res}
//       }`;
//     }

//     if (parentNode === 'comp' || parentNode === 'prop') {
//       res = `{${res}}`;
//     }

//     return res;
//   }
//   // 组件
//   if (v && Object.getPrototypeOf(v) === CompNode.prototype) {
//     const { curSchema, props } = v.config as Parameters<
//       Required<ParseObjOptionType<AnyType>>['parseSchemaComp']
//     >[0];
//     const { componentName } = curSchema;
//     const { children, ...newProps } = props || {};
//     return `<${componentName}
//                 ${Object.keys(newProps)
//                   .map(
//                     (k) =>
//                       `${k}=${getCompTreeStr(newProps[k], {
//                         parentNode: 'prop',
//                       })}`
//                   )
//                   .join('\n')}
//            ${
//              !children
//                ? ` />`
//                : `
//             >
//             ${getCompTreeStr(children, { parentNode: 'comp' })}
//             </${curSchema.componentName}>`
//            }

//       `;
//   }
//   // 其他类型
//   if (Array.isArray(v)) {
//     let res = v
//       .map((i) =>
//         getCompTreeStr(i, {
//           parentNode: parentNode === 'comp' ? 'comp' : 'object',
//         })
//       )
//       .join(parentNode === 'comp' ? '\n' : ',');

//     if (parentNode === 'prop') {
//       res = `{[${res}]}`;
//     }
//     if (parentNode === 'object') {
//       res = `[${res}]`;
//     }

//     return res;
//   }

//   if (['[object String]'].includes(Object.prototype.toString.call(v))) {
//     if (parentNode === 'prop') {
//       return `"${v}"`;
//     }
//     if (parentNode === 'object') {
//       return `"${v}"`;
//     }
//     return `${v}`;
//   }
//   if (
//     [
//       '[object Boolean]',
//       '[object Number]',
//       '[object Null]',
//       '[object Undefined]',
//     ].includes(Object.prototype.toString.call(v))
//   ) {
//     if (parentNode === 'prop') {
//       return `{${v}}`;
//     }
//     if (parentNode === 'comp') {
//       return `{${v}}`;
//     }
//     return `${v}`;
//   }

//   if (['[object Object]'].includes(Object.prototype.toString.call(v))) {
//     let res = `{
//     ${Object.keys(v).map(
//       (k) => `${k}:${getCompTreeStr(v[k], { parentNode: 'object' })}`
//     )}
//     }`;
//     if (parentNode === 'prop') {
//       res = `{${res}}`;
//     }
//     if (parentNode === 'comp') {
//       res = `{${res}}`;
//     }
//     return res;
//   }

//   return `=====不支持的类型======`;
// };

// /**
//  * 处理组件树的属性，用特定的类包装，以便后面识别
//  * @param schemaRootObj
//  * @returns
//  */
// export const recusionCompTree = (schemaRootObj: SchemaRootObj) => {
//   // const libList: { [key: string]: Set<string> } = {};
//   const treeObj = parseObj({
//     node: schemaRootObj.compTree as JSONValue,
//     nodePath: schemaRootObj.schemaNodePaths || [],
//     parseStateNode: (p) => new StateNode(p),
//     parseHookNode: (p) => new HookNodeType({ name: p.curSchema.name || '' }),
//     parseAnonymousFunctionNode: (p, op) => {
//       Object.keys(p.curSchema).forEach((k) => {
//         (p.curSchema as AnyType)[k] = p.deepRecursionParse(
//           {
//             cur: p.curSchema[k as keyof typeof p.curSchema] as JSONValue,
//             ctx: p.ctx,
//             path: [...p.path, k],
//           },
//           { ...op, parentNode: 'obj' }
//         );
//       });
//       return new AnonymousFunctionNode(p);
//     },
//     parseSchemaComp: (p) => {
//       return new CompNode(p);
//     },
//     parseRefNode: (p) => {
//       return new RefNode(p);
//     },
//   });

//   return {
//     // libList,
//     treeObj,
//   };
// };
