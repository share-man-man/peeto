import { useEffect } from 'react';
import { InjectExtensionCompProps } from '@peeto/extension';
import { WORK_BENCH_ICON_CLICK_EVENT } from '../../components/EditorWorkbench';
import { START_PICK_EVENT } from '../CompConfigEdit';

const Index = ({ subscribeEvent, dispatchEvent }: InjectExtensionCompProps) => {
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
