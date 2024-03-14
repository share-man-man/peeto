import { AppRenderProps } from '../../../AppRender';
import { InjectPluginCompProps } from '../../../EditorWorkbench/type';

export interface VueWrapProps {
  onMount: InjectPluginCompProps['onMount'];
  comp: Required<AppRenderProps>['vueProps']['comp'];
  childProp: Required<AppRenderProps>['vueProps']['prop'];
}
