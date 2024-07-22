import {
  AnyType,
  getSchemaObjFromStr,
  generateNode,
  PickRequired,
  LibListMapType,
  GenerateNodePropType,
  generateFields,
} from '@peeto/core';
import {
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
  useRef,
  useMemo,
  FC,
  useCallback,
} from 'react';
import { ReactRenderProps } from '../../type';

// 避免lint检测到条件判断里的useState、useEffect等
const createState = useState;
const createEffect = useEffect;

export type SchemaCompProps = {
  libListMap: LibListMapType;
} & PickRequired<
  ReactRenderProps,
  'onCreateCompNode' | 'noMatchCompRender' | 'noMatchLibRender'
>;

const Index: FC<SchemaCompProps> = ({
  schemaStr,
  onCreateCompNode,
  onNodeChange,
  libListMap,
  noMatchCompRender,
  noMatchLibRender,
}) => {
  const [renderTimes, setRenderTimes] = useState(1);

  // 避免react多次渲染
  const libListMapRef = useRef(libListMap);
  libListMapRef.current = libListMap;
  const onCreateCompNodeRef = useRef(onCreateCompNode);
  onCreateCompNodeRef.current = onCreateCompNode;
  const noMatchCompRenderRef = useRef(noMatchCompRender);
  noMatchCompRenderRef.current = noMatchCompRender;
  const noMatchLibRenderRef = useRef(noMatchLibRender);
  noMatchLibRenderRef.current = noMatchLibRender;

  // 状态集合
  const stateMapRef = useRef<
    Map<
      string,
      {
        stateValue: AnyType;
        setStateValue: Dispatch<SetStateAction<AnyType>>;
      }
    >
  >(new Map());

  const schemaRootObj = getSchemaObjFromStr(schemaStr);

  // 使用自带的状态管理
  const schemaObjStates = schemaRootObj.states;
  schemaObjStates?.forEach((s) => {
    const [stateValue, setStateValue] = createState(s.initialValue);
    stateMapRef.current.set(s.name, {
      stateValue,
      setStateValue,
    });
  });

  const getState = useCallback<
    GenerateNodePropType<ReturnType<typeof onCreateCompNode>>['getState']
  >(({ stateName }) => {
    return stateMapRef.current.get(stateName)?.stateValue;
  }, []);
  const getStateRef = useRef(getState);
  getStateRef.current = getState;

  const setState = useCallback<
    GenerateNodePropType<ReturnType<typeof onCreateCompNode>>['setState']
  >(
    ({ fieldList = [] }) => {
      fieldList.forEach(({ name, value }) => {
        stateMapRef.current.get(name)?.setStateValue(value);
      });
      // state改变后，通知react重新渲染state
      setRenderTimes(renderTimes + 1);
    },
    [renderTimes]
  );
  const setStateRef = useRef(setState);
  setStateRef.current = setState;

  // 使用自带的依赖管理函数
  schemaRootObj.effects?.forEach(({ effectStates, body, dependences }) => {
    createEffect(
      () => {
        const { argList, argNameList } = generateFields({
          effectStates,
          setState: setStateRef.current,
          getState: getStateRef.current,
          dependences,
        });

        new Function(...argNameList, body).call({}, ...argList);
      },
      dependences.map((d) => stateMapRef.current.get(d)?.stateValue)
    );
  });

  const dom = useMemo(() => {
    if (!renderTimes) {
      return null;
    }
    const obj = getSchemaObjFromStr(schemaStr);
    const res = generateNode({
      schemaRootObj: obj,
      getState: getStateRef.current,
      setState: setStateRef.current,
      onCreateCompNode: onCreateCompNodeRef.current,
      libListMap: libListMapRef.current,
      noMatchCompRender: noMatchCompRenderRef.current,
      noMatchLibRender: noMatchLibRenderRef.current,
    });

    return res;
  }, [renderTimes, schemaStr]);

  const onNodeChangeRef = useRef(onNodeChange);
  onNodeChangeRef.current = onNodeChange;

  useEffect(() => {
    onNodeChangeRef.current?.(dom);
  }, [dom]);

  return dom;
};

export default Index;
