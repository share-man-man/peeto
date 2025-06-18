import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { LibListItem } from '@peeto/core';
import { Descriptions, Radio } from 'antd';

import Editor from '@peeto/editor';

import { API_CONFIG_CHANGE, name as simulatorName } from '../Simulator';

import { enumOp as enumOpReact } from '../../../../../../demo-schema/react';
import { enumOp as enumOpVue } from '../../../../../../demo-schema/vue';
import { Extension } from '@peeto/extension';

/**
 * 插件类型：vue3、react-18
 */
export enum EXTENSION_LIB_TYPE {
  VUE3 = 'vue-3',
  REACT18 = 'react-18',
}

const reactPackage: LibListItem[] = [
  {
    name: 'antd',
    load: async () => import('antd'),
  },
  {
    name: '@ant-design/pro-components',
    load: async () => import('@ant-design/pro-components'),
  },
  {
    name: `my-custom`,
    load: async () => {
      return {
        Text: ({ text }: { text: string }) => {
          return <span>{text}</span>;
        },
      };
    },
  },
  {
    name: 'umi-request',
    load: async () => import('umi-request'),
  },
];

const vuePackage: LibListItem[] = [
  {
    name: 'element-plus',
    load: async () => import('element-plus'),
  },
  {
    name: 'umi-request',
    load: async () => import('umi-request'),
  },
];

const schemaConfig: {
  [k in EXTENSION_LIB_TYPE]: {
    key: string;
    children: ReactNode;
    schema: string;
    packageList: LibListItem[];
  }[];
} = {
  [EXTENSION_LIB_TYPE.REACT18]: enumOpReact.map(({ key, label, str }) => ({
    key,
    children: label,
    schema: str,
    packageList: reactPackage,
  })),
  [EXTENSION_LIB_TYPE.VUE3]: enumOpVue.map(({ key, label, str }) => ({
    key,
    children: label,
    schema: str,
    packageList: vuePackage,
  })),
};

const Index = ({
  editor,
  extension,
}: {
  editor: Editor;
  extension: Extension;
}) => {
  const [libType, setLibType] = useState<EXTENSION_LIB_TYPE>(
    EXTENSION_LIB_TYPE.VUE3
  );
  const [schemaKey, setSchemaKey] = useState<string>(
    schemaConfig[libType]?.[0]?.key
  );

  const curConfig = useMemo(() => {
    return schemaConfig[libType]?.find((i) => i.key === schemaKey);
  }, [libType, schemaKey]);
  const editorRef = useRef(editor);
  editorRef.current = editor;
  const extensionRef = useRef(extension);
  extensionRef.current = extension;

  useEffect(() => {
    extensionRef.current.panel.onMounted();
  }, []);

  useEffect(() => {
    if (!libType || !curConfig?.schema || !curConfig?.packageList) {
      return;
    }
    const simulatorEx = editorRef.current?.getExtensionByName(simulatorName);
    const setConfig = () => {
      simulatorEx?.getApi(API_CONFIG_CHANGE)?.({
        packageList: curConfig?.packageList,
        schemaStr: curConfig?.schema,
        type: libType,
      });
    };
    if (simulatorEx?.simulator.getStatus().active) {
      setConfig();
    } else {
      simulatorEx?.simulator.onActive().then(() => {
        setConfig();
      });
    }
  }, [curConfig?.packageList, curConfig?.schema, libType]);

  return (
    <div>
      {/* 配置好库和schema */}
      <Descriptions
        title="渲染配置"
        column={1}
        items={[
          {
            key: 'lib',
            label: 'ui框架',
            children: (
              <Radio.Group
                onChange={(v) => {
                  setLibType(v.target.value);
                  setSchemaKey('');
                }}
                value={libType}
              >
                {Object.keys(schemaConfig).map((k) => (
                  <Radio key={k} value={k}>
                    {k}
                  </Radio>
                ))}
              </Radio.Group>
            ),
          },
          {
            key: 'schemaKye',
            label: 'schema',
            children: libType && (
              <Radio.Group
                onChange={(v) => {
                  setSchemaKey(v.target.value);
                }}
                value={schemaKey}
              >
                {schemaConfig[libType].map(({ key, children }) => (
                  <Radio key={key} value={key}>
                    {children}
                  </Radio>
                ))}
              </Radio.Group>
            ),
          },
        ]}
      />
    </div>
  );
};

export const name = 'EXTENSIO_CHANGE_PROP';
export default Index;
