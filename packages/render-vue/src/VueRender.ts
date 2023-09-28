import { ParseRender, ParseComponent } from '@peeto/parse';
import type {
  AnyType,
  CompMapType,
  SchemaCompTree,
  SchemaRootObj,
} from '@peeto/parse';

import {
  h,
  ref,
  defineComponent,
  isVNode,
  computed,
  watchEffect,
  shallowRef,
} from 'vue';
import type { PropType, SlotsType, VNode } from 'vue';
import {
  SlotPrefix,
  VueRenderProps,
  defaultNoMatchCompRender,
  defaultNoMatchPackageRender,
} from './utils';

export type StateMapType = Map<string, AnyType>;

export default defineComponent({
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
  }>,
  setup({ schemaStr, packageList }, { slots }) {
    // 初始化标识
    const initFalg = ref(false);
    // 组件集合
    const compMap = shallowRef<CompMapType | null>(null);
    // 状态集合
    const stateMap = shallowRef<null | StateMapType>(null);
    let stateMapRef: typeof stateMap.value | null = null;

    // 初始化状态集合
    watchEffect(() => {
      if (stateMap.value === null) {
        const schemaObj = JSON.parse(schemaStr) as SchemaRootObj;
        stateMapRef = new Map(
          (schemaObj.states || []).map((s) => [s.name, s.initialValue])
        );
        stateMap.value = new Map(stateMapRef);
      }
    });

    // 初始化组件集合
    watchEffect(() => {
      if (compMap.value === null) {
        const schemaObj = JSON.parse(schemaStr) as SchemaRootObj;
        ParseComponent({
          schemaCompTree: schemaObj?.compTree,
          packageList,
          noMatchCompRender: slots.noMatchComp || defaultNoMatchCompRender,
          noMatchPackageRender:
            slots.noMatchPackage || defaultNoMatchPackageRender,
        }).then((res) => {
          compMap.value = res;
        });
      }
    });

    // 组件集合、状态加载完成后。初始化完成
    watchEffect(() => {
      if (!schemaStr || !packageList) {
        return;
      }
      // 组件集合、状态加载完成后。初始化完成
      if (compMap.value !== null && stateMap.value !== null) {
        initFalg.value = true;
      }
    });

    const dom = computed(() => {
      if (!initFalg.value) {
        return;
      }
      const schemaObj = JSON.parse(schemaStr) as SchemaRootObj;
      // 异步解析后加载dom
      return ParseRender<VNode>({
        schemaCompTree: schemaObj?.compTree,
        compMap: compMap.value as CompMapType,
        getState: (stateNameList) => {
          return stateNameList.map((name) =>
            (stateMap.value as StateMapType).get(name)
          );
        },
        setState(li) {
          // 只有在states里声明的状态才会纳入管理
          const changeList = li.filter((l) =>
            Array((stateMap.value as StateMapType).keys()).some(
              (s) => l.name === s.next().value
            )
          );

          // 避免多次调用setState，导致之前set的状态被覆盖
          changeList.forEach(({ name, value }) => {
            stateMapRef?.set(name, value);
          });
          stateMap.value = new Map(stateMapRef);
        },
        onCreateNode(comp, originProps = {}, children) {
          const { [SlotPrefix]: compSlots = {}, ...props } = originProps || {};
          return h(comp, props, {
            // 支持vue的具名插槽，默认children为default插槽
            default: isVNode(children) ? children : () => children,
            ...Object.fromEntries(
              Object.keys(compSlots).map((k) => [k, compSlots?.[k]])
            ),
          });
        },
      });
    });

    return () => dom.value;
  },
});
