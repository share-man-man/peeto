import { ExtensionRenderProps } from '@peeto/extension';
import { AppRenderProps } from '../../../../../AppRender';

export interface VueWrapProps {
  onMount: ExtensionRenderProps['lifeCycleHooks']['onMount'];
  comp: Required<AppRenderProps>['vueProps']['comp'];
  compProp: Required<AppRenderProps>['vueProps']['prop'];
}
