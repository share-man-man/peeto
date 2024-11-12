import { InjectExtensionCompProps } from '@peeto/extension';

const Index = ({ dispatchEvent }: InjectExtensionCompProps) => {
  return (
    <div
      onClick={() => {
        dispatchEvent([
          {
            name: 'onSchemaChange',
            paylod: 11,
          },
          {
            name: 'onPackageChange',
            paylod: 22,
          },
        ]);
      }}
    >
      测试插件222
    </div>
  );
};

export default Index;
