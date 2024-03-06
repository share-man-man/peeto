import { PackageListType } from '@peeto/parse';
import { ReactNode, useMemo, useRef, useState } from 'react';
import { Descriptions, Radio, Typography } from 'antd';
import { h } from 'vue';
import { v4 as id } from 'uuid';
import { EDITOR_LIB_TYPE } from '../type';

import { schema as baseReact } from './schema/react/base';
import { schema as modalForm } from './schema/react/modal-form';
import { schema as vueBase } from './schema/vue/base';

import VueTest from './components/MyTest.vue';
import MyButton from './components/MyButton.vue';
import EditorSimilator from '../components/EditorSimilator';
import { EditorSimilatorCompDomMap } from '../components/EditorSimilator/type';

const reactPackage: PackageListType = [
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

const vuePackage: PackageListType = [
  {
    name: 'element-plus',
    load: async () => import('element-plus'),
  },
  {
    name: 'test',
    load: async () => ({
      Test: VueTest,
      Button: MyButton,
      Text: ({ text }: { text: string }) => {
        return h('div', text);
      },
    }),
  },
];

const schemaConfig: {
  [k in EDITOR_LIB_TYPE]: {
    key: string;
    children: ReactNode;
    schema: string;
    packageList: PackageListType;
  }[];
} = {
  [EDITOR_LIB_TYPE.REACT]: [
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
  [EDITOR_LIB_TYPE.VUE]: [
    {
      key: id(),
      children: 'vueBase',
      schema: JSON.stringify(vueBase),
      packageList: vuePackage,
    },
  ],
};

function Index() {
  const [libType, setLibType] = useState<EDITOR_LIB_TYPE>(
    EDITOR_LIB_TYPE.REACT
  );
  const [schemaKey, setSchemaKey] = useState<string>(
    schemaConfig[libType]?.[1]?.key
  );

  const curConfig = useMemo(() => {
    return schemaConfig[libType]?.find((i) => i.key === schemaKey);
  }, [libType, schemaKey]);

  const mapRef = useRef<EditorSimilatorCompDomMap>(new Map());

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
      <Typography.Title level={3}>渲染效果</Typography.Title>
      <div
        onClick={(e) => {
          mapRef.current.forEach((doms, key) => {
            if (doms.includes(e.target as HTMLElement)) {
              // TODO 合并dom，获取最大宽高
              console.log(11, key);
            }
          });
        }}
      >
        {libType && curConfig?.schema && curConfig.packageList && (
          <EditorSimilator
            type={libType}
            schemaStr={curConfig.schema}
            packageList={curConfig.packageList}
            // delay={500}
            onMapChange={(map) => {
              // console.log('映射关系', map);
              mapRef.current = map;
            }}
          />
        )}
      </div>
    </div>
  );
}

export default Index;
