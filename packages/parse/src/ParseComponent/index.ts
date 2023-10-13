import type { ParseComponentProps, SchemaCompTree } from './type';
import type { CompMapType, JSONValue, SchemaRootObj } from '../type';
import { isSchemaCompTree, getCompId } from '../utils';

/**
 * 深度遍历组件树
 * @param param0
 * @returns
 */
const deepRecursionCompTree = ({
  obj,
  compCallback,
}: {
  obj: JSONValue;
  compCallback: (compObj: SchemaCompTree) => void;
}): JSONValue => {
  // 数组节点遍历渲染
  if (Array.isArray(obj)) {
    return obj.map((o) => deepRecursionCompTree({ obj: o, compCallback }));
  }
  // 排除null、undefined类型
  if (!(obj instanceof Object)) {
    return obj;
  }
  // schema节点
  if (isSchemaCompTree(obj)) {
    compCallback(obj);
  }

  return Object.fromEntries(
    Object.keys(obj).map((k) => [
      k,
      deepRecursionCompTree({ obj: obj[k], compCallback }),
    ])
  );
};

/**
 * 获取组件树依赖的包名
 * @param compTrees
 * @returns
 */
export const getCompPakcageNames = (compTrees: SchemaRootObj['compTree']) => {
  const nameSet = new Set<string>();
  deepRecursionCompTree({
    obj: compTrees,
    compCallback: (obj) => {
      nameSet.add(obj.packageName);
    },
  });
  return Array.from(nameSet);
};

/**
 * 异步加载组件集合
 * @param param0
 * @returns
 */
export const parseComponent = <VNodeType>({
  schemaCompTree,
  packageMap,
  noMatchCompRender,
  noMatchPackageRender,
}: ParseComponentProps<VNodeType>): CompMapType => {
  const compMap: CompMapType = new Map();
  deepRecursionCompTree({
    obj: schemaCompTree,
    compCallback: (obj) => {
      const compId = getCompId(obj);
      const pack = packageMap.get(obj.packageName);
      // 没有找到包
      if (!pack) {
        compMap.set(compId, () => noMatchPackageRender(obj));
        return;
      }
      const { componentName } = obj;
      // 组件可能包含子组件
      const compPath = componentName.split('.');
      let matchComp = pack;
      compPath.forEach((name) => {
        matchComp = (matchComp || {})[name];
      });
      // 没找到组件
      if (!matchComp) {
        compMap.set(compId, () => noMatchCompRender(obj));
        return;
      }
      compMap.set(compId, matchComp);
    },
  });
  return compMap;
};
