import { h, shallowRef, watch } from 'vue';
import type { PropType, ShallowRef, SlotsType } from 'vue';
import { SchemaCompProps, VueRenderProps, VueRenderSlots } from './type';
import { AnyType } from '@peeto/core';

export const vueState = <T>(initial?: T): [ShallowRef<T>, (nV: T) => void] => {
  const v = shallowRef<T>(initial as T);
  return [
    v,
    (nV) => {
      v.value = nV;
    },
  ];
};

export const vueRef = <T>(v: T) => {
  return {
    current: v,
  };
};

export const vueEffect = (func: () => void, dep: () => AnyType[]) => {
  return watch(dep, func, { immediate: true });
};

export const vueMemo = <T = AnyType>(func: () => T, dep: () => AnyType[]) => {
  const org = shallowRef(func());
  watch(
    dep,
    () => {
      const v = func();
      org.value = v;
    },
    {
      immediate: true,
    }
  );
  return org;
};

export const defaultProps = {
  props: {
    schemaStr: {
      type: String as PropType<VueRenderProps['schemaStr']>,
      default: '',
    },
    libList: {
      type: Array as PropType<VueRenderProps['libList']>,
      default: () => [],
    },
    ctx: {
      type: Object as PropType<VueRenderProps['ctx']>,
      default: () => ({}),
    },
    onCreateCompNode: {
      type: Function as PropType<VueRenderProps['onCreateCompNode']>,
    },
    onNodeChange: {
      type: Function as PropType<VueRenderProps['onNodeChange']>,
    },
  },
  slots: Object as SlotsType<VueRenderSlots>,
};

export const defaultSchemaProps = {
  props: {
    schemaStr: {
      type: String as PropType<SchemaCompProps['schemaStr']>,
      default: '',
    },
    modulesMap: {
      type: Map as PropType<SchemaCompProps['modulesMap']>,
      default: () => new Map(),
    },
    ctx: {
      type: Object as PropType<SchemaCompProps['ctx']>,
    },
    onCreateCompNode: {
      type: Function as PropType<SchemaCompProps['onCreateCompNode']>,
      require: true,
      default: () => () => {},
    },
    onNodeChange: {
      type: Function as PropType<SchemaCompProps['onNodeChange']>,
      require: true,
      default: () => () => {},
    },
    noMatchCompRender: {
      type: Function as PropType<SchemaCompProps['noMatchCompRender']>,
      require: true,
      default: () => () => {},
    },
    errorBoundaryRender: {
      type: Function as PropType<SchemaCompProps['errorBoundaryRender']>,
      require: true,
      default: () => () => {},
    },
  },
};

/**
 * 默认的加载中
 * @returns
 */
export const defaultLoading = () => {
  return h('div', 'loading');
};

// export const defaultNoMatchPackageRender: VueRenderSlots['noMatchComp'] = ({
//   id: componentId,
//   packageName,
// }) => {
//   return [
//     h(
//       'div',
//       {
//         key: `nomatch-package-${componentId}`,
//         style: {
//           color: 'red',
//           borderWidth: 2,
//           borderStyle: 'solid',
//           borderColor: 'red',
//           padding: 12,
//         },
//       },

//       `没有找到包:${packageName}`
//     ),
//   ];
// };

export const defaultNoMatchCompRender: Required<SchemaCompProps>['noMatchCompRender'] =
  ({ schema }) => {
    return h(
      'div',
      {
        key: `nomatch-package-component-${schema.id}`,
        style: {
          color: 'red',
          borderWidth: 2,
          borderStyle: 'solid',
          borderColor: 'red',
          padding: 12,
        },
      },
      `没有找到组件:${schema.componentName}`
    );
  };

export const defaultErrorBoundaryRender: Required<SchemaCompProps>['errorBoundaryRender'] =
  (curSchema, e) => {
    return h(
      'div',
      {
        key: `nomatch-package-component-${curSchema.id}`,
        style: {
          color: 'red',
          borderWidth: 2,
          borderStyle: 'solid',
          borderColor: 'red',
          padding: 12,
        },
      },
      `组件渲染出错:${e.message}`
    );
  };
