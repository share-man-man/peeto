# 问题记录

## parse

1. 同步导入所有组件，导致单文件打包结果过大。

   - 使用 Promise，异步导入组件。以便 vite、webpack 打包的项目动态倒入。vite 的 import 的后面，需要明确加载的包名，否则找不到包名，会报错

     - 错误代码

       ```jsx
       const getName = () => 'antd';
       const package = import(getName());
       ```

     - 正确代码

       ```jsx
       const package = import('antd');
       ```

## react-render

1. 解析 schema 后，返回的 dom，不能用 setState，否则 input 的输入框，不能输入中文，需要用 useMemo

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

2. 不能使用 jsx、tsx 文件，会导致打的包包含 jsx-runtime 的代码，导致体积大了 20 多 kb

## react-editor

1. 有一些组件，会改变子组件的 key，比如 antd.Button，会把 children 的 key 改为'.$'+key

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

   - 通过 hover 事件回调参数 e.target 的 dom 和映射里的 dom 是否相等或子节点，从而找到组件

5. 插件之间通信

   - 通过传入的参数 subscribeEvent(订阅)、dispatchEvent(分发事件)来实现通信

### 编辑器校验（schema 的校验函数）

- states 里 name 不能重复
- effects 里 dependences 必须从 states 里选择
- effects 里 parseEffects 长度必须等于 effects
- effects 里，effects 数组长度设为 1
- JSFunction 里，函数渲染的 params 在生成作用域时，需要校验 params 是否和上级重名
- schema 里 id 不能重复
