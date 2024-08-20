import { NodeType, SchemaRootObj } from '../../packages/core';
import { FuncTypeEnum } from '../../packages/core/src/func';
// import { NodeType } from '../../packages/core/src/root';
import {
  creatAnonymousFunc,
  createComp,
  createSchemaConfig,
  createSlot,
  createState,
  // createState,
} from '../utils';

export const libModules: SchemaRootObj['libModules'] = [
  {
    name: 'element-plus',
    subs: [
      {
        name: 'ElConfigProvider',
      },
      {
        name: 'ElText',
      },
      {
        name: 'ElInput',
      },
      {
        name: 'ElButton',
      },
      {
        name: 'ElTag',
      },
      {
        name: 'ElCard',
      },
      {
        name: 'ElRow',
      },
      {
        name: 'ElCol',
      },
      {
        name: 'ElSpace',
      },
    ],
  },
];

export const basic = createSchemaConfig({
  desc: '基础-自定义包',
  schema: {
    libModules,
    compTree: [
      createComp(
        'ElCard',
        {},
        {
          slots: {
            header: creatAnonymousFunc({
              funcType: FuncTypeEnum.RENDERFUNC,
              renderFunc: {
                compTree: createComp(
                  'ElText',
                  {},
                  {
                    slots: {
                      default: createSlot({ compTree: ['Card'] }),
                    },
                  }
                ),
              },
            }),
            default: creatAnonymousFunc({
              funcType: FuncTypeEnum.RENDERFUNC,
              renderFunc: {
                compTree: createComp(
                  'ElText',
                  {},
                  {
                    slots: {
                      default: createSlot({ compTree: ['ElText组件'] }),
                    },
                  }
                ),
              },
            }),
          },
        }
      ),
    ],
  },
});

export const anonymousFunction = createSchemaConfig({
  desc: '基础-匿名函数',
  schema: {
    libModules,
    compTree: [
      createComp(
        'ElButton',
        {
          type: 'primary',
          onClick: creatAnonymousFunc({
            func: {
              body: 'alert("点击了按钮")',
            },
          }),
        },
        {
          slots: {
            default: createSlot({ compTree: ['点击弹出提示框'] }),
          },
        }
      ),
    ],
  },
});

export const state = createSchemaConfig({
  desc: '基础-状态响应式',
  schema: {
    libModules,
    states: [
      {
        desc: '响应式状态',
        name: 'title',
        initialValue: '响应式状态',
      },
      {
        desc: 'title长度',
        name: 'titleLength',
        initialValue: 0,
      },
    ],
    effects: [
      {
        dependences: [{ type: NodeType.STATE, name: 'title' }],
        effectStates: ['titleLength'],
        body: `
        setTitleLength(title.length)
        `,
      },
    ],
    compTree: [
      createComp(
        'ElRow',
        {},
        {
          slots: {
            default: creatAnonymousFunc({
              funcType: FuncTypeEnum.RENDERFUNC,
              renderFunc: {
                compTree: [
                  createComp(
                    'ElSpace',
                    {},
                    {
                      slots: {
                        default: createSlot({
                          compTree: [
                            createComp(
                              'ElText',
                              {},
                              {
                                slots: {
                                  default: createSlot({
                                    compTree: ['title值：'],
                                  }),
                                },
                              }
                            ),
                            createComp(
                              'ElText',
                              {},
                              {
                                slots: {
                                  default: createSlot({
                                    compTree: [createState({ name: 'title' })],
                                  }),
                                },
                              }
                            ),
                          ],
                        }),
                      },
                    }
                  ),
                ],
              },
            }),
          },
        }
      ),
      createComp(
        'ElRow',
        {},
        {
          slots: {
            default: createSlot({
              compTree: [
                createComp(
                  'ElSpace',
                  {},
                  {
                    slots: {
                      default: createSlot({
                        compTree: [
                          createComp(
                            'ElText',
                            {},
                            {
                              slots: {
                                default: createSlot({
                                  compTree: ['titleLength(effect监听改变)：'],
                                }),
                              },
                            }
                          ),
                          createComp(
                            'ElText',
                            {},
                            {
                              slots: {
                                default: createSlot({
                                  compTree: [
                                    createState({ name: 'titleLength' }),
                                  ],
                                }),
                              },
                            }
                          ),
                        ],
                      }),
                    },
                  }
                ),
              ],
            }),
          },
        }
      ),
      createComp(
        'ElRow',
        {},
        {
          slots: {
            default: createSlot({
              compTree: [
                createComp(
                  'ElSpace',
                  {},
                  {
                    slots: {
                      default: createSlot({
                        compTree: [
                          createComp(
                            'ElText',
                            {},
                            {
                              slots: {
                                default: createSlot({
                                  compTree: ['title长度(表达式)：'],
                                }),
                              },
                            }
                          ),
                          createComp(
                            'ElText',
                            {},
                            {
                              slots: {
                                default: createSlot({
                                  compTree: [
                                    creatAnonymousFunc({
                                      IIFE: true,
                                      dependences: [
                                        { type: NodeType.STATE, name: 'title' },
                                      ],
                                      func: {
                                        body: '(title || "").length',
                                      },
                                    }),
                                  ],
                                }),
                              },
                            }
                          ),
                        ],
                      }),
                    },
                  }
                ),
              ],
            }),
          },
        }
      ),
      createComp('ElInput', {
        modelValue: createState({
          name: 'title',
        }),
        ['onUpdate:modelValue']: creatAnonymousFunc({
          params: ['v'],
          effectStates: ['title'],
          func: {
            body: `setTitle(v)`,
          },
        }),
      }),
    ],
  },
});

