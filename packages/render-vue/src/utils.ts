import type { AnyType, SchemaCompTree } from '@peeto/parse';

import { h } from 'vue';
import type { PropType, Slot, SlotsType } from 'vue';

export interface VueRenderProps {
  /**
   * schema字符串
   * @description 之所以是字符串，是因为useEffect相比监听对象，字符串可减少函数调用次数
   */
  schemaStr: string;
  /**
   * 包列表
   * @description
   */
  packageList: { name: string; load: () => Promise<AnyType> }[];
}

export interface VueRenderSlots {
  noMatchComp: Slot<SchemaCompTree>;
  noMatchPackage: Slot<SchemaCompTree>;
}

export const defaultProps = {
  props: {
    schemaStr: {
      type: String as PropType<VueRenderProps['schemaStr']>,
      default: '',
    },
    packageList: {
      type: Array as PropType<VueRenderProps['packageList']>,
      default: () => [],
    },
  },
  slots: Object as SlotsType<{
    noMatchComp: SchemaCompTree;
    noMatchPackage: SchemaCompTree;
    loading: undefined;
  }>,
};

/**
 * 默认的加载中
 * @returns
 */
export const defaultLoading = () => {
  return h('div', 'loading');
};

export const SlotPrefix = '_vue_slots';

export const defaultNoMatchPackageRender: VueRenderSlots['noMatchComp'] = ({
  id: componentId,
  packageName,
}) => {
  return [
    h(
      'div',
      {
        key: `nomatch-package-${componentId}`,
        style: {
          color: 'red',
          borderWidth: 2,
          borderStyle: 'solid',
          borderColor: 'red',
          padding: 12,
        },
      },

      `没有找到包:${packageName}`
    ),
  ];
};

export const defaultNoMatchCompRender: VueRenderSlots['noMatchPackage'] = ({
  id: componentId,
  componentName,
  packageName,
}) => {
  return [
    h(
      'div',
      {
        key: `nomatch-package-component-${componentId}`,
        style: {
          color: 'red',
          borderWidth: 2,
          borderStyle: 'solid',
          borderColor: 'red',
          padding: 12,
        },
      },

      `包:${packageName}里没有找到组件:${componentName}`
    ),
  ];
};
