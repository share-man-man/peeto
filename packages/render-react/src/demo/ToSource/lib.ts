import { SchemaRootObj } from '@peeto/core';

export const getLibStr = (schema: SchemaRootObj) => {
  return (schema.libModules || [])
    .map(
      ({ name, subs }) =>
        `import { ${subs
          .map(({ name: subName, alias }) => {
            if (alias) {
              return `${subName} as ${alias}`;
            }
            return subName;
          })
          .join(',')} } from '${name}';`
    )
    .join('\n');
};
