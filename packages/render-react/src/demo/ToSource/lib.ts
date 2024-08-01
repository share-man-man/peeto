export const getLibStr = (libList: Record<string, Map<string, string>>) => {
  return Object.keys(libList)
    .map(
      (k) =>
        `import { ${Array.from(libList[k].keys())
          .map((subName) => {
            const alias = libList[k].get(subName);
            if (alias) {
              return `${subName} as ${alias}`;
            }
            return subName;
          })
          .join(',')} } from '${k}';`
    )
    .join('\n');
};