// const testObj: SchemaRootObj = {
//     states: [
//       {
//         desc: '响应式状态',
//         name: 'title',
//         initialValue: '111',
//       },
//       {
//         desc: '状态依赖展示字符串',
//         name: 'titleLengthDesc',
//       },
//     ],
//     effects: [
//       {
//         desc: 'title和titleLengthDesc的状态依赖',
//         dependences: ['title'],
//         effectStates: [
//           {
//             name: 'titleLengthDesc',
//             value: 'return `字符串长度为：${this.title.length || 0}`',
//           },
//         ],
//       },
//     ],
//     compTree: [
//       {
//         id: id(),
//         packageName: 'element-plus',
//         componentName: 'ElConfigProvider',
//         props: {},
//         children: [
//           {
//             id: id(),
//             packageName: 'element-plus',
//             componentName: 'ElText',
//             props: {},
//             children: [
//               {
//                 id: id(),
//                 packageName: 'test',
//                 componentName: 'Text',
//                 props: {
//                   text: {
//                     type: 'JSExpression',
//                     state: 'title',
//                   },
//                 },
//               },
//             ],
//           },
//           {
//             id: id(),
//             packageName: 'element-plus',
//             componentName: 'ElText',
//             props: {},
//             children: [
//               {
//                 id: id(),
//                 packageName: 'test',
//                 componentName: 'Text',
//                 props: {
//                   text: {
//                     type: 'JSExpression',
//                     state: 'titleLengthDesc',
//                   },
//                 },
//               },
//             ],
//           },
//           {
//             id: id(),
//             packageName: 'element-plus',
//             componentName: 'ElInput',
//             props: {
//               modelValue: {
//                 type: 'JSExpression',
//                 state: 'title',
//               },
//               onInput: {
//                 type: 'JSFunction',
//                 params: ['v'],
//                 value: `this.onChangeState([['title',v]])`,
//                 effects: ['title'],
//               },
//             },
//           },
//           {
//             id: id(),
//             packageName: 'element-plus',
//             componentName: 'ElButton',
//             props: {
//               type: 'primary',
//               loading: true,
//               [SlotPrefix]: {
//                 loading: {
//                   type: 'JSFunction',
//                   params: [],
//                   children: [
//                     {
//                       id: id(),
//                       packageName: 'element-plus',
//                       componentName: 'ElTag',
//                       props: {
//                         type: 'success',
//                       },
//                       children: ['加载插槽'],
//                     },
//                   ],
//                 },
//               },
//             },
//             children: [
//               {
//                 id: id(),
//                 packageName: 'test',
//                 componentName: 'Text',
//                 props: {
//                   text: '哈哈哈哈',
//                 },
//               },
//             ],
//           },
//           {
//             id: id(),
//             packageName: 'test',
//             componentName: 'Button',
//             props: {
//               [SlotPrefix]: {
//                 default: {
//                   type: 'JSFunction',
//                   params: [],
//                   children: [
//                     {
//                       id: id(),
//                       packageName: 'element-plus',
//                       componentName: 'ElButton',
//                       children: ['default插槽'],
//                     },
//                   ],
//                 },
//                 test: {
//                   type: 'JSFunction',
//                   params: ['value'],
//                   children: [
//                     {
//                       id: id(),
//                       packageName: 'element-plus',
//                       componentName: 'ElButton',
//                       props: {
//                         type: 'primary',
//                       },
//                       children: [
//                         {
//                           type: 'JSExpression',
//                           paramns: [],
//                           value:
//                             '`test插槽-${JSON.stringify(this.scope.value.list)}`',
//                         },
//                       ],
//                     },
//                   ],
//                 },
//               },
//             },
//           },
//         ],
//       },
//     ],
//   };
