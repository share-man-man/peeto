import type { SchemaRootObj, PackageListType, PackageMapType } from '..';
import { getCompPakcageNames } from '../ParseComponent';
import { getStatePakcageNames } from '../ParseState';

/**
 * 解析对象，加载所有依赖包
 * @param obj
 * @param packageList
 * @returns
 */
export const parsePackage = async (
  obj: SchemaRootObj,
  packageList: PackageListType
) => {
  // 1、分析依赖包
  const packageMap: PackageMapType = new Map();
  let nameList: string[] = [];
  const stateNames = getStatePakcageNames(obj.states);
  const compNames = getCompPakcageNames(obj.compTree);
  nameList = nameList.concat(stateNames).concat(compNames);
  // 2、异步加载依赖包
  const loadList = Array.from(new Set(nameList)).map((name) => {
    return (
      packageList.find((p) => p.name === name)?.load?.() || Promise.resolve()
    ).then((res) => {
      if (res) {
        packageMap.set(name, res);
      }
    });
  });

  await Promise.all(loadList);

  return packageMap;
};
