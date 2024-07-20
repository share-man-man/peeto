# 低代码对比

| 特性                                                                       | peeto | 阿里低代码引擎                        |
| -------------------------------------------------------------------------- | ----- | ------------------------------------- |
| 实现 vue3 渲染器                                                           | ✅    | ❌                                    |
| 实现 react16 渲染器                                                        | ❌    | ✅                                    |
| 实现 react18 渲染器                                                        | ✅    | ❌                                    |
| 支持 react 插件                                                            | ✅    | ✅                                    |
| 支持 vue 插件                                                              | ✅    | ❌                                    |
| 原生状态管理（vue3=>ref、react18=>useState）                               | ✅    | ✅                                    |
| 原生副作用（vue3=>watchEffect、react18=>useEffect）                        | ✅    | ✅                                    |
| 原生引用 ref（vue3=>ref、react18=>useRef）                                 | ✅    | ✅                                    |
| 自定义创建节点(例如：vue 的 h 函数；react 的 jsx-runtime 和 createElement) | ✅    | ❌                                    |
| 支持其它 mvvm 库（solid、svelt）                                           | ✅    | ❌                                    |
| 安全解析 schema 节点，而非根据对象是否有特殊属性做判断                     | ✅    | ❌                                    |
| 异步加载包                                                                 | ✅    | ❌                                    |
| umd 导入包                                                                 | ✅    | ✅                                    |
| esm 导入包                                                                 | ✅    | ⚠️（需要配置 external，本质还是 umd） |
