import type { AnyType, PackageMapType } from '../type';
import type { SchemaStateItem, StateJSExpressionType } from './type';

const isStateFunction = (obj: AnyType): obj is StateJSExpressionType => {
  return obj?.type === 'JSExpression';
};

/**
 *
 * @param stateList
 * @returns
 */
export const getStatePakcageNames = (stateList?: SchemaStateItem[]) => {
  const nameSet = new Set<string>();
  (stateList || []).forEach((state) => {
    const initialValue = state.initialValue;
    if (isStateFunction(initialValue)) {
      (initialValue.packages || []).forEach((n) => {
        nameSet.add(n);
      });
    }
  });
  return Array.from(nameSet);
};

/**
 * 设置初始化状态
 * @param param0
 * @returns
 */
export const parseState = ({
  initialValue,
  packageMap,
}: {
  initialValue?: SchemaStateItem['initialValue'];
  packageMap?: PackageMapType;
}) => {
  let returnValue = initialValue;
  if (isStateFunction(initialValue)) {
    returnValue = new Function(`return ${initialValue.value}`).call(
      Object.fromEntries(
        initialValue.packages.map((pack) => [pack, packageMap?.get(pack)])
      )
    );
  }
  return returnValue;
};
