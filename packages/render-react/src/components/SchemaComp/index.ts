import {
  AnyType,
  getSchemaObjFromStr,
  generateNode,
  generateArguments,
  StateGetSetType,
  RefGetSetType,
  StateMap,
  ContextType,
} from '@peeto/core';
import {
  useEffect,
  useState,
  useRef,
  useMemo,
  FC,
  useCallback,
  MutableRefObject,
} from 'react';
import { SchemaCompProps } from '../../type';
import { HookGetSetType } from 'packages/core/src/hook/type';

// 避免lint检测到条件判断里的useState、useEffect等
const createState = useState;
const createEffect = useEffect;
const createRef = useRef;

const Index: FC<SchemaCompProps> = ({ schemaStr, ctx = {}, ...props }) => {
  // 避免react多次渲染
  const propsRef = useRef(props);
  propsRef.current = props;
  const ctxRef = useRef<ContextType>(ctx);
  const [renderFlag, setRenderFlag] = useState<boolean | null>(true);

  // 状态集合
  const stateMapRef = useRef(new StateMap());
  // ref集合
  const refMapRef = useRef<Map<string, MutableRefObject<AnyType>>>(new Map());
  // hook集合
  const hookMapRef = useRef(new Map<string, AnyType>());

  const schemaRootObj = getSchemaObjFromStr(schemaStr);

  // 使用自带的状态管理
  const schemaObjStates = schemaRootObj.states;
  schemaObjStates?.forEach((s) => {
    const [stateValue, setStateValue] = createState(s.initialValue);
    stateMapRef.current.addState(s.name, stateValue, setStateValue);
  });

  // 使用自带的ref管理
  const schemaObjRefs = schemaRootObj.refs;
  schemaObjRefs?.forEach((r) => {
    const customRef = createRef(r.initialValue);
    refMapRef.current.set(r.name, customRef);
  });

  const getState = useCallback<StateGetSetType['getState']>(({ stateName }) => {
    return stateMapRef.current.get(stateName);
  }, []);
  const getStateRef = useRef(getState);
  getStateRef.current = getState;

  const setState = useCallback<StateGetSetType['setState']>(
    ({ fieldList = [] }) => {
      fieldList.forEach(({ name, value }) => {
        stateMapRef.current.set(name, value);
      });
      // state改变后，通知react重新渲染state
      setRenderFlag((prev) => !prev);
    },
    []
  );
  const setStateRef = useRef(setState);
  setStateRef.current = setState;

  const getRef = useCallback<RefGetSetType['getRef']>(({ refName }) => {
    return refMapRef.current.get(refName);
  }, []);
  const getRefRef = useRef(getRef);
  getRefRef.current = getRef;

  const getHook = useCallback<HookGetSetType['getHook']>(({ hookName }) => {
    return hookMapRef.current.get(hookName);
  }, []);
  const getHookRef = useRef(getHook);
  getHookRef.current = getHook;

  // 自定义hooks
  schemaRootObj.customHooks?.forEach(
    ({ name, arrDestructs, objDestructs, effect }) => {
      const { body, dependences = [], effectStates = [] } = effect;
      const { argList, argNameList } = generateArguments({
        effectStates,
        setState: setStateRef.current,
        getState: getStateRef.current,
        dependences,
        ctx: ctxRef.current,
        modulesMap: props.modulesMap,
        getRef: getRefRef.current,
        getHook: getHookRef.current,
      });

      const res = new Function(...argNameList, body).call({}, ...argList);
      if (name) {
        hookMapRef.current.set(name, res);
      } else if (arrDestructs) {
        arrDestructs.forEach((n, index) => {
          hookMapRef.current.set(n, res[index]);
        });
      } else if (objDestructs) {
        objDestructs.forEach(({ alias, name: n }) => {
          hookMapRef.current.set(alias || n, res[n]);
        });
      }
    }
  );

  // 使用自带的依赖管理函数
  schemaRootObj.effects?.forEach(({ effectStates, body, dependences = [] }) => {
    createEffect(
      () => {
        const { argList, argNameList } = generateArguments({
          effectStates,
          setState: setStateRef.current,
          getState: getStateRef.current,
          dependences,
          ctx: ctxRef.current,
          modulesMap: props.modulesMap,
          getRef: getRefRef.current,
          getHook: getHookRef.current,
        });

        new Function(...argNameList, body).call({}, ...argList);
      },
      dependences
        .filter((d) => d.type === 'state')
        .map((d) => stateMapRef.current.get(d.stateName)?.stateValue)
    );
  });

  const dom = useMemo(() => {
    if (renderFlag === null) {
      return null;
    }
    const obj = getSchemaObjFromStr(schemaStr);
    const res = generateNode({
      schemaRootObj: obj,
      getRef: getRefRef.current,
      getState: getStateRef.current,
      setState: setStateRef.current,
      getHook: getHookRef.current,
      ctx: ctxRef.current,
      ...propsRef.current,
    });

    return res;
  }, [renderFlag, schemaStr]);

  useEffect(() => {
    propsRef.current?.onNodeChange?.(dom);
  }, [dom]);

  return dom;
};

export default Index;
