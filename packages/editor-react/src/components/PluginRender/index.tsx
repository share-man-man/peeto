import { BaseToolBarPluginProps } from '../EditorWorkbench/type';
import AppRender from '../AppRender';
import ReactWrap, { ReactWrapProps } from './components/ReactWrap';
import VueWrap from './components/VueWrap/WrapComp.vue';
import { VueWrapProps } from './components/VueWrap/type';

export interface PluginRenderProps {
  visible?: boolean;
  item: BaseToolBarPluginProps;
}

const Index = ({ visible = true, item }: PluginRenderProps) => {
  const { onMount, ...childProp } = item.renderProps.props || {};
  return (
    <div style={{ display: visible ? '' : 'none' }}>
      {/* 渲染插件，在外层包裹一个组件，统一调用onMount，以通知上级组件加载完成 */}
      <AppRender
        type={item.renderProps.libType}
        vueProps={{
          comp: VueWrap,
          prop: {
            onMount,
            comp: item.renderProps.node as VueWrapProps['comp'],
            childProp,
          } as VueWrapProps,
        }}
        reactProps={{
          comp: ReactWrap,
          prop: {
            onMount,
            Comp: item.renderProps.node as ReactWrapProps['Comp'],
            childProp,
          } as ReactWrapProps,
        }}
      />
    </div>
  );
};

export default Index;
