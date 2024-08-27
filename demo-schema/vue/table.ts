import {
  creatAnonymousFunc,
  createComp,
  createSchemaConfig,
  createSlot,
} from '../utils';
import { libModules } from './basic';

export const table = createSchemaConfig({
  desc: '表格-表达式、渲染函数',
  schema: {
    libModules,
    refs: [{ name: 'actionRef', desc: '表格ref' }],
    compTree: [
      123,
      createComp(
        'ElTable',
        {
          stripe: true,
          border: true,
          data: [
            {
              date: '2016-05-03',
              name: 'Tom',
              state: 'California',
              city: 'Los Angeles',
              address: 'No. 189, Grove St, Los Angeles',
              zip: 'CA 90036',
              tag: 'Home',
            },
            {
              date: '2016-05-02',
              name: 'Tom',
              state: 'California',
              city: 'Los Angeles',
              address: 'No. 189, Grove St, Los Angeles',
              zip: 'CA 90036',
              tag: 'Office',
            },
            {
              date: '2016-05-04',
              name: 'Tom',
              state: 'California',
              city: 'Los Angeles',
              address: 'No. 189, Grove St, Los Angeles',
              zip: 'CA 90036',
              tag: 'Home',
            },
            {
              date: '2016-05-01',
              name: 'Tom',
              state: 'California',
              city: 'Los Angeles',
              address: 'No. 189, Grove St, Los Angeles',
              zip: 'CA 90036',
              tag: 'Office',
            },
          ],
          style: {
            width: '100%',
          },
        },
        {
          slots: {
            default: createSlot({
              compTree: [
                createComp('ElTableColumn', {
                  fixed: true,
                  prop: 'date',
                  label: 'Date',
                  width: '150',
                }),
                createComp('ElTableColumn', {
                  prop: 'name',
                  label: 'Name',
                  width: '120',
                }),
                createComp('ElTableColumn', {
                  prop: 'state',
                  label: 'State',
                  width: '120',
                }),
                createComp('ElTableColumn', {
                  prop: 'city',
                  label: 'City',
                  width: '120',
                }),
                createComp('ElTableColumn', {
                  prop: 'address',
                  label: 'Address',
                  width: '600',
                }),
                createComp('ElTableColumn', {
                  prop: 'zip',
                  label: 'Zip',
                  width: '120',
                }),
                createComp(
                  'ElTableColumn',
                  {
                    fixed: 'right',
                    label: 'Operations',
                    minWidth: '120',
                  },
                  {
                    slots: createSlot({
                      compTree: [
                        createComp(
                          'ElButton',
                          {
                            link: true,
                            type: 'primary',
                            size: 'small',
                            onClick: creatAnonymousFunc({
                              func: { body: 'console.log("click")' },
                            }),
                          },
                          {
                            slots: createSlot({ compTree: ['Detail'] }),
                          }
                        ),
                        createComp(
                          'ElButton',
                          {
                            link: true,
                            type: 'primary',
                            size: 'small',
                          },
                          {
                            slots: createSlot({ compTree: ['Edit'] }),
                          }
                        ),
                      ],
                    }),
                  }
                ),
              ],
            }),
          },
        }
      ),
    ],
  },
});
