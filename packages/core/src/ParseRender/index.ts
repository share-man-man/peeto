// TODO 待删除
// import {
//   getCompId,
//   isBasicType,
//   isExpression,
//   isFunction,
//   isRenderFunction,
//   isSchemaCompTree,
//   isState,
//   isStateEffect,
// } from '../utils';
// import type { AnyType, JSONValue } from '../type';
// import type { RenderProps } from './type';

// /**
//  * 解析schema，返回节点
//  * @param param0
//  * @returns
//  */
// export const render = <VNodeType>({
//   getState,
//   setState,
//   schemaCompTree,
//   onCreateNode,
//   compMap,
// }: RenderProps<VNodeType>) => {
//   /**
//    * 递归解析schema
//    * @param obj
//    * @param ext
//    * @returns
//    */
//   const deepRecursionParse = (
//     obj: JSONValue,
//     ext: {
//       /**
//        * 作用域变量
//        */
//       scope?: Record<string, AnyType>;
//     }
//   ): VNodeType | JSONValue | AnyType => {
//     // 基础节点，直接返回
//     if (isBasicType(obj)) {
//       return obj;
//     }
//     // 数组节点遍历渲染
//     if (Array.isArray(obj)) {
//       return obj.map((o) => deepRecursionParse(o, ext)) as VNodeType;
//     }
//     // 排除null、undefined类型
//     if (!(obj instanceof Object)) {
//       return obj;
//     }
//     // schema节点，从ComponentList里匹配组件
//     if (isSchemaCompTree(obj)) {
//       // 组件参数，参数可能深层嵌套schema节点
//       const props = {
//         // 每个组件都默认有一个key
//         key: obj.id,
//         ...Object.fromEntries(
//           Object.keys(obj.props || {}).map((k) => [
//             k,
//             deepRecursionParse(obj.props?.[k], ext),
//           ])
//         ),
//       };
//       // 解析children，children可能是单一节点，可能是数组节点
//       const children = !Array.isArray(obj.children)
//         ? deepRecursionParse(obj.children || null, ext)
//         : (obj.children || []).map((c) => deepRecursionParse(c, ext));

//       return onCreateNode(compMap.get(getCompId(obj)), props, children);
//     }
//     // 状态节点
//     if (isState(obj)) {
//       return getState?.([obj.state])?.[0];
//     }
//     // 表达式节点
//     if (isExpression(obj)) {
//       const func = new Function(`return ${obj?.value}`).bind(ext);
//       return func();
//     }
//     // 函数节点
//     if (isFunction(obj)) {
//       const funcBind: typeof ext & {
//         states?: Record<string, AnyType>;
//         onChangeState?: (changeObj: [string, AnyType][]) => void;
//       } = {
//         ...ext,
//         states: Object.fromEntries(
//           obj.states?.map((s) => [s, getState?.([s])]) || []
//         ),
//       };

//       // 渲染函数节点
//       if (isRenderFunction(obj)) {
//         return new Function('...params', 'return this.render(params);').bind({
//           render: (params: AnyType[]) => {
//             if (!obj.children) {
//               return;
//             }
//             funcBind.scope = {
//               ...funcBind.scope,
//               ...Object.fromEntries(
//                 obj.params.map((k, index) => [k, params[index]])
//               ),
//             };

//             // 处理children是否为数组或单schema的情况
//             if (Array.isArray(obj.children)) {
//               return obj.children.map((o) => deepRecursionParse(o, funcBind));
//             }
//             return deepRecursionParse(obj.children, funcBind);
//           },
//         });
//       }

//       // 修改状态节点
//       if (isStateEffect(obj)) {
//         funcBind.onChangeState = (changeObj) => {
//           setState?.(
//             (changeObj || [])
//               .filter(([name]) => (obj.effects || []).some((e) => e === name))
//               .map(([name, value]) => ({
//                 name,
//                 value,
//               }))
//           );
//         };
//       }

//       // 普通函数节点
//       return new Function(...(obj?.params || []), obj?.value || '').bind(
//         funcBind
//       );
//     }

//     return Object.fromEntries(
//       Object.keys(obj).map((k) => [k, deepRecursionParse(obj[k], ext)])
//     );
//   };
//   // 解析渲染组件
//   return deepRecursionParse(schemaCompTree);
// };
