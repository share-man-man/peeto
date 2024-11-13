// tsc编译的时候，识别不了.vue文件，所以需要声明一下
declare module '*.vue' {
  // import { DefineComponent } from 'vue';
  // const component: DefineComponent<{}, {}, any>;
  // export default component;
  import { Component } from 'vue';
  const component: Component;
  export default component;
}
