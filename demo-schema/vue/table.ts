import { AnyType, SchemaEffectDependenceType } from '../../packages/core';
import { ConditionTypeEnum, FuncTypeEnum } from '../../packages/core/src/func';
import {
  createFunc,
  createComp,
  createSchemaConfig,
  createSlot,
  createState,
  createRef,
} from '../utils';
import { libModules } from './basic';

export const table = createSchemaConfig({
  desc: '表格-表达式、渲染函数',
  schema: {
    libModules,
    states: [
      {
        name: 'loading',
        desc: '加载状态',
        initialValue: false,
      },
      {
        name: 'current',
        desc: '当前页码',
        initialValue: 1,
      },
      {
        name: 'pageSize',
        desc: '分页大小',
        initialValue: 20,
      },
      {
        name: 'total',
        desc: '分页大小',
        initialValue: 0,
      },
      {
        name: 'list',
        desc: '表格数据',
        initialValue: [],
      },
    ],
    refs: [{ name: 'actionRef', desc: '表格ref' }],
    effects: [
      {
        body: `
        setLoading(true);
        setTimeout(()=>{
            request('https://proapi.azurewebsites.net/github/issues', {
              params:{
              current,
              pageSize
              },
            }).then((res)=>{
              setLoading(false);
              console.log('请求结果:',res);
              setList(res.data);
              setTotal(res.total);
            })
          },500)`,
        dependences: [
          {
            type: SchemaEffectDependenceType.MODULE,
            name: 'request',
          },
          {
            type: SchemaEffectDependenceType.STATE,
            name: 'current',
          },
          {
            type: SchemaEffectDependenceType.STATE,
            name: 'pageSize',
          },
        ],
        effectStates: ['loading', 'total', 'list'],
      },
    ],
    compTree: [
      123,
      createComp(
        'ElTable',
        {
          stripe: true,
          border: true,
          data: createState({ name: 'list' }),
          style: {
            width: '100%',
          },
          ref: createRef({ name: 'actionRef' }),
        },
        {
          slots: {
            default: createSlot({
              compTree: [
                createComp(
                  'ElTableColumn',
                  {
                    fixed: true,
                    label: '序号',
                    width: '60',
                  },
                  {
                    slots: createSlot({
                      params: ['record'],
                      compTree: [
                        createComp(
                          'ElTag',
                          {
                            round: true,
                            effect: 'dark',
                            type: 'info',
                          },
                          {
                            slots: createSlot({
                              compTree: [
                                createFunc({
                                  IIFE: true,
                                  func: {
                                    body: 'record.$index',
                                  },
                                }),
                              ],
                            }),
                          }
                        ),
                      ],
                    }),
                  }
                ),
                createComp('ElTableColumn', {
                  prop: 'title',
                  label: '标题',
                  width: '150',
                }),
                createComp(
                  'ElTableColumn',
                  {
                    prop: 'state',
                    label: '表达式',
                    width: '100',
                  },
                  {
                    slots: createSlot({
                      compTree: [
                        createFunc({
                          IIFE: true,
                          func: { body: '"表达式-".repeat(10)' },
                        }),
                      ],
                    }),
                  }
                ),
                createComp(
                  'ElTableColumn',
                  {
                    prop: '_renders2',
                    label: '渲染函数-组件树',
                    width: '80',
                  },
                  {
                    slots: createSlot({
                      params: ['record'],
                      compTree: [
                        createComp(
                          'ElSpace',
                          {},
                          {
                            slots: createSlot({
                              compTree: [
                                createFunc({
                                  IIFE: true,
                                  funcType: FuncTypeEnum.RENDERFUNC,
                                  renderFunc: {
                                    conditionType: ConditionTypeEnum.LISTLOOP,
                                    listLoop: {
                                      data: createFunc({
                                        IIFE: true,
                                        func: {
                                          body: 'record.row.labels',
                                        },
                                      }) as AnyType,
                                      mapParams: ['lablesItem', 'lablesIndex'],
                                    },
                                    compTree: createComp(
                                      'ElTag',
                                      {
                                        key: createFunc({
                                          IIFE: true,
                                          func: {
                                            body: 'lablesItem.name',
                                          },
                                        }),
                                        round: true,
                                        effect: 'dark',
                                        type: createFunc({
                                          IIFE: true,
                                          func: {
                                            body: `{
                                                ["success"]: "success",
                                                ["processing"]: "primary",
                                                ["error"]: "danger",
                                                ["default"]: "info",
                                                ["warning"]: "warning",
                                              }[lablesItem.color]
                                            `,
                                          },
                                        }),
                                      },
                                      {
                                        slots: createSlot({
                                          compTree: [
                                            createFunc({
                                              IIFE: true,
                                              func: {
                                                body: 'lablesItem.name',
                                              },
                                            }),
                                          ],
                                        }),
                                      }
                                    ),
                                  },
                                }),
                              ],
                            }),
                          }
                        ),
                      ],
                    }),
                  }
                ),
                createComp('ElTableColumn', {
                  prop: 'created_at',
                  label: '创建时间',
                  width: '120',
                }),
                createComp('ElTableColumn', {
                  prop: '_',
                  label: '',
                }),
                createComp(
                  'ElTableColumn',
                  {
                    fixed: 'right',
                    label: 'Operations',
                    width: '120',
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
                            onClick: createFunc({
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
                            onClick: createFunc({
                              dependences: [
                                {
                                  type: SchemaEffectDependenceType.REF,
                                  name: 'actionRef',
                                },
                              ],
                              func: { body: 'console.log(actionRef)' },
                            }),
                          },
                          {
                            slots: createSlot({ compTree: ['编辑'] }),
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
      createComp('ElPagination', {
        disabled: createState({ name: 'loading' }),
        layout: 'prev, pager, next',
        currentPage: createState({ name: 'current' }),
        'onUpdate:current-page': createFunc({
          effectStates: ['current'],
          params: ['n'],
          func: { body: 'setCurrent(n)' },
        }),
        pageSize: createState({ name: 'pageSize' }),
        total: createState({ name: 'total' }),
      }),
    ],
  },
});
