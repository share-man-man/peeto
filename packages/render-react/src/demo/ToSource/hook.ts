import { SchemaHookItem, SchemaRootObj } from '@peeto/core';

const nameStr = ({ name, arrDestructs, objDestructs }: SchemaHookItem) => {
  if (name) {
    return name;
  }
  if (arrDestructs) {
    return `[${arrDestructs.join(',')}]`;
  }
  if (objDestructs) {
    return `{
    ${objDestructs
      .map((o) => {
        return `${o.name} ${o.alias || ''}`;
      })
      .join(',')}
    }`;
  }
};

export const getHookStr = (schema: SchemaRootObj) => {
  return (schema.customHooks || [])
    .map(
      (s) => `
    const ${nameStr(s)} = ${s.effect.body}
  `
    )
    .join('\n');
};
