import { PluginRenderProps } from '@peeto/editor';
import AppRender from '../../../AppRender';
import ReactWrap, { ReactWrapProps } from './components/ReactWrap';
import VueWrap from './components/VueWrap/WrapComp.vue';
import { VueWrapProps } from './components/VueWrap/type';

const Index = ({
  visible = true,
  config,
  injectProps,
  lifeCycleHooks,
}: PluginRenderProps) => {
  const { props: compProp } = config.renderProps || {};
  const { onMount } = lifeCycleHooks;
  return (
    <div style={{ display: visible ? '' : 'none' }}>
      {/* 渲染插件，在外层包裹一个组件，统一调用onMount，以通知上级组件加载完成 */}
      <AppRender
        type={config.renderProps.libType}
        vueProps={{
          comp: VueWrap,
          prop: {
            onMount,
            comp: config.renderProps.node as VueWrapProps['comp'],
            compProp: {
              ...compProp,
              ...injectProps,
            },
          } as VueWrapProps,
        }}
        reactProps={{
          comp: ReactWrap,
          prop: {
            onMount,
            comp: config.renderProps.node as ReactWrapProps['comp'],
            compProp: {
              ...compProp,
              ...injectProps,
            },
          } as ReactWrapProps,
        }}
      />
    </div>
  );
};

export default Index;
