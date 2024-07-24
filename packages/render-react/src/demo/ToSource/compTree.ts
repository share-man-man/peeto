import {
  AnyType,
  parseObj,
  ParseObjOptionType,
  SchemaRootObj,
} from '@peeto/core';

export class StateNode {
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
    let res = curSchema.stateName;
    if (parentNode === 'prop' || parentNode === 'comp') {
      res = `{${res}}`;
    }
    return res;
  }
  // 函数
  if (v && Object.getPrototypeOf(v) === AnonymousFunctionNode.prototype) {
    const { curSchema, deepRecursionParse, path, ctx } = v.config as Parameters<
      Required<ParseObjOptionType<AnyType>>['parseAnonymousFunctionNode']
    >[0];
    const { params = [], body = '', isCompTree = false, compTree } = curSchema;
    let funcBody = body;
    if (isCompTree) {
      const renderCompObj = deepRecursionParse({
        cur: curSchema.compTree,
        path: [...path, 'compTree'],
        ctx,
      });
      funcBody = getCompTreeStr(renderCompObj, {
        parentNode: 'comp',
      });

      if (Array.isArray(compTree) && compTree.length > 1) {
        funcBody = `<>${funcBody}</>`;
      }
      funcBody = `return ${funcBody}`;
    }
    let res = `(${(params || []).join(',')})=>{
        ${curSchema.IIFE ? 'return' : ''} ${funcBody}
      }`;
    if (curSchema.IIFE) {
      res = `(${res})()`;
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
      .map((i) => getCompTreeStr(i, { parentNode: 'object' }))
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
    if (parentNode === 'object') {
      return `${v}`;
    }
    return `{${v}}`;
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
    return res;
  }

  return `=====不支持的类型======`;
};

/**
 * 处理组件树的属性
 * @param schemaRootObj
 * @returns
 */
export const recusionCompTree = (schemaRootObj: SchemaRootObj) => {
  const libList: { [key: string]: Set<string> } = {};
  const treeObj = parseObj({
    node: schemaRootObj.compTree,
    nodePath: schemaRootObj.schemaNodePaths || [],
    parseStateNode: (p) => new StateNode(p),
    parseAnonymousFunctionNode: (p) => {
      return new AnonymousFunctionNode(p);
    },
    parseSchemaComp: (p) => {
      const { curSchema } = p;
      const { packageName: pName, componentName } = curSchema;
      const cName = componentName.split('.')[0];
      if (!libList[pName]) {
        libList[pName] = new Set();
      }
      libList[pName].add(cName);
      return new CompNode(p);
    },
  });

  return {
    libList,
    treeObj,
  };
};
