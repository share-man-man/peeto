import {
  AnyType,
  getSchemaObjFromStr,
  generateNode,
  generateArguments,
  StateGetSetType,
  RefGetSetType,
  StateMap,
  ContextType,
  NodeType,
  FieldTypeEnum,
  HookGetSetType,
} from '@peeto/core';
import {
  useEffect,
  useState,
  useRef,
  useMemo,
  FC,
  MutableRefObject,
} from 'react';
import { SchemaCompProps } from '../../type';

// 避免lint检测到条件判断里的useState、useEffect等
const createState = useState;
const createEffect = useEffect;
const createRef = useRef;

const Index: FC<SchemaCompProps> = ({ schemaStr, ctx = {}, ...props }) => {
  // 触发重新渲染
  const [renderFlag, setRenderFlag] = useState<[] | null>([]);
  // 避免react多次渲染
  const propsRef = useRef(props);
  propsRef.current = props;
  // 上下文
  const ctxRef = useRef<ContextType>(ctx);
  // 状态集合
  const stateMapRef = useRef(new StateMap());
  const getStateRef = useRef<StateGetSetType['getState']>(({ stateName }) => {
    return stateMapRef.current.get(stateName);
  });
  const setStateRef = useRef<StateGetSetType['setState']>(
    ({ fieldList = [] }) => {
      fieldList.forEach(({ name, value }) => {
        stateMapRef.current.set(name, value);
      });
      // state改变后，通知react重新渲染state
      setRenderFlag([]);
    }
  );
  // ref集合
  const refMapRef = useRef<Map<string, MutableRefObject<AnyType>>>(new Map());
  const getRefRef = useRef<RefGetSetType['getRef']>(({ refName }) => {
    return refMapRef.current.get(refName);
  });
  // hook集合
  const hookMapRef = useRef(new Map<string, AnyType>());
  const getHookRef = useRef<HookGetSetType['getHook']>(({ name }) => {
    return hookMapRef.current.get(name);
  });

  // schema对象
  const schemaRootObj = getSchemaObjFromStr(schemaStr);

  // 使用自带的状态管理
  schemaRootObj.states?.forEach((s) => {
    const [stateValue, setStateValue] = createState(s.initialValue);
    stateMapRef.current.addState(s.name, stateValue, setStateValue);
  });

  // 使用自带的ref管理
  schemaRootObj.refs?.forEach((r) => {
    const customRef = createRef(r.initialValue);
    refMapRef.current.set(r.name, customRef);
  });

  // 自定义hooks
  schemaRootObj.customHooks?.forEach(({ field, effect }) => {
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

    const res = new Function(...argNameList, `return ${body}`).call(
      {},
      ...argList
    );
    let nv: never;
    const t = field.type;
    switch (t) {
      case FieldTypeEnum.NAME:
        hookMapRef.current.set(field[t], res);
        break;
      case FieldTypeEnum.ARR:
        field[t].forEach((n, index) => {
          hookMapRef.current.set(n, res[index]);
        });
        break;
      case FieldTypeEnum.OBJ:
        field[t].forEach(({ alias, name: n }) => {
          hookMapRef.current.set(alias || n, res[n]);
        });
        break;
      default:
        nv = t;
        if (nv) {
          //
        }
        break;
    }
  });

  // 使用自带的依赖管理函数;
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
        .filter((d) => d.type === NodeType.STATE)
        .map((d) => stateMapRef.current.get(d.name))
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
