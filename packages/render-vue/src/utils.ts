import { h } from 'vue';
import type { PropType, SlotsType } from 'vue';
import { VueRenderProps, VueRenderSlots } from './type';

export const defaultProps = {
  props: {
    schemaStr: {
      type: String as PropType<VueRenderProps['schemaStr']>,
      default: '',
    },
    packageList: {
      type: Array as PropType<VueRenderProps['packageList']>,
      default: [],
    },
    onCreateNode: {
      type: Function as PropType<VueRenderProps['onCreateNode']>,
      default: h,
    },
    onNodeChange: {
      type: Function as PropType<VueRenderProps['onNodeChange']>,
    },
  },
  slots: Object as SlotsType<VueRenderSlots>,
};

/**
 * 默认的加载中
 * @returns
 */
export const defaultLoading = () => {
  return h('div', 'loading');
};

export const SlotPrefix = '_peeto_vue_slots';

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
