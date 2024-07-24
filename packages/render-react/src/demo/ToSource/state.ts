import { getSetStateFuncName, SchemaRootObj } from '@peeto/core';

export const getStateStr = (schema: SchemaRootObj) => {
  return (schema.states || [])
    .map(
      (s) =>
        `const [${s.name},${getSetStateFuncName({
          stateName: s.name,
        })}] = useState(${JSON.stringify(s.initialValue)});`
    )
    .join('\n');
};
