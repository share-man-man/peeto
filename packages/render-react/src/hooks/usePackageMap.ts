import { PackageMapType, SchemaRootObj, getPackageMap } from '@peeto/parse';
import { useState, useEffect } from 'react';
import { ReactRenderProps } from '../utils';

const usePackageMap = ({
  schemaStr,
  packageList,
}: Pick<ReactRenderProps, 'schemaStr' | 'packageList'>) => {
  // 包集合
  const [packageMap, setPackageMap] = useState<PackageMapType | null>(null);
  // 加载依赖的包
  useEffect(() => {
    const schemaObj = JSON.parse(schemaStr) as SchemaRootObj;
    getPackageMap(schemaObj, packageList).then((res) => {
      if (packageMap === null) {
        // 初始化包
        setPackageMap(res);
      } else {
        // 如果包有改变，需要重新加载包
        let flag = false;
        res.forEach((_, key) => {
          if (!packageMap.has(key)) {
            flag = true;
          }
        });
        if (flag) {
          setPackageMap(res);
        }
      }
    });
  }, [packageList, packageMap, schemaStr]);

  return { packageMap };
};

export default usePackageMap;
