// import type { AnyType, PackageMapType, SchemaRootObj } from '../type';
// import type { SchemaStateItem, StateJSExpressionType } from './type';

// /**
//  * 是否为表达式状态
//  * @param obj
//  * @returns
//  */
// const isStateFunction = (obj: AnyType): obj is StateJSExpressionType => {
//   return obj?.type === 'JSExpression';
// };

// /**
//  * 获取状态集依赖的包名
//  * @param stateList
//  * @returns
//  */
// export const getStatePakcageNames = (stateList?: SchemaRootObj['states']) => {
//   const nameSet = new Set<string>();
//   (stateList || []).forEach((state) => {
//     const initialValue = state.initialValue;
//     if (isStateFunction(initialValue)) {
//       (initialValue.packages || []).forEach((n) => {
//         nameSet.add(n);
//       });
//     }
//   });
//   return Array.from(nameSet);
// };

// /**
//  * 设置初始化状态
//  * @param param0
//  * @returns
//  */
// export const parseState = ({
//   initialValue,
//   packageMap,
// }: {
//   initialValue?: SchemaStateItem['initialValue'];
//   packageMap?: PackageMapType;
// }) => {
//   let returnValue = initialValue;
//   // if (isStateFunction(initialValue)) {
//   //   returnValue = new Function(`return ${initialValue.value}`).call(
//   //     Object.fromEntries(
//   //       initialValue.packages.map((pack) => [pack, packageMap?.get(pack)])
//   //     )
//   //   );
//   // }
//   return returnValue;
// };
