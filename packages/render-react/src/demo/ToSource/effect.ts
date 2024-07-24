import { SchemaRootObj } from '@peeto/core';

export const getEffectStr = (schema: SchemaRootObj) => {
  return (schema.effects || [])
    .map(
      ({ dependences, body }) => `useEffect(()=>{
    ${body}
    },[${dependences.join(',')}]);`
    )
    .join('\n');
};
