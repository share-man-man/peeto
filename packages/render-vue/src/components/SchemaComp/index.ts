import {
  // AnyType,
  getSchemaObjFromStr,
  generateNode,
  // generateArguments,
  // StateGetSetType,
  // RefGetSetType,
  // StateMap,
  ContextType,
  // NodeType,
  // FieldTypeEnum,
  // HookGetSetType,
} from '@peeto/core';
import { defineComponent, toRefs } from 'vue';
// import { SchemaCompProps } from '../../type';
import {
  vueRef,
  vueState,
  vueEffect,
  vueMemo,
  // defaultProps,
  defaultSchemaProps,
} from '../../utils';

// const createState = vueState;
// const createEffect = vueEffect;
// const createRef = vueRef;

const Index = defineComponent({
  ...defaultSchemaProps,
  setup(originProps) {
    const { schemaStr, ctx, ...props } = toRefs(originProps);

    // 触发重新渲染
    const [renderFlag] = vueState<[] | null>([]);
    // 避免react多次渲染
    const propsRef = vueRef(props);
    propsRef.current = props;
    // 上下文
    const ctxRef = vueRef<ContextType>(ctx.value || {});
    // // 状态集合
    // const stateMapRef = vueRef(new StateMap());
    // const getStateRef = vueRef<StateGetSetType['getState']>(({ stateName }) => {
    //   return stateMapRef.current.get(stateName);
    // });
    // const setStateRef = vueRef<StateGetSetType['setState']>(
    //   ({ fieldList = [] }) => {
    //     fieldList.forEach(({ name, value }) => {
    //       stateMapRef.current.set(name, value);
    //     });
    //     // state改变后，通知react重新渲染state
    //     setRenderFlag([]);
    //   }
    // );
    // // ref集合
    // const refMapRef = vueRef<Map<string, MutableRefObject<AnyType>>>(new Map());
    // const getRefRef = vueRef<RefGetSetType['getRef']>(({ refName }) => {
    //   return refMapRef.current.get(refName);
    // });
    // // hook集合
    // const hookMapRef = vueRef(new Map<string, AnyType>());
    // const getHookRef = vueRef<HookGetSetType['getHook']>(({ name }) => {
    //   return hookMapRef.current.get(name);
    // });

    // // schema对象
    // const schemaRootObj = getSchemaObjFromStr(schemaStr.value);

    // // 使用自带的状态管理
    // schemaRootObj.states?.forEach((s) => {
    //   const [stateValue, setStateValue] = createState(s.initialValue);
    //   stateMapRef.current.addState(s.name, stateValue.value, setStateValue);
    // });

    // // 使用自带的ref管理
    // schemaRootObj.refs?.forEach((r) => {
    //   const customRef = createRef(r.initialValue);
    //   refMapRef.current.set(r.name, customRef);
    // });

    // // 自定义hooks
    // schemaRootObj.customHooks?.forEach(({ field, effect }) => {
    //   const { body, dependences = [], effectStates = [] } = effect;
    //   const { argList, argNameList } = generateArguments({
    //     effectStates,
    //     setState: setStateRef.current,
    //     getState: getStateRef.current,
    //     dependences,
    //     ctx: ctxRef.current,
    //     modulesMap: props.modulesMap.value,
    //     getRef: getRefRef.current,
    //     getHook: getHookRef.current,
    //   });

    //   const res = new Function(...argNameList, `return ${body}`).call(
    //     {},
    //     ...argList
    //   );
    //   let nv: never;
    //   const t = field.type;
    //   switch (t) {
    //     case FieldTypeEnum.NAME:
    //       hookMapRef.current.set(field[t], res);
    //       break;
    //     case FieldTypeEnum.ARR:
    //       field[t].forEach((n, index) => {
    //         hookMapRef.current.set(n, res[index]);
    //       });
    //       break;
    //     case FieldTypeEnum.OBJ:
    //       field[t].forEach(({ alias, name: n }) => {
    //         hookMapRef.current.set(alias || n, res[n]);
    //       });
    //       break;
    //     default:
    //       nv = t;
    //       if (nv) {
    //         //
    //       }
    //       break;
    //   }
    // });

    // // 使用自带的依赖管理函数;
    // schemaRootObj.effects?.forEach(
    //   ({ effectStates, body, dependences = [] }) => {
    //     createEffect(
    //       () => {
    //         const { argList, argNameList } = generateArguments({
    //           effectStates,
    //           setState: setStateRef.current,
    //           getState: getStateRef.current,
    //           dependences,
    //           ctx: ctxRef.current,
    //           modulesMap: props.modulesMap,
    //           getRef: getRefRef.current,
    //           getHook: getHookRef.current,
    //         });
    //         new Function(...argNameList, body).call({}, ...argList);
    //       },
    //       () =>
    //         dependences
    //           .filter((d) => d.type === NodeType.STATE)
    //           .map((d) => stateMapRef.current.get(d.name))
    //     );
    //   }
    // );

    const dom = vueMemo(
      () => {
        if (renderFlag.value === null) {
          return null;
        }
        const obj = getSchemaObjFromStr(schemaStr.value);
        const res = generateNode({
          schemaRootObj: obj,
          getRef: () => {
            return null;
          },
          getState: () => {
            return null;
          },
          setState: () => {},
          getHook: () => {
            return null;
          },
          onCreateCompNode: props.onCreateCompNode.value,
          modulesMap: props.modulesMap.value,
          noMatchCompRender: props.noMatchCompRender.value,
          errorBoundaryRender: props.errorBoundaryRender.value,
          // getRef: getRefRef.current,
          // getState: getStateRef.current,
          // setState: setStateRef.current,
          // getHook: getHookRef.current,
          ctx: ctxRef.current,
          ...Object.fromEntries(
            Object.keys(propsRef.current).map((k) => [
              k,
              propsRef.current[k as keyof typeof propsRef.current].value,
            ])
          ),
        });
        return res;
      },
      () => [renderFlag.value, schemaStr.value]
    );

    vueEffect(
      () => {
        propsRef.current?.onNodeChange?.value?.(dom.value);
      },
      () => [dom.value]
    );

    return () => {
      return dom.value;
    };
  },
});

export default Index;
