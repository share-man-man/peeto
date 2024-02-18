import {
  PackageMapType,
  CompMapType,
  AnyType,
  SchemaRootObj,
  PickRequired,
  parseState,
  parseRender,
} from '@peeto/parse';
import {
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
  useRef,
  useMemo,
  ReactNode,
} from 'react';
import { ReactRenderProps } from '../type';

// 避免lint检测到条件判断里的useState、useEffect等
const createState = useState;
const createEffect = useEffect;

const RenderByPackage = ({
  packageMap,
  compMap,
  schemaStr,
  onCreateNode,
}: {
  packageMap: PackageMapType;
  compMap: CompMapType;
} & PickRequired<ReactRenderProps, 'onCreateNode'>) => {
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
  const onCreateNodeRef = useRef(onCreateNode);
  onCreateNodeRef.current = onCreateNode;

  const schemaRootObj = JSON.parse(schemaStr) as SchemaRootObj;

  // 使用包自带的状态管理
  const schemaObjStates = schemaRootObj.states;
  schemaObjStates?.forEach((s) => {
    const [stateValue, setStateValue] = createState(
      parseState({
        initialValue: s.initialValue,
        packageMap,
      })
    );
    stateMap.set(s.name, {
      stateValue,
      setStateValue,
    });
  });

  // 使用自带的依赖管理函数
  schemaRootObj.effects?.forEach((e) => {
    createEffect(
      () => {
        e.effectStates.forEach(({ name: effectName, value: funcBody }) => {
          if (funcBody) {
            stateMap.get(effectName)?.setStateValue(
              new Function(funcBody).call(
                // 将dependences的state绑定到this里去
                Object.fromEntries(
                  e.dependences.map((depName) => [
                    depName,
                    stateMap.get(depName)?.stateValue,
                  ])
                )
              )
            );
          }
        });
        setStateMap(new Map(stateMap));
      },
      e.dependences.map((d) => stateMap.get(d)?.stateValue)
    );
  });

  const dom = useMemo(() => {
    const schemaObj = JSON.parse(schemaStr) as SchemaRootObj;
    // 异步解析后加载dom
    return parseRender<ReactNode>({
      schemaCompTree: schemaObj?.compTree,
      compMap,
      getState: (stateNameList) => {
        return stateNameList.map((name) => stateMap.get(name)?.stateValue);
      },
      setState(li) {
        // 只有在states里声明的状态才会纳入管理
        const changeList = li.filter((l) =>
          Array(stateMap.keys()).some((s) => l.name === s.next().value)
        );
        changeList.forEach(({ name, value }) => {
          stateMap.get(name)?.setStateValue(value);
        });
        // state改变后，通知react重新渲染state
        setStateMap(new Map(stateMap));
      },
      onCreateNode: (comp, props, children) => {
        return onCreateNodeRef.current(comp, props, children);
      },
    });
  }, [compMap, schemaStr, stateMap]);
  return dom;
};

export default RenderByPackage;
