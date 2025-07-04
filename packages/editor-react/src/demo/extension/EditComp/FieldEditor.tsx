import { SwapOutlined } from '@ant-design/icons';
import { AnyType, parseObj } from '@peeto/core';
import { Input, InputNumber, Switch, Dropdown } from 'antd';
import { ReactNode, useState } from 'react';

const isString = (v: AnyType): v is string => {
  return ['[object String]'].includes(Object.prototype.toString.call(v));
};
const isBoolean = (v: AnyType): v is boolean => {
  return ['[object Boolean]'].includes(Object.prototype.toString.call(v));
};
const isNumber = (v: AnyType): v is number => {
  return ['[object Number]'].includes(Object.prototype.toString.call(v));
};
const isNull = (v: AnyType): v is null => {
  return ['[object Null]'].includes(Object.prototype.toString.call(v));
};
const isUndefined = (v: AnyType): v is undefined => {
  return ['[object Undefined]'].includes(Object.prototype.toString.call(v));
};

export type DefaultAllowedFieldType = 'state' | 'ref' | 'hook';

export type AllowedFieldType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'null'
  | 'undefined'
  // 数组，涉及到深度递归渲染
  | 'array'
  // 对象，涉及到深度递归渲染
  | 'object'
  // 组件，配置表单不再深度解析，用户通过拖拽组件进行配置
  | 'comp'
  // 普通函数
  | 'func-default'
  // 默认渲染函数
  | 'func-render-default'
  // 列表渲染函数
  | 'func-render-list-loop'
  // 条件渲染
  | 'func-render-boolean';

const fieldTypeConfig: Record<
  DefaultAllowedFieldType | AllowedFieldType,
  { label: string }
> = {
  string: { label: '文本' },
  number: { label: '数字' },
  boolean: { label: '布尔值' },
  null: { label: 'NULL' },
  undefined: { label: '未定义' },
  object: { label: '对象' },
  array: { label: '数组' },
  comp: { label: '组件' },
  state: { label: '状态' },
  ref: { label: 'ref引用' },
  hook: { label: '自定义hook' },
  'func-default': { label: '函数' },
  'func-render-default': { label: '渲染函数' },
  'func-render-list-loop': { label: '列表渲染' },
  'func-render-boolean': { label: '条件渲染' },
};

interface FieldEditorProps {
  value?: AnyType;
  onChange?: (v: AnyType) => void;
  /**
   * 字段允许的类型
   * state、ref、hook、func(IIFE)，默认支持。原因：他们包括了AllowedFieldType的所有类型
   */
  allowedFieldType: AllowedFieldType[];
  /**
   * 自定义字段类型设置器
   */
  customTypeRender?: Partial<
    Record<AllowedFieldType, (p: FieldEditorProps) => ReactNode>
  >;
}

const createEditorNode = ({
  props,
  fieldType,
}: {
  props: FieldEditorProps;
  fieldType?: DefaultAllowedFieldType | AllowedFieldType;
}) => {
  const strategy: Record<
    DefaultAllowedFieldType | AllowedFieldType,
    (p: FieldEditorProps) => ReactNode
  > = {
    string: ({ value, onChange }) => (
      <Input value={value} onChange={(e) => onChange?.(e.target.value)} />
    ),
    number: ({ value, onChange }) => (
      <InputNumber value={value} onChange={onChange} />
    ),
    boolean: ({ value, onChange }) => (
      <Switch checked={value} onChange={onChange} />
    ),
    null: () => <div>null</div>,
    undefined: () => <div>undefined</div>,
    object: () => <div>object</div>,
    array: () => <div>array</div>,
    comp: () => <div>comp</div>,
    hook: () => <div>hook</div>,
    state: () => <div>state</div>,
    ref: () => <div>ref</div>,
    'func-default': () => <div>func-default</div>,
    'func-render-default': () => <div>func-render-default</div>,
    'func-render-list-loop': () => <div>func-render-list-loop</div>,
    'func-render-boolean': () => <div>func-render-boolean</div>,
    ...props.customTypeRender,
  };

  const { value } = props;

  // 有参数时，根据参数类型，自动加载字段类型编辑器
  if (!isUndefined(value)) {
    return parseObj<ReactNode>(
      {
        // TODO vue需要配置为:['props', 'slots']
        parseSchemaCompFields: ['props'],
        node: value,
        // TODO
        nodePath: [],
        ctx: {},
        parseStateNode: () => {
          return strategy.state(props);
        },
        parseRefNode: () => {
          return strategy.ref(props);
        },
        parseHookNode: () => {
          return strategy.hook(props);
        },
        parseAnonymousFunctionNode: () => {
          // TODO 判断函数类型，渲染函数需要进行递归渲染
          return strategy['func-default'](props);
        },
        parseSchemaComp: () => {
          // TODO 点击定位，高亮组件。确定后改为配置该子组件
          return strategy.comp(props);
        },
        parseArrayNode: () => {
          // TODO 递归渲染
          return strategy.array(props);
        },
        parseObjectNode: () => {
          // TODO 递归渲染
          return strategy.object(props);
        },
        parseBasicNode: () => {
          if (isString(value)) {
            return strategy.string(props);
          } else if (isBoolean(value)) {
            return strategy.boolean(props);
          } else if (isNumber(value)) {
            return strategy.number(props);
          } else if (isNull(value)) {
            return strategy.null(props);
          }
          return <div>不支持的参数类型</div>;
        },
      },
      {}
    );
  }

  // 没有参数时
  // 没有指定参数类型
  if (!fieldType) {
    // 默认用第一个允许的类型，或者state
    const k = props.allowedFieldType[0];
    if (k) {
      return strategy[k](props);
    }
    return strategy.state(props);
  }

  return strategy[fieldType](props);
};

/**
 * 字段编辑器，支持切换字段类型
 * @param props
 * @returns
 */
export const Index = (props: FieldEditorProps) => {
  const [curType, setCurType] = useState<
    DefaultAllowedFieldType | AllowedFieldType
  >();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 8,
      }}
    >
      <div style={{ flex: '1 0 0' }}>
        {createEditorNode({ props, fieldType: curType })}
      </div>
      <Dropdown
        trigger={['click']}
        menu={{
          selectable: true,
          selectedKeys: curType ? [curType] : [],
          onSelect: ({ key }) => {
            setCurType(key as typeof curType);
            // value置空
            props.onChange?.(undefined);
          },
          items: Object.keys(fieldTypeConfig)
            .map((k) => ({
              label: fieldTypeConfig[k as keyof typeof fieldTypeConfig].label,
              key: k as keyof typeof fieldTypeConfig,
            }))
            .filter(({ key }) =>
              [
                ...props.allowedFieldType,
                ...(['hook', 'state', 'ref'] as DefaultAllowedFieldType[]),
              ].includes(key)
            ),
        }}
      >
        <SwapOutlined />
      </Dropdown>
    </div>
  );
};

export default Index;
