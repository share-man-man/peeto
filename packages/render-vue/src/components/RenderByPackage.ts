import {
  CompMapType,
  SchemaRootObj,
  parseRender,
  AnyType,
  parseState,
  PackageMapType,
} from '@peeto/parse';
import {
  defineComponent,
  shallowRef,
  computed,
  VNode,
  h,
  isVNode,
  PropType,
} from 'vue';
import { defaultProps, SlotPrefix } from '../utils';

const newProps = {
  ...defaultProps,
  props: {
    ...defaultProps.props,
    packageMap: {
      type: Object as PropType<PackageMapType>,
      default: () => new Map(),
      required: true,
    },
    compMap: {
      type: Object as PropType<CompMapType>,
      default: () => new Map(),
      required: true,
    },
  },
};

const RenderByPackage = defineComponent({
  ...newProps,
  setup({ packageMap, compMap, schemaStr }) {
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

    const dom = computed(() => {
      const schemaObj = JSON.parse(schemaStr) as SchemaRootObj;
      // 异步解析后加载dom
      return parseRender<VNode>({
        schemaCompTree: schemaObj?.compTree,
        compMap,
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
          changeList.forEach(({ name, value }) => {
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
