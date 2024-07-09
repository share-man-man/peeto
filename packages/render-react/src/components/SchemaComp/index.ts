import {
  AnyType,
  getSchemaObjFromStr,
  generateNode,
  PickRequired,
  LibListMapType,
} from '@peeto/core';
import {
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
  useRef,
  useMemo,
  FC,
} from 'react';
import { ReactRenderProps } from '../../type';

// 避免lint检测到条件判断里的useState、useEffect等
const createState = useState;
// const createEffect = useEffect;

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
  // 状态集合
  const [stateMap, setStateMap] = useState<
    Map<
      string,
      {
        stateValue: AnyType;
        setStateValue: Dispatch<SetStateAction<AnyType>>;
      }
    >
  >(new Map());

  // 避免react多次渲染
  const onCreateCompNodeRef = useRef(onCreateCompNode);
  onCreateCompNodeRef.current = onCreateCompNode;
  const noMatchCompRenderRef = useRef(noMatchCompRender);
  const noMatchLibRenderRef = useRef(noMatchLibRender);

  const schemaRootObj = getSchemaObjFromStr(schemaStr);

  // 使用包自带的状态管理
  const schemaObjStates = schemaRootObj.states;
  schemaObjStates?.forEach((s) => {
    const [stateValue, setStateValue] = createState(
      // parseState({
      //   initialValue: s.initialValue,
      //   packageMap,
      // })
      s.initialValue
    );
    stateMap.set(s.name, {
      stateValue,
      setStateValue,
    });
  });

  // // 使用自带的依赖管理函数
  // schemaRootObj.effects?.forEach((e) => {
  //   createEffect(
  //     () => {
  //       e.effectStates.forEach(({ name: effectName, value: funcBody }) => {
  //         if (funcBody) {
  //           stateMap.get(effectName)?.setStateValue(
  //             new Function(funcBody).call(
  //               // 将dependences的state绑定到this里去
  //               Object.fromEntries(
  //                 e.dependences.map((depName) => [
  //                   depName,
  //                   stateMap.get(depName)?.stateValue,
  //                 ])
  //               )
  //             )
  //           );
  //         }
  //       });
  //       setStateMap(new Map(stateMap));
  //     },
  //     e.dependences.map((d) => stateMap.get(d)?.stateValue)
  //   );
  // });

  const dom = useMemo(() => {
    const obj = getSchemaObjFromStr(schemaStr);
    const res = generateNode({
      schemaRootObj: obj,
      getState: ({ stateName }) => {
        return stateName.map((name) => stateMap.get(name)?.stateValue);
      },
      setState({ fieldList = [] }) {
        // 只有在states里声明的状态才会纳入管理
        const changeList = fieldList.filter((l) =>
          Array(stateMap.keys()).some((s) => l.name === s.next().value)
        );
        changeList.forEach(({ name, value }) => {
          stateMap.get(name)?.setStateValue(value);
        });
        // state改变后，通知react重新渲染state
        setStateMap(new Map(stateMap));
      },
      onCreateCompNode: onCreateCompNodeRef.current,
      libListMap,
      noMatchCompRender: noMatchCompRenderRef.current,
      noMatchLibRender: noMatchLibRenderRef.current,
    });

    // console.log(res);

    return res;
  }, [libListMap, schemaStr, stateMap]);

  const onNodeChangeRef = useRef(onNodeChange);
  onNodeChangeRef.current = onNodeChange;

  useEffect(() => {
    onNodeChangeRef.current?.(dom);
  }, [dom]);

  return dom;
};

export default Index;
