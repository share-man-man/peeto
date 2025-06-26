import { SchemaRootObj } from '../type';
import {
  LibListItem,
  ModulesMapType,
  SchemaLibItem,
  SchemaLibItemSubsItem,
} from './type';

/**
 * 解析对象，加载实际用到的依赖包，并且解析子模块
 * 配合懒加载，尽量剔除无用的资源
 * @param obj
 * @param packageList
 * @returns
 */
export const loadLibList = async (
  obj: SchemaRootObj,
  libList: LibListItem[]
): Promise<ModulesMapType> => {
  // 1、分析依赖包
  const map: ModulesMapType = new Map();
  const { libModules = [] } = obj;
  const nameList = libModules.map((l) => l.name);
  // 2、异步加载依赖包
  const loadList = nameList.map((name) => {
    return (
      libList.find((p) => p.name === name)?.load?.() || Promise.resolve()
    ).then((res) => {
      if (res) {
        libModules.forEach((l) => {
          if (l.name === name) {
            l.subs.forEach((s) => {
              // 处理子模块别名
              map.set(s.alias || s.name, res[s.name]);
            });
          }
        });
      }
    });
  });

  await Promise.all(loadList);

  return map;
};

/**
 * 通过子模块名获取包
 * @param param0
 * @returns
 */
export const getLibModuleByName = ({
  libModules,
  name,
}: {
  libModules: SchemaLibItem[];
  name: Exclude<
    SchemaLibItemSubsItem['alias'] | SchemaLibItemSubsItem['name'],
    undefined
  >;
}): {
  libName: SchemaLibItem['name'] | null;
  moduleItem: SchemaLibItemSubsItem | null;
} => {
  let libName: SchemaLibItem['name'] | null = null;
  let moduleItem: SchemaLibItemSubsItem | null = null;

  libModules.forEach((lib) => {
    lib.subs.forEach((s) => {
      if (s.alias === name || s.name === name) {
        libName = lib.name;
        moduleItem = s;
      }
    });
  });

  return {
    libName,
    moduleItem,
  };
};
