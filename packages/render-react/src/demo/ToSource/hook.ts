import { FieldTypeEnum, SchemaHookItem, SchemaRootObj } from '@peeto/core';

const nameStr = ({ field }: SchemaHookItem) => {
  let res = '';
  let nr: never;
  const t = field.type;
  switch (t) {
    case FieldTypeEnum.NAME:
      res = field[FieldTypeEnum.NAME];
      break;
    case FieldTypeEnum.ARR:
      res = `[${field[FieldTypeEnum.ARR].join(',')}]`;
      break;
    case FieldTypeEnum.OBJ:
      res = `{
    ${field[FieldTypeEnum.OBJ]
      .map((o) => {
        return `${o.name} ${o.alias || ''}`;
      })
      .join(',')}
    }`;
      break;
    default:
      nr = t;
      if (nr) {
        //
      }
      break;
  }

  return res;
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
