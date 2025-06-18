import Editor from '@peeto/editor';
import { MutableRefObject, Ref } from 'react';
import { LeftToolBarRef } from './components/LeftToolBar';

export interface EditorWorkbenchActionRefType {
  editor?: Editor;
  onMounted: () => Promise<void>;
  leftToolBarRef: MutableRefObject<LeftToolBarRef>;
  reload: () => void;
}
export interface EditorWorkbenchProps {
  actionRef: Ref<EditorWorkbenchActionRefType>;
}
