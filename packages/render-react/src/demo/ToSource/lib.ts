export const getLibStr = (libList: Record<string, Set<string>>) => {
  return Object.keys(libList)
    .map((k) => `import { ${Array.from(libList[k]).join(',')} } from '${k}';`)
    .join('\n');
};
