import {
  ReactNode,
  createElement,
  useState,
  useEffect,
  useRef,
  useMemo,
  Fragment,
} from 'react';

import {
  AnyType,
  ParseRender,
  CompMapType,
  SchemaRootObj,
  ParseComponent,
} from '@peeto/parse';
import {
  ReactRenderProps,
  defaultNoMatchCompRender,
  defaultNoMatchPackageRender,
} from './utils';

export type StateMapType = Map<string, AnyType>;

const ReactRender = ({
  schemaStr,
  packageList,
  noMatchCompRender,
  noMatchPackageRender,
  onCreateNode,
}: ReactRenderProps) => {
  // 初始化标识
  const [initFalg, setInitFalg] = useState(false);
  // 组件集合
  const [compMap, setCompMap] = useState<CompMapType | null>(null);
  // 状态集合
  const [stateMap, setStateMap] = useState<null | StateMapType>(null);
  // 自定义创建节点
  const onCreateNodeRef = useRef(onCreateNode);
  onCreateNodeRef.current = onCreateNode;
  const stateMapRef = useRef<typeof stateMap>();
  const noMatchCompRenderRef = useRef(noMatchCompRender);
  noMatchCompRenderRef.current = noMatchCompRender;
  const noMatchPackageRenderRef = useRef(noMatchPackageRender);
  noMatchPackageRenderRef.current = noMatchPackageRender;
  // 初始化状态集合
  useEffect(() => {
    if (stateMap === null) {
      const schemaObj = JSON.parse(schemaStr) as SchemaRootObj;
      stateMapRef.current = new Map(
        (schemaObj.states || []).map((s) => [s.name, s.initialValue])
      );
      setStateMap(new Map(stateMapRef.current));
    }
  }, [schemaStr, stateMap]);
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
    if (!schemaStr || !packageList) {
      return;
    }
    if (compMap !== null && stateMap !== null) {
      setInitFalg(true);
    }
  }, [compMap, packageList, schemaStr, stateMap]);
  const dom = useMemo(() => {
    if (!initFalg) {
      return;
    }
    const schemaObj = JSON.parse(schemaStr) as SchemaRootObj;
    // 异步解析后加载dom
    return ParseRender<ReactNode>({
      schemaCompTree: schemaObj?.compTree,
      compMap: compMap as CompMapType,
      getState: (stateNameList) => {
        return stateNameList.map((name) =>
          (stateMap as StateMapType).get(name)
        );
      },
      setState(li) {
        // 只有在states里声明的状态才会纳入管理
        const changeList = li.filter((l) =>
          Array((stateMap as StateMapType).keys()).some(
            (s) => l.name === s.next().value
          )
        );
        // 避免多次调用setState，导致之前set的状态被覆盖
        changeList.forEach(({ name, value }) => {
          stateMapRef.current?.set(name, value);
        });
        setStateMap(new Map(stateMapRef.current));
      },
      onCreateNode:
        onCreateNodeRef.current ||
        ((comp, props, children) => {
          return createElement(comp, props, children);
        }),
    });
  }, [compMap, initFalg, schemaStr, stateMap]);
  return createElement(Fragment, null, [dom]);
};
export default ReactRender;
