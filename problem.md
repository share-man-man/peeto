# 问题记录

## core

### 同步导入所有组件，导致单文件打包结果过大

- 通过 Promise 异步加载 lib 包
- 通过 vite、webpack 等打包工具实现动态导入
- vite 的 import 的后面，需要明确加载的包名。否则启动、打包会报错

  - 错误代码

    ```jsx
    const getName = () => 'antd';
    const package = import(getName());
    ```

  - 正确代码

    ```jsx
    const package = import('antd');
    ```

### 解析 schema 时，如何准确判断对象是否为 NodeType 节点

1. 属性路径在 schemaNodePaths 中
2. 再根据属性的类型做相应的处理

### 嵌套渲染函数，如何获取外层作用域的变量

```jsx
render(_,record){
  return <Table columns={
    [
      {
        id:123,
        r:(){
          return record.name
        }
      }
    ]
  } />
}
```

- 解析 schema 时，将变量放到 ctx 对象，new Funciton 时透传 ctx

## render-react

### 解析 schema 后，返回的 dom，不能用 setState，否则 input 的输入框，不能输入中文，需要用 useMemo

- 错误代码

  ```jsx
  const [dom, setDom] = useState();
  useEffect(() => {
    setDom(parseRender());
  }, []);
  return dom;
  ```

- 正确代码

  ```jsx
  const dom = useMeno(() => {
    return parseRender();
  }, []);
  return dom;
  ```

### 不能使用 \*.jsx、\*.tsx 文件

- 原因
  - react17 及以上版本如果使用 jsx，会自动导入包：jsx-runtime。导致体积大了 20 多 kb
  - [官方解释](https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html)

## editor-react

### 自定义创建 ReactNode

1. 有一些组件，会改变子组件的 key，比如 antd.Button，会把 children 的 key 改为 '.$'+key

   - 在 onCreateNode 时，加入自定义的 key

2. demo/main 报错：`不能将类型“Element”分配给类型“ReactNode”`

   - 子组件引入了 vue 的包，导致 ts 校验出错，将引入 react 包的代码放在 vue 之前即可

3. enum already declared in the upper scope

   - eslint-prettier 的 bug，需要修改 eslint 的配置，[解决办法](https://github.com/typescript-eslint/typescript-eslint/issues/2484)

4. 点击 dom 时，如何知道此 dom 对应的是 schema 里的哪个组件

   - 获取组件和真实 dom 的映射关系

     - react、vue 等模拟器在虚拟 dom 重新创建成功后（onNodeChange），存储虚拟 dom
     - react、vue 等模拟器各自实现遍历虚拟 dom 方法，获取虚拟 dom 和 dom 的映射关系
     - 提供 getMap 方法，供父组件调用，返回映射关系

   - 监听编辑器的 hover 事件

   - 通过 hover 事件回调参数 e.target 的 dom 和映射里的 dom 是否相等或包含子节点，从而找到组件

5. 插件之间通信

   - 通过 addEventListener、removeEventListener 监听事件
   - 通过 getApi、setApi 方法，获取、设置扩展的 api
   - 通过 onMounted 方法，在扩展某一个工具挂载后进行通信（一般配合 getApi、setApi）

### 编辑器校验（schema 的校验函数）

- libModules.subs、states、events、refs、customHooks 里 name（alias） 都不能重复，且都必须是 camelCase 风格
- 匿名函数的参数不能和父级匿名函数参数、states 等重复
- 匿名函数的 params 和 dependence 不能相同
- 鉴别循环依赖
- schemaNodePaths 的路径都必须存在，且不能重复
- 树结构改变时，schemaNodePaths 也要跟着改变
- JSFunction 里，函数渲染的 params 在生成作用域时，需要校验 params 是否和上级、states、events、refs 等重名
- schema 里 id 不能重复

## render

### setState 设置值为一个组件

- 示例

  ```jsx
  const columns = useMemo(
    () => [
      {
        title: '操作',
        name: 'options',
        render: (text, record) => {
          return (
            <React.Fragment>
              <Button
                onClick={() => {
                  toDelete(record.name);
                }}
              >
                删除
              </Button>
            </React.Fragment>
          );
        },
      },
    ],
    []
  );
  ```

- 解决方案

  > 此方法是兜底方案，不符合低代码**所见即所得**的设计思路，暂未实现该方案

  具有开发能力的人可手写函数

  ```js
  // schema片段
  const schemaSnippets = {
    type: 'function',
    params: ['text', 'record'],
    body: 'return createNode(Button,{type:"primary",onClick:()=>{toDelete(record.id)}},"删除")',
  };
  // 转换函数
  parse(schemaSnippets);
  // 转换函数伪代码
  new Function(`
    const Button = this.library.antd.Button;
    const createNode = this.createNode
    return (${params.join(',')})=>{${body}}
  `).call({ library, createNode });
  ```

### 渲染函数：组件

- 示例

  ```jsx
  const renderFunc = () => {
    return <Tag color="error">ErrorTag</Tag>;
  };
  ```

- 解决方案

  - 匿名函数通过`funcType=FuncTypeEnum.RENDERFUNC`字段，判断是否为渲染函数

### 复杂的渲染函数：for 循环，三元表达式等

- 示例

  ```jsx
  <div>
    {showTitle && <h1>标题</h1>}
    {showText ? <text>文案1</text> : <text>文案2</text>}
    {list.map((i) => {
      return <div key={i.id}>{i.text}</div>;
    })}
  </div>
  ```

- 解决方案

  - 通过`renderFunc.conditionType`用相应的策略渲染
  - 目前支持的：数组、boolean、三元表达式（可用 boolean 实现）
  - 递归解析 renderFunc.compTree

### 自定义 hooks 问题

- 示例

  ```jsx
  const [form] = Form.useForm();
  const { scrollOffset, isBottom } = useScroll();
  ```

- 解决方案

  - customHooks 实现
  - 支持数组、对象解构
  - 支持依赖导入

    - 示例 json

      ```json
      [
        {
          effect: {
            body: 'Form.useForm()',
            dependences: [
              {
                type: SchemaEffectDependenceType.MODULE,
                name: 'Form',
              },
            ],
          },
          field: {
            type: FieldTypeEnum.ARR,
            [FieldTypeEnum.ARR]: ['form'],
          },
        },
      ]
      ```
