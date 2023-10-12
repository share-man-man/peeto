import { PackageMapType, SchemaRootObj, getPackageMap } from '@peeto/parse';
import { ref, watchEffect } from 'vue';
import { VueRenderProps } from '../utils';

const usePackageMap = ({
  schemaStr,
  packageList,
}: Pick<VueRenderProps, 'schemaStr' | 'packageList'>) => {
  // 包集合
  const packageMap = ref<PackageMapType | null>(null);
  // 加载依赖的包
  watchEffect(() => {
    const schemaObj = JSON.parse(schemaStr) as SchemaRootObj;
    getPackageMap(schemaObj, packageList).then((res) => {
      if (packageMap.value === null) {
        // 初始化包
        packageMap.value = res;
      } else {
        // 如果包有改变，需要重新加载包
        let flag = false;
        res.forEach((_, key) => {
          if (!(packageMap.value as PackageMapType).has(key)) {
            flag = true;
          }
        });
        if (flag) {
          packageMap.value = res;
        }
      }
    });
  });

  return { packageMap };
};

export default usePackageMap;
