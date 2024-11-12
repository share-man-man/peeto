import coreJson from '../packages/core/package.json';
import renderReactJson from '../packages/render-react/package.json';
import extensionJson from '../packages/extension/package.json';

export const packageConfig: {
  [k in 'CORE' | 'RENDER_REACT' | 'EXTENSION']: {
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
  RENDER_REACT: {
    packageName: renderReactJson.name,
    libName: 'PeetoRenderReact',
  },
  EXTENSION: {
    packageName: extensionJson.name,
    libName: 'PeetoExtension',
  },
};
