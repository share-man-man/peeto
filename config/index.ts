import coreJson from '../packages/parse/package.json';
import renderReactJson from '../packages/render-react/package.json';

export const packageConfig: {
  [k in 'CORE' | 'RENDER_REACT']: {
    packageName: string;
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
};
