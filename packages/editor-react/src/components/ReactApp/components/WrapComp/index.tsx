import { ReactNode } from 'react';
import { v4 as id } from 'uuid';

export const WRAP_COMP_KEY_PREFIX = '';

/**
 * 获取组件key
 * @returns
 */
export const getWrapCompKey = () => `${WRAP_COMP_KEY_PREFIX}-${id()}`;

// TODO 待增加功能：捕获组件错误

/**
 * 1:防止FiberNode的key被父组件篡改
 * @param param0
 * @returns
 */
const Index = ({ children }: { children: ReactNode }) => {
  return children;
};

export default Index;
