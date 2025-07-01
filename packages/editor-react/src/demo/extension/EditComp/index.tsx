import Editor from '@peeto/editor';
import { Extension } from '@peeto/extension';
import { FC, useEffect, useRef, useState } from 'react';
import { SimulatorConfigType } from '../Simulator/type';
import { name as simulatorName } from '../Simulator';
import {
  getLibModuleByName,
  SchemaCompTreeItem,
  SchemaRootObj,
} from '@peeto/core';
import { API_COMP_CHECK, API_CONFIG_CHANGE } from '../common';
import { notification } from 'antd';

import { findNodeInSchemaPathsById, PropFormCompPropType } from './util';
import ElText from './ElementPlus/ElText';

export const name = 'EXTENSION_EDIT_COMP';

const componentPropsDesc: Record<
  string,
  Record<
    string,
    {
      /**
       * 参数配置表单渲染组件
       * @returns
       */
      PropFormComp?: FC<PropFormCompPropType>;
    }
  >
> = {
  // TODO 配置组件参数描述
  antd: {
    Button: {},
    Card: {},
    Typography: {},
    Row: {},
    Input: {},
    Space: {},
    Tag: {},
    Switch: {},
    Dropdown: {},
    Form: {},
    Modal: {},
    Checkbox: {},
  },
  '@ant-design/pro-components': { ProTable: {}, TableDropdown: {} },
  'element-plus': {
    ElConfigProvider: {},
    ElText: {
      PropFormComp: ElText,
    },
    ElInput: {},
    ElButton: {},
    ElTag: {},
    ElCard: {},
    ElRow: {},
    ElCol: {},
    ElSpace: {},
    ElSwitch: {},
    ElTable: {},
    ElTableColumn: {},
    ElPagination: {},
  },
};

const PropForm: FC<{
  id: SchemaCompTreeItem['id'];
  simulatorConfigType: SimulatorConfigType;
  onChange: (c: string) => void;
}> = ({ id, simulatorConfigType, onChange }) => {
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const renderPropsRef = useRef<PropFormCompPropType>();
  const RenderFuncRef = useRef<FC<PropFormCompPropType>>();
  const [renderFlag, setRenderFlag] = useState<boolean>(false);

  const strRef = useRef(simulatorConfigType.schemaStr);
  strRef.current = simulatorConfigType.schemaStr;

  useEffect(() => {
    // 不捕获异常会直接卸载此组件
    try {
      const schemaObj = JSON.parse(strRef.current || '{}') as SchemaRootObj;

      // TODO 暂时只取第一个
      if (!schemaObj) {
        throw new Error('没有schemaObj');
      }

      const node = findNodeInSchemaPathsById({ schemaObj, id });
      if (!node) {
        throw new Error(`id:${id}没有对应组件`);
      }
      const { path, schema } = node;
      // 获取组件的包名、模块导出名
      const { libName, moduleItem } = getLibModuleByName({
        libModules: schemaObj.libModules || [],
        name: schema.componentName,
      });
      if (!moduleItem || !libName) {
        throw new Error(
          `${schema.componentName}没有在schemaObj.libModules中找到声明的模块`
        );
      }

      // 加载组件参数配置表单
      const { PropFormComp: PropFormRender } =
        componentPropsDesc?.[libName]?.[moduleItem.name] || {};
      if (!PropFormRender) {
        throw new Error(`${schema.componentName}没有配置参数编辑器`);
      }
      renderPropsRef.current = {
        libName,
        moduleItem,
        curSchema: schema,
        schemaRootObj: schemaObj,
        path,
        onChange: onChangeRef.current,
      };
      setRenderFlag(true);
      RenderFuncRef.current = PropFormRender;
    } catch (e) {
      notification.warning({
        message: '加载组件配置告警',
        description: (e as Error).message,
      });
    }
  }, [id]);

  useEffect(() => {
    if (renderFlag) {
      setRenderFlag(false);
    }
  }, [renderFlag]);

  if (renderFlag) {
    return <div />;
  }

  const RenderFunc = RenderFuncRef.current;
  if (!RenderFunc || !renderPropsRef.current) {
    return <div />;
  }

  return <RenderFunc {...renderPropsRef.current} />;
};

const Index = ({
  extension,
  editor,
}: {
  editor: Editor;
  extension: Extension;
}) => {
  const extensionRef = useRef(extension);
  extensionRef.current = extension;
  const [curConfig, setCurConfig] = useState<SimulatorConfigType>();
  const [curId, setCurId] = useState<SchemaCompTreeItem['id']>();

  extension.setApi(
    API_COMP_CHECK,
    async (compList: SchemaCompTreeItem['id'][] = []) => {
      setCurId(compList[0]);
    }
  );
  extension.setApi(API_CONFIG_CHANGE, (c: SimulatorConfigType) => {
    setCurConfig(c);
    setCurId(undefined);
  });

  useEffect(() => {
    extensionRef.current.rightToolPanel.onMounted();
  }, []);

  return (
    <div>
      {curId && curConfig && (
        <PropForm
          id={curId}
          simulatorConfigType={curConfig}
          onChange={(c) => {
            setCurConfig({ ...curConfig, schemaStr: c });
            const simulatorEx = editor.getExtensionByName(simulatorName);
            simulatorEx?.simulator.onActive().then(() => {
              simulatorEx?.getApi(API_CONFIG_CHANGE)?.({
                ...curConfig,
                schemaStr: c,
              });
            });
          }}
        />
      )}
    </div>
  );
};

export default Index;
