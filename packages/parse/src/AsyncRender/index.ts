import {
  getCompId,
  isBasicType,
  isExpression,
  isFunction,
  isSchemaCompTree,
} from '../utils';
import { AnyType, JSONValue, RenderProps } from './type';

export const render = async <VNodeType>({
  getState,
  setState,
  schemaCompTree,
  onCreateNode,
  asyncLoadComp,
}: RenderProps<VNodeType>) => {
  // 组件集合
  const compMap = new Map<string, AnyType>();
  // 需要异步加载的组件
  const asyncLoadList: { id: string; load: Promise<void> }[] = [];
  /**
   * 递归解析schema
   * @param obj
   * @param ext
   * @returns
   */
  const deepRecursionParse = (
    obj: JSONValue,
    ext: {
      /**
       * 作用域变量
       */
      scope?: Record<string, AnyType>;
    }
  ): VNodeType | JSONValue | AnyType => {
    // 基础节点，直接返回
    if (isBasicType(obj)) {
      return obj;
    }
    // 数组节点遍历渲染
    if (Array.isArray(obj)) {
      return obj.map((o) => deepRecursionParse(o, ext)) as VNodeType;
    }
    // 排除null、undefined类型
    if (!(obj instanceof Object)) {
      return obj;
    }
    // schema节点，从ComponentList里匹配组件
    if (isSchemaCompTree(obj)) {
      // 组件参数，参数可能深层嵌套schema节点
      const props = {
        // 每个组件都默认有一个key
        key: obj.id,
        ...Object.fromEntries(
          Object.keys(obj.props || {}).map((k) => [
            k,
            deepRecursionParse(obj.props?.[k], ext),
          ])
        ),
      };
      // 解析children，children可能是单一节点，可能是数组节点
      const children = !Array.isArray(obj.children)
        ? deepRecursionParse(obj.children || null, ext)
        : (obj.children || []).map((c) => deepRecursionParse(c, ext));

      return onCreateNode(compMap.get(getCompId(obj)), props, children);
    }
    // 表达式节点
    if (isExpression(obj)) {
      // 可能是状态表达式
      if (obj?.state) {
        return getState?.([obj.state])?.[0];
      }
      const func = new Function(`return ${obj?.value}`).bind(ext);
      return func();
    }
    // 函数节点
    if (isFunction(obj)) {
      const funcBind = {
        ...ext,
        onChangeState: (valueList: AnyType[]) => {
          setState?.(
            (obj.effects || []).map((name, index) => ({
              name,
              value: valueList[index],
            }))
          );
        },
      };
      // 普通函数节点
      if (!obj?.children) {
        return new Function(...(obj?.params || []), obj?.value || '').bind(
          funcBind
        );
      }
      // 返回schema组件的函数节点
      return new Function('...params', 'return this.render(params);').bind({
        render: (params: AnyType[]) => {
          if (!obj.children) {
            return;
          }
          funcBind.scope = {
            ...funcBind.scope,
            ...Object.fromEntries(
              obj.params.map((k, index) => [k, params[index]])
            ),
          };

          // 处理children是否为数组或单schema的情况
          if (Array.isArray(obj.children)) {
            return obj.children.map((o) => deepRecursionParse(o, funcBind));
          }
          return deepRecursionParse(obj.children, funcBind);
        },
      });
    }

    return Object.fromEntries(
      Object.keys(obj).map((k) => [k, deepRecursionParse(obj[k], ext)])
    );
  };

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
        asyncLoadList.push({
          id: compId,
          load: asyncLoadComp(obj).then((res) => {
            compMap.set(compId, res);
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
  // 解析渲染组件
  return deepRecursionParse(schemaCompTree, {});
};
