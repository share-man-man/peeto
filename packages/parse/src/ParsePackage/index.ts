import type { SchemaRootObj, PackageListType, PackageMapType } from '..';
import { getStatePakcageNames } from '../ParseState';

/**
 * 解析对象，加载所有包
 * @param obj
 * @param packageList
 * @returns
 */
export const getPackageMap = async (
  obj: SchemaRootObj,
  packageList: PackageListType
) => {
  const packageMap: PackageMapType = new Map();
  let nameList: string[] = [];
  const stateNames = getStatePakcageNames(obj.states);
  nameList = nameList.concat(stateNames);

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
