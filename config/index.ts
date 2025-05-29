import coreJson from '../packages/core/package.json';
import editorJson from '../packages/editor/package.json';
import editorReactJson from '../packages/editor-react/package.json';
import renderReactJson from '../packages/render-react/package.json';
import renderVueJson from '../packages/render-vue/package.json';
import extensionJson from '../packages/extension/package.json';

export const packageConfig: {
  [k in
    | 'CORE'
    | 'EDITOR'
    | 'EDITOR_REACT'
    | 'RENDER_REACT'
    | 'RENDER_VUE'
    | 'EXTENSION']: {
    /**
     * npm包名
     */
    packageName: string;
    /**
     * umd全局包名
     */
    libName: string;
  };
} = {
  CORE: {
    packageName: coreJson.name,
    libName: 'PeetoCore',
  },
  EDITOR: {
    packageName: editorJson.name,
    libName: 'PeetoEditor',
  },
  EDITOR_REACT: {
    packageName: editorReactJson.name,
    libName: 'PeetoEditorReact',
  },
  EXTENSION: {
    packageName: extensionJson.name,
    libName: 'PeetoExtension',
  },
  RENDER_REACT: {
    packageName: renderReactJson.name,
    libName: 'PeetoRenderReact',
  },
  RENDER_VUE: {
    packageName: renderVueJson.name,
    libName: 'PeetoRenderVue',
  },
};
