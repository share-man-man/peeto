import { isBasicNode, isSchemaCompTree } from '../component';
import { SchemaCompTreeItem, SchemaCompTreePath } from '../component/type';
import { getSetStateName, isAnonymousFunctionNode } from '../event';
import { AnonymousFunctionNode } from '../event/type';
import { LibListMapType, LibListItem } from '../lib/type';
import { isStateNode } from '../state';
import { StateNodeType } from '../state/type';
import { AnyType, JSONValue } from '../type';
import {
  DeepRecursionParseType,
  GenerateNodePropType,
  ParseNodeBaseProp,
  SchemaRootObj,
} from './type';

export enum NodeType {
  STATE = 'state',
  EVENT = 'event',
  COMPONENT = 'component',
  REF = 'ref',
  ANONYMOUSFUNCTION = 'anonymous-function',
}

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
}: {
  node: JSONValue;
  nodePath: SchemaCompTreePath[];
  parseStateNode?: (p: ParseNodeBaseProp<StateNodeType, VNodeType>) => AnyType;
  parseAnonymousFunctionNode?: (
    p: ParseNodeBaseProp<AnonymousFunctionNode, VNodeType>
  ) => AnyType;
  parseSchemaComp?: (
    p: ParseNodeBaseProp<SchemaCompTreeItem, VNodeType> & {
      props: AnyType;
      children: AnyType;
    }
  ) => AnyType;
}) => {
  const deepRecursionParse: DeepRecursionParseType<VNodeType> = ({
    cur,
    path,
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
          deepRecursionParse({ cur: o, path: [...path, oIndex] })
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
          deepRecursionParse({ cur: cur[k], path: [...path, k] }),
        ])
      );
    }

    // 状态节点
    if (isStateNode(cur)) {
      return parseStateNode
        ? parseStateNode({ curSchema: cur, deepRecursionParse, path })
        : cur;
    }
    // 匿名函数节点
    if (isAnonymousFunctionNode(cur)) {
      return parseAnonymousFunctionNode
        ? parseAnonymousFunctionNode({
            curSchema: cur,
            deepRecursionParse,
            path,
          })
        : cur;
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
            }),
          ])
        ),
      };
      // 解析children，children可能是单一节点，可能是数组节点
      const children = !Array.isArray(obj.children)
        ? deepRecursionParse({
            cur: obj.children || null,
            path: [...path, 'children'],
          })
        : (obj.children || []).map((c, cIndex) =>
            deepRecursionParse({ cur: c, path: [...path, 'children', cIndex] })
          );

      return parseSchemaComp
        ? parseSchemaComp({
            curSchema: cur,
            deepRecursionParse,
            path,
            props,
            children,
          })
        : cur;
    }
  };
  return deepRecursionParse({ cur: node, path: [] });
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
  const { compTreePaths = [], compTree } = schemaRootObj;

  // 解析渲染组件
  return parseObj({
    node: compTree,
    nodePath: compTreePaths || [],
    parseStateNode: ({ curSchema }) =>
      getState?.({ stateName: [curSchema.stateName] })?.[0],
    parseAnonymousFunctionNode: ({ curSchema }) => {
      const { params = [], body, effects = [] } = curSchema;
      const funcBind: /* typeof ext & */ {
        states?: Record<string, AnyType>;
      } & {
        [k in string]: (v: AnyType) => void;
      } = {
        // ...ext,
        // states: Object.fromEntries(
        //   obj.states?.map((s) => [s, getState?.([s])]) || []
        // ),
      };
      // 安全考虑，暴露特定的函数、变量
      const effectEventList = effects.map((name) => {
        const setStateName = getSetStateName({ stateName: name });
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
        return { setStateName, run };
      });
      effectEventList.forEach(({ setStateName, run }) => {
        funcBind[setStateName] = run;
      });
      // TODO 箭头函数兼容性待验证
      const res = new Function(`
        ${effectEventList.map(
          ({ setStateName }) => `const ${setStateName} = this.${setStateName}`
        )}
        return (${params.join(',')})=>{
          ${body}
        }
      `).call(funcBind);
      return res;
    },
    parseSchemaComp: ({ curSchema: obj, props, children }) => {
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

      return onCreateCompNode({
        comp: matchComp,
        props,
        children,
      });
    },
  });
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
    nodePath: obj.compTreePaths || [],
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
