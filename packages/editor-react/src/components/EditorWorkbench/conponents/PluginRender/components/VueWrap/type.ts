import { AppRenderProps } from '../../../../../AppRender';
import { PluginRenderProps } from '../../../../type';

export interface VueWrapProps {
  onMount: PluginRenderProps['lifeCycleHooks']['onMount'];
  comp: Required<AppRenderProps>['vueProps']['comp'];
  compProp: Required<AppRenderProps>['vueProps']['prop'];
}
