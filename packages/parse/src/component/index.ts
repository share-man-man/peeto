// /**
//  * 深度遍历组件树
//  * @param param0
//  * @returns
//  */
// export const deepRecursionCompTree = ({
//   obj,
//   compCallback,
// }: {
//   obj: JSONValue;
//   compCallback: (compObj: SchemaCompTreeItem) => void;
// }): JSONValue => {
//   // 数组节点遍历渲染
//   if (Array.isArray(obj)) {
//     return obj.map((o) => deepRecursionCompTree({ obj: o, compCallback }));
//   }
//   // 排除null、undefined类型
//   if (!(obj instanceof Object)) {
//     return obj;
//   }
//   // schema节点
//   if (isSchemaCompTree(obj)) {
//     compCallback(obj);
//   }

import { AnonymousFunction } from '../root/type';
import { AnyType, JSONValue } from '../type';
import {
  GenerateNodePropType,
  SchemaCompTreeItem,
  SchemaCompTreePath,
} from './type';

//   return Object.fromEntries(
//     Object.keys(obj).map((k) => [
//       k,
//       deepRecursionCompTree({ obj: obj[k], compCallback }),
//     ])
//   );
// };

// /**
//  * 获取组件树依赖的包名
//  * @param compTrees
//  * @returns
//  */
// export const getCompPakcageNames = ({ compTreeLibMap = [] }: SchemaRootObj) => {
//   const nameSet = new Set<string>();
//   compTreeLibMap.forEach((c) => {
//     nameSet.add(c.packageName);
//   });
//   // deepRecursionCompTree({
//   //   obj: compTree,
//   //   compCallback: (obj) => {
//   //     nameSet.add(obj.packageName);
//   //   },
//   // });

//   return Array.from(nameSet);
// };

// /**
//  * 加载组件集合
//  * @param param0
//  * @returns
//  */
// export const parseComponent = <VNodeType>({
//   schemaCompTree,
//   libListMap,
//   compTreeLibMap,
//   noMatchCompRender,
//   noMatchPackageRender,
// }: ParseComponentProps<VNodeType>): CompMapType => {
//   const compMap: CompMapType = new Map();
//   deepRecursionCompTree({
//     obj: schemaCompTree,
//     compCallback: (obj) => {
//       const compId = getCompId(obj);
//       const pack = libListMap.get(obj.packageName);
//       // 没有找到包
//       if (!pack) {
//         compMap.set(compId, () => noMatchPackageRender(obj));
//         return;
//       }
//       const { componentName } = obj;
//       // 组件可能包含子组件
//       const compPath = componentName.split('.');
//       let matchComp = pack;
//       compPath.forEach((name) => {
//         matchComp = (matchComp || {})[name];
//       });
//       // 没找到组件
//       if (!matchComp) {
//         compMap.set(compId, () => noMatchCompRender(obj));
//         return;
//       }
//       compMap.set(compId, matchComp);
//     },
//   });
//   return compMap;
// };

/**
 * 是否为基础节点
 * @param obj
 * @returns
 */
export const isBasicType = (obj: AnyType): boolean => {
  return [
    '[object String]',
    '[object Number]',
    '[object Boolean]',
    '[object Undefined]',
    null,
  ].includes(Object.prototype.toString.call(obj));
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

export const generateNode = <VNodeType>({
  schemaRootObj,
  getState,
  onCreateNode,
  libListMap,
  noMatchCompRender,
  noMatchPackageRender,
  setState,
}: GenerateNodePropType<VNodeType>) => {
  const {
    stateCompTreeeMap = [],
    compTreeLibMap = [],
    anonymousFunctionList = [],
    // eventCompTreeeMap = [],
    // refCompTreeeMap = [],
  } = schemaRootObj;

  const deepRecursionParse = ({
    cur,
    path,
  }: {
    cur: JSONValue;
    path: SchemaCompTreePath;
  }): VNodeType | JSONValue | AnyType => {
    // 状态
    const stateItem = stateCompTreeeMap.find((map) =>
      map.paths.some((p) => isPathEqual(p, path))
    );
    if (stateItem) {
      return getState?.({ stateName: [stateItem.stateName] })?.[0];
    }
    // 匿名函数
    const anonymousFunctionItem = anonymousFunctionList.find((f) =>
      isPathEqual(f.path, path)
    );
    if (anonymousFunctionItem) {
      const {
        params = [],
        body,
        effects = [],
      } = cur as unknown as AnonymousFunction;
      const funcBind: /* typeof ext & */ {
        states?: Record<string, AnyType>;
        onChangeState?: (changeObj: [string, AnyType][]) => void;
      } = {
        // ...ext,
        // states: Object.fromEntries(
        //   obj.states?.map((s) => [s, getState?.([s])]) || []
        // ),
      };
      // 安全考虑，暴露特定的函数、变量
      funcBind.onChangeState = (changeObj) => {
        setState?.({
          fieldList: (changeObj || [])
            .filter(([name]) => (effects || []).some((e) => e === name))
            .map(([name, value]) => ({
              name,
              value,
            })),
        });
      };
      // TODO 箭头函数兼容性待验证
      const res = new Function(`
        const onChangeState = this.onChangeState;
        return (${params.join(',')})=>{
          ${body}
        }
      `).call(funcBind);
      return res;
    }
    // // 事件
    // const eventItem = eventCompTreeeMap.find((map) =>
    //   map.paths.some((p) => isPathEqual(p, path))
    // );
    // if (eventItem) {
    //   return getEvent?.({ eventName: eventItem.eventName });
    // }
    // // ref
    // const refItem = refCompTreeeMap.find((map) =>
    //   map.paths.some((p) => isPathEqual(p, path))
    // );
    // if (refItem) {
    //   return getRef?.({ refName: refItem.refName });
    // }
    // // TODO 函数
    // 组件
    const compTreeItem = compTreeLibMap.find((map) =>
      map.path.some((p) => isPathEqual(p, path))
    );
    if (compTreeItem) {
      const obj = cur as SchemaCompTreeItem;
      const lib = libListMap.get(compTreeItem.packageName);
      // 没有找到包
      if (!lib) {
        return noMatchPackageRender({
          schema: obj,
          compTreeItem,
        });
      }

      const { componentName } = compTreeItem;
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
          compTreeItem,
        });
      }

      // 组件参数，参数可能深层嵌套schema节点
      const props = {
        // 每个组件都默认有一个key
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

      return onCreateNode({
        comp: matchComp,
        props,
        children,
      });
    }

    // 基础节点，直接返回
    if (isBasicType(cur)) {
      return cur;
    }
    // 数组节点遍历渲染
    if (Array.isArray(cur)) {
      return cur.map((o, oIndex) =>
        deepRecursionParse({ cur: o, path: [...path, oIndex] })
      ) as VNodeType;
    }
    // null、undefined等非对象类型类型
    if (!(cur instanceof Object)) {
      return cur;
    }

    return Object.fromEntries(
      Object.keys(cur).map((k) => [
        k,
        deepRecursionParse({ cur: cur[k], path: [...path, k] }),
      ])
    );
  };

  // 解析渲染组件
  return deepRecursionParse({ cur: schemaRootObj.compTree, path: [] });
};
