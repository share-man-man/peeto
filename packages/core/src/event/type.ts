import { SchemaCompTreeItem } from '../component/type';
import { SchemaEffectItem } from '../effect/type';
import { NodeType } from '../root';
import { JSONValue } from '../type';

export interface SchemaEventItem {
  /**
   * 事件名
   */
  name: string;
}

export interface AnonymousFunctionNode {
  type: NodeType.ANONYMOUSFUNCTION;
  /**
   * 函数参数
   */
  params?: string[];
  /**
   * 立即执行
   * https://developer.mozilla.org/en-US/docs/Glossary/IIFE
   */
  IIFE?: boolean;
  /**
   * 影响的状态，使得在方法体内部可修改状态，以追踪哪那些函数修改了状态
   */
  effectStates?: SchemaEffectItem['effectStates'];
  /**
   * 用到的状态
   */
  dependences?: SchemaEffectItem['dependences'];
  /**
   * 函数类型：普通匿名函数、渲染函数
   */
  funcType?: 'func' | 'renderFunc';
  /**
   * 普通函数配置
   */
  func?: {
    /**
     * 函数方法体
     */
    body?: string;
  };
  /**
   * 渲染函数配置
   */
  renderFunc?: {
    /* *
     * 条件渲染：
     * default：直接渲染
     * listLoop list.map(item=><div>{item.name}</div>)
     * boolean：判断 flag && <div>111</div>
     */
    conditionType?: 'default' | 'listLoop' | 'boolean';
    /**
     * 渲染函数返回的组件树
     */
    compTree?: SchemaCompTreeItem | SchemaCompTreeItem[];
    listLoop?: {
      /**
       * 数组数据
       */
      data: JSONValue;
      // /**
      //  * 数组唯一标识
      //  */
      // keyName: string;
      /**
       * list.map的回掉函数参数，默认：item、index
       */
      mapParams: string[];
    };
    boolean?: {
      data: JSONValue;
    };
  };
}
