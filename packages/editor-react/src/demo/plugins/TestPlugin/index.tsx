import { useEffect } from 'react';
import { InjectExtensionCompProps } from '@peeto/extension';

const Index = ({ subscribeEvent, dispatchEvent }: InjectExtensionCompProps) => {
  useEffect(() => {
    /**
     * 订阅事件
     */
    subscribeEvent([
      {
        name: 'onSchemaChange',
        run: (v: string) => {
          console.log('test-plugin-onSchemaChange===', v);
        },
      },
      {
        name: 'onPackageChange',
        run: (v: string) => {
          console.log('test-plugin-onSchemaChange===', v);
        },
      },
    ]);
  }, [subscribeEvent]);
  return (
    <div
      onClick={() => {
        dispatchEvent([
          {
            name: 'onLibTypeChange',
            paylod: {},
          },
        ]);
      }}
    >
      测试插件111
    </div>
  );
};

export default Index;
