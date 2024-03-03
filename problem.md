# 问题记录

## parse

1. 弃用动态异步加载组件方案。vite 打包的项目，import 的后面，需要明确加载的包名，否则会报错

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

   - 在 onCreateNode 时，再包装一层抽象组件

2. demo/main 报错：`不能将类型“Element”分配给类型“ReactNode”`

   - 子组件引入了 vue 的包，导致 ts 校验出错，将引入 react 包的代码放在 vue 之前即可

3. enum already declared in the upper scope

   - eslint-prettier 的 bug，需要修改 eslint 的配置，[解决办法](https://github.com/typescript-eslint/typescript-eslint/issues/2484)

4. 点击 dom 时，如何知道此 dom 对应的是 schema 里的哪个组件

   - 获取组件和真实 dom 的映射关系

     - react、vue 等模拟器在 虚拟 dom 重新创建成功后（onNodeChange），存储虚拟 dom
     - react、vue 等模拟器监听真实 dom 修改（MutationObserver）
     - 真实 dom 修改后，通过虚拟 dom 创建映射关系
     - 上抛映射关系

   - 监听编辑器的 click 事件

   - 通过 click 事件回调参数 e.target（实际点击的 dom ）和映射里的 dom 是否相等，从而找到组件

### 编辑器校验（schema 的校验函数）

- states 里 name 不能重复
- effects 里 dependences 必须从 states 里选择
- effects 里 parseEffects 长度必须等于 effects
- effects 里，effects 数组长度设为 1
- JSFunction 里，函数渲染的 params 在生成作用域时，需要校验 params 是否和上级重名
- schema 里 id 不能重复
