import { useCallback, useEffect, useRef } from 'react';
import ComponentPicker from './utils/component-pick';
import { Extension, EVENT_NAME } from '@peeto/extension';
import Editor from '@peeto/editor';

import { API_GET_STATE, name as simulatorName } from '../Simulator';
import { AnyType } from '@peeto/core';
import { SimulatorConfigType } from '../Simulator/type';
import { EXTENSION_LIB_TYPE } from '../ChangeProp';
import { getCompDomMap as getReactMap } from './utils/react';
import { getCompDomMap as getVueMap } from './utils/vue';
import { CompDomMap } from './type';
import { API_COMP_CHECK, name as editCompName } from '../EditComp';

export const name = 'EXTENSION_COMP_CHECK';

// 配置插件
// 监听当前选中组件id
// 通过组件id获取schema中组件信息
// 通过组件信息映射关系，获取配置表单json
// 通过setter映射，渲染配置表单json
const Index = ({
  editor,
  extension,
}: {
  editor: Editor;
  extension: Extension;
}) => {
  const extensionRef = useRef(extension);
  extensionRef.current = extension;

  useEffect(() => {
    extensionRef.current.simulator.onMounted();
  }, []);

  const componentPickerRef = useRef(
    new ComponentPicker({
      onCheckComp: (compList) => {
        const editCompEx = editor.getExtensionByName(editCompName);
        editCompEx?.suspenseToolBar?.onActive().then(() => {
          editCompEx.getApi(API_COMP_CHECK)?.(compList);
        });
      },
      onStopSelect: () => {
        extensionRef.current.changeTopToolBarActive(false);
      },
    })
  );
  const editorRef = useRef(editor);
  editorRef.current = editor;

  const updatePickerMap = useCallback(
    ({
      config,
      root,
      peetoPrivateKey,
    }: {
      root?: AnyType;
      config?: SimulatorConfigType;
      peetoPrivateKey?: string;
    }) => {
      if (!config || !root || !peetoPrivateKey) {
        return;
      }
      // 根据ui类型和节点，获取dom和schema组件映射
      const { type } = config;
      let validate: never;
      let map: CompDomMap = new Map();
      switch (type) {
        case EXTENSION_LIB_TYPE.REACT18:
          map = getReactMap({
            node: root._internalRoot.current,
            peetoPrivateKey,
          });
          break;
        case EXTENSION_LIB_TYPE.VUE3:
          map = getVueMap({
            node: root._instance.subTree,
            peetoPrivateKey,
          });
          break;
        default:
          validate = type;
          if (validate) {
            throw new Error('异常的类型');
          }
          break;
      }
      // 只取最外层的dom
      map.forEach((domList, k) => {
        const tmpList = [...domList];
        const newList = domList.filter((el) => {
          let tmp: HTMLElement | null = el.parentElement;
          let flag = false;
          while (!flag && tmp) {
            if (tmpList.some((d) => d === tmp)) {
              flag = true;
            } else {
              tmp = tmp.parentElement;
            }
          }
          return !flag;
        });
        map.set(k, newList);
      });
      componentPickerRef.current?.updateMap(map);
    },
    []
  );
  const updatePickerMapRef = useRef(updatePickerMap);
  updatePickerMapRef.current = updatePickerMap;
  // 循环获取映射，原因：有些组件会异步改变状态或dom
  useEffect(() => {
    const timer = setInterval(() => {
      // TODO 使用requestAnimationFrame，防止页面掉帧
      // 获取模拟器扩展，获取root节点
      const simulatorEx = editorRef.current.getExtensionByName(simulatorName);
      simulatorEx?.simulator.onActive().then(() => {
        const p = simulatorEx.getApi(API_GET_STATE)?.();
        if (p.config) {
          updatePickerMapRef.current(p);
        }
      });
    }, 2000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const picker = componentPickerRef.current;
    const run = (active: boolean) => {
      // top-tool-bar激活时开始监听
      if (active) {
        picker.startSelecting();
      } else {
        picker.stopSelecting();
      }
    };
    extensionRef.current.addEventListener(
      EVENT_NAME.TOP_TOOL_BAR_ACTIVE_CHANGE,
      run
    );

    return () => {
      extensionRef.current.removeEventListener(
        EVENT_NAME.TOP_TOOL_BAR_ACTIVE_CHANGE,
        run
      );
    };
  }, []);

  // 卸载后停止监听
  useEffect(() => {
    const picker = componentPickerRef.current;
    return () => {
      picker.stopSelecting();
    };
  }, []);

  return <div />;
};

export default Index;
