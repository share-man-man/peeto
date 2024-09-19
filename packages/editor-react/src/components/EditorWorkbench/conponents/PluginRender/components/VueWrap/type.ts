import { PluginRenderProps } from 'packages/extension/src';
import { AppRenderProps } from '../../../../../AppRender';

export interface VueWrapProps {
  onMount: PluginRenderProps['lifeCycleHooks']['onMount'];
  comp: Required<AppRenderProps>['vueProps']['comp'];
  compProp: Required<AppRenderProps>['vueProps']['prop'];
}
