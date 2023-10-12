import type { SchemaCompTree } from './type';
import type {
  SchemaRootObj,
  PackageListType,
  CompMapType,
  JSONValue,
} from '../type';
import { isSchemaCompTree, getCompId } from '../utils';

/**
 * 异步加载组件集合
 * @param param0
 * @returns
 */
export const ParseComponent = async <VNodeType>({
  schemaCompTree,
  packageList,
  noMatchCompRender,
  noMatchPackageRender,
}: {
  /**
   * 组件树
   */
  schemaCompTree: SchemaRootObj['compTree'];
  /**
   * 组件库列表
   */
  packageList: PackageListType;
  /**
   * 没有找到组件
   * @param obj
   * @returns
   */
  noMatchCompRender: (obj: SchemaCompTree) => VNodeType;
  /**
   * 没有找到包
   * @param obj
   * @returns
   */
  noMatchPackageRender: (obj: SchemaCompTree) => VNodeType;
}): Promise<CompMapType> => {
  const compMap: CompMapType = new Map();
  // 需要异步加载的组件
  const asyncLoadList: {
    id: string;
    load: Promise<void>;
  }[] = [];
  /**
   * 解析schema,异步加载组件
   * @param obj
   * @returns
   */
  const deepRecursionLoad = (obj: JSONValue): JSONValue => {
    // 数组节点遍历渲染
    if (Array.isArray(obj)) {
      return obj.map((o) => deepRecursionLoad(o));
    }
    // 排除null、undefined类型
    if (!(obj instanceof Object)) {
      return obj;
    }
    // schema节点
    if (isSchemaCompTree(obj)) {
      const compId = getCompId(obj);
      // 多个相同的组件不重复加载
      if (!asyncLoadList.some((a) => a.id === compId)) {
        let loadPackageFunc = packageList.find(
          (p) => p?.name === obj.packageName
        )?.load;

        if (!loadPackageFunc) {
          loadPackageFunc = async () => undefined;
        }
        asyncLoadList.push({
          id: compId,
          load: loadPackageFunc().then((pack) => {
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
          }),
        });
      }
    }

    return Object.fromEntries(
      Object.keys(obj).map((k) => [k, deepRecursionLoad(obj[k])])
    );
  };
  deepRecursionLoad(schemaCompTree);
  // 等待所有组件加载完毕
  await Promise.all(asyncLoadList.map((a) => a.load));
  return compMap;
};
