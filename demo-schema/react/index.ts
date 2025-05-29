import {
  basic,
  state,
  anonymousFunction,
  listLoop,
  conditionBool,
} from './basic';
import { table } from './table';
import { form } from './form';

export const enumOp: {
  key: string;
  label: string;
  str: string;
}[] = [
  {
    key: 'testObj',
    label: basic.desc,
    str: JSON.stringify(basic.schema),
  },
  {
    key: 'anonymousFunction',
    label: anonymousFunction.desc,
    str: JSON.stringify(anonymousFunction.schema),
  },
  {
    key: 'state',
    label: state.desc,
    str: JSON.stringify(state.schema),
  },
  {
    key: 'listLoop',
    label: listLoop.desc,
    str: JSON.stringify(listLoop.schema),
  },
  {
    key: 'conditionBool',
    label: conditionBool.desc,
    str: JSON.stringify(conditionBool.schema),
  },
  {
    key: 'table',
    label: table.desc,
    str: JSON.stringify(table.schema),
  },
  {
    key: 'form',
    label: form.desc,
    str: JSON.stringify(form.schema),
  },
];
