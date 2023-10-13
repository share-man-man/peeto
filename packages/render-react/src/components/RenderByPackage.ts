import {
  PackageMapType,
  CompMapType,
  AnyType,
  SchemaRootObj,
  parseState,
  ParseRender,
  PickRequired,
} from '@peeto/parse';
import {
  useState,
  Dispatch,
  SetStateAction,
  useRef,
  useMemo,
  ReactNode,
} from 'react';
import { ReactRenderProps } from '../type';

// 避免lint检测到条件判断里的useState
const createState = useState;

const RenderByPackage = ({
  packageMap,
  compMap,
  schemaStr,
  onCreateNode,
  loadingRender,
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
  const loadingRenderRef = useRef(loadingRender);
  loadingRenderRef.current = loadingRender;

  // 使用包自带的状态管理
  const schemaObjStates = (JSON.parse(schemaStr) as SchemaRootObj).states;
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

  const dom = useMemo(() => {
    const schemaObj = JSON.parse(schemaStr) as SchemaRootObj;
    // 异步解析后加载dom
    return ParseRender<ReactNode>({
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
