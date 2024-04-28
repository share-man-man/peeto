import { useEffect } from 'react';
import { InjectPluginCompProps } from '@peeto/editor';
import { WORK_BENCH_ICON_CLICK_EVENT } from '../../components/EditorWorkbench';
import { START_PICK_EVENT } from '../CompConfigEdit';

const Index = ({ subscribeEvent, dispatchEvent }: InjectPluginCompProps) => {
  useEffect(() => {
    subscribeEvent([
      {
        name: WORK_BENCH_ICON_CLICK_EVENT,
        run: () => {
          dispatchEvent([
            {
              name: START_PICK_EVENT,
            },
          ]);
        },
      },
    ]);
  }, [dispatchEvent, subscribeEvent]);
  return <div />;
};

export default Index;
