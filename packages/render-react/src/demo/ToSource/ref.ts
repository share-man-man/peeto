import { SchemaRootObj } from '@peeto/core';

export const getRefStr = (schema: SchemaRootObj) => {
  return (schema.refs || [])
    .map(
      (s) =>
        `${s.desc ? `// ${s.desc}` : ''}
        const ${s.name} = useRef(${s.initialValue || 'null'})
      `
    )
    .join('\n');
};
