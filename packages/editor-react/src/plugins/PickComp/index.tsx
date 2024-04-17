import { useEffect } from 'react';
import { InjectPluginCompProps } from '@peeto/editor';
import { SIMILATOR_START_PICK_EVENT } from '../SimilatorPlugin';
import { WORK_BENCH_ICON_CLICK_EVENT } from '../../components/EditorWorkbench';

const Index = ({ subscribeEvent, dispatchEvent }: InjectPluginCompProps) => {
  useEffect(() => {
    subscribeEvent([
      {
        name: WORK_BENCH_ICON_CLICK_EVENT,
        run: () => {
          dispatchEvent([
            {
              name: SIMILATOR_START_PICK_EVENT,
            },
          ]);
        },
      },
    ]);
  }, [dispatchEvent, subscribeEvent]);
  return <div />;
};

export default Index;
