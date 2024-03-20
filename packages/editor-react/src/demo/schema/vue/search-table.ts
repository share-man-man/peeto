import { SchemaRootObj } from '@peeto/parse';
import { v4 as id } from 'uuid';

export const schema: SchemaRootObj = {
  compTree: [
    {
      id: `${id()}`,
      packageName: 'element-plus',
      componentName: 'ElConfigProvider',
      props: {},
      children: [
        {
          id: `table-${id}`,
          componentName: 'ElTable',
          packageName: 'element-plus',
          props: {
            data: [
              {
                date: '2016-05-03',
                name: 'Tom',
                address: 'No. 189, Grove St, Los Angeles',
              },
              {
                date: '2016-05-02',
                name: 'Tom',
                address: 'No. 189, Grove St, Los Angeles',
              },
              {
                date: '2016-05-04',
                name: 'Tom',
                address: 'No. 189, Grove St, Los Angeles',
              },
              {
                date: '2016-05-01',
                name: 'Tom',
                address: 'No. 189, Grove St, Los Angeles',
              },
            ],
            // style: 'width: 100%',
          },
          children: [
            {
              id: `column-${id()}`,
              componentName: 'ElTableColumn',
              packageName: 'element-plus',
              props: {
                prop: 'date',
                label: 'Date',
                width: '180',
              },
            },
            {
              id: `column-${id()}`,
              componentName: 'ElTableColumn',
              packageName: 'element-plus',
              props: {
                prop: 'name',
                label: 'Name',
                width: '180',
              },
            },
            {
              id: `column-${id()}`,
              componentName: 'ElTableColumn',
              packageName: 'element-plus',
              props: {
                prop: 'address',
                label: 'Address',
              },
            },
          ],
        },
      ],
    },
  ],
};

export default schema;
