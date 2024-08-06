import { SchemaRootObj } from '@peeto/core';
import { recusionCompTree, getCompTreeStr } from './comp-tree';
import { getEffectStr } from './effect';
import { getLibStr } from './lib';
import { getRefStr } from './ref';
import { getStateStr } from './state';

export const toReactStr = (str: string) => {
  const libStr = getLibStr(JSON.parse(str || '{}') as SchemaRootObj);
  const stateStr = getStateStr(JSON.parse(str || '{}') as SchemaRootObj);
  const refStr = getRefStr(JSON.parse(str || '{}') as SchemaRootObj);
  const effectsStr = getEffectStr(JSON.parse(str || '{}') as SchemaRootObj);
  const { treeObj } = recusionCompTree(
    JSON.parse(str || '{}') as SchemaRootObj
  );
  const treeStr = getCompTreeStr(treeObj, { parentNode: 'comp' });

  return `import { useState, useEffect, useRef } from "react";
  ${libStr}
  
  const Index = () => {
    // 引入依赖包
  
    // 状态
    ${stateStr}
  
    // ref
    ${refStr}
  
    // 事件
  
    // 副作用
    ${effectsStr}
  
    // 组件树
    return (
      <>
        ${treeStr}
      </>
    );
  };
  
  export default Index
  `;
};