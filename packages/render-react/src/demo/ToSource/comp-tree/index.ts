import {
  AnyType,
  FuncTypeEnum,
  HookNodeType,
  JSONValue,
  parseObj,
  ParseObjOptionType,
  SchemaRootObj,
} from '@peeto/core';
import {
  GenerateFuncBaseOptionType,
  generateFuncRes,
  generateRenderFuncRes,
} from '../func';

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

export const getCompTreeStr = (
  v: AnyType,
  { parentNode }: { parentNode: 'comp' | 'prop' | 'object' }
): AnyType => {
  // 状态
  if (v && Object.getPrototypeOf(v) === StateNode.prototype) {
    const { curSchema } = v.config as Parameters<
      Required<ParseObjOptionType<AnyType>>['parseStateNode']
    >[0];
    let res = curSchema.name;
    if (parentNode === 'prop' || parentNode === 'comp') {
      res = `{${res}}`;
    }
    return res;
  }
  // ref
  if (v && Object.getPrototypeOf(v) === RefNode.prototype) {
    const { curSchema } = v.config as Parameters<
      Required<ParseObjOptionType<AnyType>>['parseRefNode']
    >[0];
    let res = curSchema.name;
    if (parentNode === 'prop' || parentNode === 'comp') {
      res = `{${res}}`;
    }
    return res;
  }
  // hook
  if (v && Object.getPrototypeOf(v) === HookNodeType.prototype) {
    let res = (v as HookNodeType).name;
    if (parentNode === 'prop' || parentNode === 'comp') {
      res = `{${res}}`;
    }
    return res;
  }
  // 函数
  if (v && Object.getPrototypeOf(v) === AnonymousFunctionNode.prototype) {
    const { curSchema } = v.config as Parameters<
      Required<ParseObjOptionType<AnyType>>['parseAnonymousFunctionNode']
    >[0];

    const { params = [], funcType = FuncTypeEnum.FUNC } = curSchema;

    const mergeFuncParams: GenerateFuncBaseOptionType = {
      curSchema,
      deepRecursionParse: (d, op) => {
        return getCompTreeStr(d, op || { parentNode });
      },
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

    if (!curSchema.IIFE) {
      res = `(${params.join(',')})=>{
        ${res}
      }`;
    }

    if (parentNode === 'comp' || parentNode === 'prop') {
      res = `{${res}}`;
    }

    return res;
  }
  // 组件
  if (v && Object.getPrototypeOf(v) === CompNode.prototype) {
    const { curSchema, props } = v.config as Parameters<
      Required<ParseObjOptionType<AnyType>>['parseSchemaComp']
    >[0];
    const { componentName } = curSchema;
    const { children, ...newProps } = props || {};
    return `<${componentName}
                ${Object.keys(newProps)
                  .map(
                    (k) =>
                      `${k}=${getCompTreeStr(newProps[k], {
                        parentNode: 'prop',
                      })}`
                  )
                  .join('\n')}
           ${
             !children
               ? ` />`
               : `
            >
            ${getCompTreeStr(children, { parentNode: 'comp' })}
            </${curSchema.componentName}>`
           }

      `;
  }
  // 其他类型
  if (Array.isArray(v)) {
    let res = v
      .map((i) =>
        getCompTreeStr(i, {
          parentNode: parentNode === 'comp' ? 'comp' : 'object',
        })
      )
      .join(parentNode === 'comp' ? '\n' : ',');

    if (parentNode === 'prop') {
      res = `{[${res}]}`;
    }
    if (parentNode === 'object') {
      res = `[${res}]`;
    }

    return res;
  }

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

  if (['[object Object]'].includes(Object.prototype.toString.call(v))) {
    let res = `{
    ${Object.keys(v).map(
      (k) => `${k}:${getCompTreeStr(v[k], { parentNode: 'object' })}`
    )}
    }`;
    if (parentNode === 'prop') {
      res = `{${res}}`;
    }
    if (parentNode === 'comp') {
      res = `{${res}}`;
    }
    return res;
  }

  return `=====不支持的类型======`;
};

/**
 * 处理组件树的属性，用特定的类包装，以便后面识别
 * @param schemaRootObj
 * @returns
 */
export const recusionCompTree = (schemaRootObj: SchemaRootObj) => {
  // const libList: { [key: string]: Set<string> } = {};
  const treeObj = parseObj({
    node: schemaRootObj.compTree as JSONValue,
    nodePath: schemaRootObj.schemaNodePaths || [],
    parseStateNode: (p) => new StateNode(p),
    parseHookNode: (p) => new HookNodeType({ name: p.curSchema.name || '' }),
    parseAnonymousFunctionNode: (p) => {
      Object.keys(p.curSchema).forEach((k) => {
        (p.curSchema as AnyType)[k] = p.deepRecursionParse({
          cur: p.curSchema[k as keyof typeof p.curSchema] as JSONValue,
          ctx: p.ctx,
          path: [...p.path, k],
        });
      });
      return new AnonymousFunctionNode(p);
    },
    parseSchemaComp: (p) => {
      return new CompNode(p);
    },
    parseRefNode: (p) => {
      return new RefNode(p);
    },
  });

  return {
    // libList,
    treeObj,
  };
};
