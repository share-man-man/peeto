import { Extension, ExtensionConfig } from '@peeto/extension';
import { EditorConfig } from './type';

export class Editor {
  /**
   * 编辑器配置
   */
  editorConfig?: EditorConfig;
  /**
   * 扩展集合
   */
  extensionMap = new Map<ExtensionConfig['name'], Extension>();
  /**
   * 加载中的插件数量
   */
  pendingExtensionNum: number = 0;

  constructor(c: EditorConfig) {
    this.editorConfig = c;
  }

  /**
   * 注册扩展
   */
  async injectExtension(extension: Extension) {
    if (this.extensionMap.has(extension.getName())) {
      throw new Error(`已注册扩展：${extension.getName()}`);
    }
    // 存储扩展实例
    this.extensionMap.set(extension.getName(), extension);
    this.editorConfig?.onInjectSuccess?.();
  }

  getExtensionByName(name: Extension['config']['name']): Extension | undefined {
    return this.extensionMap.get(name);
  }
}

export default Editor;
