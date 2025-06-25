# 低代码对比

| 特性                                                                       | peeto    | 阿里低代码引擎                                                                               |
| -------------------------------------------------------------------------- | -------- | -------------------------------------------------------------------------------------------- |
| 周边生态                                                                   | ❌       | ✅                                                                                           |
| 社区活跃度                                                                 | ❌       | ✅                                                                                           |
| 解决问题速度                                                               | ❌       | ✅                                                                                           |
| 落地实践场景                                                               | ❌       | ✅                                                                                           |
| 子包拆分合理性                                                             | ✅       | ❌（lowcode-engine、lowcode-engine-ext、@alilc/lowcode-code-generator 等过于分散，不易维护） |
| 构建工具速度                                                               | ✅(vite) | ❌(webpack3/4)                                                                               |
| 实现 vue3 渲染器                                                           | ✅       | ❌                                                                                           |
| 实现 react16 渲染器                                                        | ❌       | ✅                                                                                           |
| 实现 react18 渲染器                                                        | ✅       | ❌                                                                                           |
| 原生状态管理（vue3=>ref、react18=>useState）                               | ✅       | ✅                                                                                           |
| 原生副作用（vue3=>watchEffect、react18=>useEffect）                        | ✅       | ✅                                                                                           |
| 原生引用 ref（vue3=>ref、react18=>useRef）                                 | ✅       | ✅                                                                                           |
| 自定义创建节点(例如：vue 的 h 函数；react 的 jsx-runtime 和 createElement) | ✅       | ❌                                                                                           |
| 支持其它 mvvm 库（solid、svelt）                                           | ✅       | ❌                                                                                           |
| 安全解析 schema 节点，而非根据对象是否有特殊属性做判断                     | ✅       | ❌                                                                                           |
| 异步加载 ui 包                                                             | ✅       | ❌                                                                                           |
| umd 导入包                                                                 | ✅       | ✅                                                                                           |
| esm 导入包                                                                 | ✅       | ⚠️（需要配置 external，本质还是 umd）                                                        |
| 包体积                                                                     | ✅       | ⚠️（强依赖 fusion、moment、react-dom、prop-types、react 等包）                               |
| 条件渲染-隐藏                                                              | ✅       | ✅                                                                                           |
| 条件渲染-数组                                                              | ✅       | ✅                                                                                           |
| 实时编辑（修改配置后，立即无感更新 ui）                                    | ❌       | ✅                                                                                           |
| 支持 react 插件                                                            | ✅       | ✅                                                                                           |
| 支持 vue 插件                                                              | ✅       | ❌                                                                                           |
| 支持其他 ui 库插件                                                         | ✅       | ❌                                                                                           |
