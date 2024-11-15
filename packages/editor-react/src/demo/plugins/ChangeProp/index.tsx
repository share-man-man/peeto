import { ReactNode, useEffect, useMemo, useState } from 'react';
import { LibListItem } from '@peeto/core';
import { v4 as id } from 'uuid';
import { Descriptions, Radio } from 'antd';

import { SimilatorPluginConfig } from '../../../plugins/SimilatorPlugin/type';
import { SIMILATOR_CONFIG_CHANGE_EVENT } from '../../../plugins/SimilatorPlugin';
import { schema as baseReact } from '../../schema/react/base';
import { schema as modalForm } from '../../schema/react/modal-form';
import { schema as vueBase } from '../../schema/vue/base';
import { schema as vueSearchTable } from '../../schema/vue/search-table';

import MyButton from '../../components/MyButton.vue';
import MyTest from '../../components/MyTest.vue';
import { h } from 'vue';
import { InjectExtensionCompProps, EXTENSION_LIB_TYPE } from '@peeto/extension';

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
];

const vuePackage: LibListItem[] = [
  {
    name: 'element-plus',
    load: async () => import('element-plus'),
  },
  {
    name: 'test',
    load: async () => ({
      Test: MyTest,
      Button: MyButton,
      Text: ({ text }: { text: string }) => {
        return h('div', text);
      },
    }),
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
  [EXTENSION_LIB_TYPE.REACT18]: [
    {
      key: id(),
      children: 'base',
      schema: JSON.stringify(baseReact),
      packageList: reactPackage,
    },
    {
      key: id(),
      children: 'modal-form',
      schema: JSON.stringify(modalForm),
      packageList: reactPackage,
    },
  ],
  [EXTENSION_LIB_TYPE.VUE3]: [
    {
      key: id(),
      children: 'vueBase',
      schema: JSON.stringify(vueBase),
      packageList: vuePackage,
    },
    {
      key: id(),
      children: 'vueSearchTable',
      schema: JSON.stringify(vueSearchTable),
      packageList: vuePackage,
    },
  ],
};

const Index = ({ dispatchEvent }: InjectExtensionCompProps) => {
  const [libType, setLibType] = useState<EXTENSION_LIB_TYPE>(
    EXTENSION_LIB_TYPE.REACT18
  );
  const [schemaKey, setSchemaKey] = useState<string>(
    schemaConfig[libType]?.[0]?.key
  );

  const curConfig = useMemo(() => {
    return schemaConfig[libType]?.find((i) => i.key === schemaKey);
  }, [libType, schemaKey]);

  useEffect(() => {
    if (!libType || !curConfig?.schema || !curConfig?.packageList) {
      return;
    }

    dispatchEvent([
      {
        name: SIMILATOR_CONFIG_CHANGE_EVENT,
        paylod: {
          packageList: curConfig?.packageList,
          schemaStr: curConfig?.schema,
          type: libType,
        } as SimilatorPluginConfig,
      },
      // 告诉配置插件，重新注册相关setter
    ]);
  }, [curConfig?.packageList, curConfig?.schema, dispatchEvent, libType]);

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

export default Index;
