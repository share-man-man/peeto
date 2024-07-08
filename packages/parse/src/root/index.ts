// import { getCompPakcageNames } from '../component';
import { parseObj } from '../component';
import { LibListMapType, LibListItem } from '../lib/type';
import { SchemaRootObj } from './type';
// import { getStatePakcageNames } from '../state';

export enum NodeType {
  STATE = 'state',
  EVENT = 'event',
  COMPONENT = 'component',
  REF = 'ref',
  ANONYMOUSFUNCTION = 'anonymous-function',
}

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
