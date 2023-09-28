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
       setDom(ParseRender());
     }, []);
     return dom;
     ```

   - 正确代码

     ```jsx
     const dom = useMeno(() => {
       return ParseRender();
     }, []);
     return dom;
     ```

2. 不能使用 jsx、tsx 文件，会导致打的包包含 jsx-runtime 的代码，导致体积大了 20 多 kb
