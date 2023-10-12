import {
  PackageMapType,
  CompMapType,
  AnyType,
  SchemaRootObj,
  parseState,
  ParseComponent,
  ParseRender,
} from '@peeto/parse';
import {
  useState,
  Dispatch,
  SetStateAction,
  useRef,
  useEffect,
  useMemo,
  ReactNode,
  createElement,
} from 'react';
import {
  ReactRenderProps,
  defaultLoading,
  defaultNoMatchCompRender,
  defaultNoMatchPackageRender,
} from '../utils';

// 避免lint检测到条件判断里的useState
const createState = useState;

const RenderByPackage = ({
  packageMap,
  schemaStr,
  packageList,
  noMatchCompRender,
  noMatchPackageRender,
  onCreateNode,
  loadingRender,
}: { packageMap: PackageMapType } & ReactRenderProps) => {
  // 初始化标识
  const [initFalg, setInitFalg] = useState(false);

  // 组件集合
  const [compMap, setCompMap] = useState<CompMapType | null>(null);
  // // 状态集合
  const [stateMap, setStateMap] = useState<
    Map<
      string,
      {
        stateValue: AnyType;
        setStateValue: Dispatch<SetStateAction<AnyType>>;
      }
    >
  >(new Map());
  // 自定义创建节点
  const onCreateNodeRef = useRef(onCreateNode);
  onCreateNodeRef.current = onCreateNode;
  const noMatchCompRenderRef = useRef(noMatchCompRender);
  noMatchCompRenderRef.current = noMatchCompRender;
  const noMatchPackageRenderRef = useRef(noMatchPackageRender);
  noMatchPackageRenderRef.current = noMatchPackageRender;
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

  // 初始化组件集合
  useEffect(() => {
    if (compMap === null) {
      const schemaObj = JSON.parse(schemaStr) as SchemaRootObj;
      ParseComponent({
        schemaCompTree: schemaObj?.compTree,
        packageList,
        noMatchCompRender:
          noMatchCompRenderRef.current || defaultNoMatchCompRender,
        noMatchPackageRender:
          noMatchPackageRenderRef.current || defaultNoMatchPackageRender,
      }).then((res) => {
        setCompMap(res);
      });
    }
  }, [compMap, packageList, schemaStr]);

  // 组件集合、状态加载完成后。初始化完成
  useEffect(() => {
    if (!schemaStr) {
      return;
    }
    if (compMap !== null) {
      setInitFalg(true);
    }
  }, [compMap, packageList, schemaStr]);

  const dom = useMemo(() => {
    if (!initFalg) {
      return createElement(loadingRenderRef.current || defaultLoading);
    }

    const schemaObj = JSON.parse(schemaStr) as SchemaRootObj;
    // 异步解析后加载dom
    return ParseRender<ReactNode>({
      schemaCompTree: schemaObj?.compTree,
      compMap: compMap as CompMapType,
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
      onCreateNode:
        onCreateNodeRef.current ||
        ((comp, props, children) => {
          return createElement(comp, props, children);
        }),
    });
  }, [compMap, initFalg, schemaStr, stateMap]);
  return dom;
};

export default RenderByPackage;
