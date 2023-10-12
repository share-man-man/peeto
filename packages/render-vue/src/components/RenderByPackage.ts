import {
  CompMapType,
  SchemaRootObj,
  ParseComponent,
  ParseRender,
  AnyType,
  parseState,
  PackageMapType,
} from '@peeto/parse';
import {
  defineComponent,
  ref,
  shallowRef,
  watchEffect,
  computed,
  VNode,
  h,
  isVNode,
  PropType,
} from 'vue';
import {
  defaultProps,
  defaultNoMatchCompRender,
  defaultNoMatchPackageRender,
  SlotPrefix,
  defaultLoading,
} from '../utils';

const newProps = {
  ...defaultProps,
  props: {
    ...defaultProps.props,
    packageMap: {
      type: Object as PropType<PackageMapType>,
      default: () => new Map(),
      required: true,
    },
  },
};

const RenderByPackage = defineComponent({
  ...newProps,
  setup({ packageMap, schemaStr, packageList }, { slots }) {
    // 初始化标识
    const initFalg = ref(false);

    // 组件集合
    const compMap = shallowRef<CompMapType | null>(null);
    // 状态集合
    const stateMap = shallowRef<
      Map<
        string,
        {
          stateValue: AnyType;
          setStateValue: AnyType;
        }
      >
    >(new Map());

    // 使用包自带的状态管理
    const schemaObjStates = (JSON.parse(schemaStr) as SchemaRootObj).states;
    schemaObjStates?.forEach((s) => {
      const stateValue = shallowRef<AnyType>(
        parseState({
          initialValue: s.initialValue,
          packageMap,
        })
      );
      const setStateValue = (v: AnyType) => {
        stateValue.value = v;
      };
      stateMap.value.set(s.name, {
        stateValue,
        setStateValue,
      });
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
        return h(slots.loading || defaultLoading);
      }
      const schemaObj = JSON.parse(schemaStr) as SchemaRootObj;
      // 异步解析后加载dom
      return ParseRender<VNode>({
        schemaCompTree: schemaObj?.compTree,
        compMap: compMap.value as CompMapType,
        getState: (stateNameList) => {
          return stateNameList.map(
            (name) => stateMap.value.get(name)?.stateValue.value
          );
        },
        setState(li) {
          // 只有在states里声明的状态才会纳入管理
          const changeList = li.filter((l) =>
            Array(stateMap.value.keys()).some((s) => l.name === s.next().value)
          );

          // 避免多次调用setState，导致之前set的状态被覆盖
          changeList.forEach(({ name, value }) => {
            // stateMapRef?.set(name, value);
            stateMap.value.get(name)?.setStateValue(value);
          });
          stateMap.value = new Map(stateMap.value);
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

export default RenderByPackage;
