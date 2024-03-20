import {
  CompMapType,
  SchemaRootObj,
  parseRender,
  AnyType,
  parseState,
  PackageMapType,
  PickRequired,
} from '@peeto/parse';
import {
  defineComponent,
  shallowRef,
  computed,
  VNode,
  h,
  PropType,
  watch,
} from 'vue';
import { defaultProps, SlotPrefix } from '../utils';
import { VueRenderProps } from '../type';

const newProps = {
  ...defaultProps,
  props: {
    ...defaultProps.props,
    onCreateNode: {
      type: Function as PropType<
        PickRequired<VueRenderProps, 'onCreateNode'>['onCreateNode']
      >,
      default: h,
    },
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
  setup({
    packageMap,
    compMap,
    schemaStr,
    onCreateNode: onCreateNodeRef,
    onNodeChange,
  }) {
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

    const schemaRootObj = JSON.parse(schemaStr) as SchemaRootObj;

    // 使用包自带的状态管理
    const schemaObjStates = schemaRootObj.states;
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

    // 使用自带的依赖管理函数
    schemaRootObj.effects?.forEach((e) => {
      watch(
        e.dependences.map((d) => stateMap.value.get(d)?.stateValue),
        () => {
          e.effectStates.forEach(({ name: effectName, value: funcBody }) => {
            if (funcBody) {
              stateMap.value.get(effectName)?.setStateValue(
                new Function(funcBody).call(
                  // 将dependences的state绑定到this里去
                  Object.fromEntries(
                    e.dependences.map((depName) => [
                      depName,
                      stateMap.value.get(depName)?.stateValue.value,
                    ])
                  )
                )
              );
            }
          });
        },
        {
          immediate: true,
        }
      );
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
          return onCreateNodeRef(comp, props, {
            // 支持vue的具名插槽，默认children为default插槽
            // 插槽组件必须函数类型，否则后台会出现告警
            default: () => children,
            ...Object.fromEntries(
              Object.keys(compSlots).map((k) => {
                const slotRender = compSlots?.[k];
                return [
                  k,
                  typeof slotRender === 'function'
                    ? slotRender
                    : () => slotRender,
                ];
              })
            ),
          });
        },
      });
    });

    watch(
      () => [dom.value],
      () => {
        onNodeChange?.(dom.value);
      },
      {
        immediate: true,
      }
    );

    return () => dom.value;
  },
});

export default RenderByPackage;
