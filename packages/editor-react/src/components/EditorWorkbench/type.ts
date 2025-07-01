import Editor from '@peeto/editor';
import { MutableRefObject, Ref } from 'react';
import { LeftToolBarRef } from './components/LeftToolBar';
import { RightToolBarRef } from './components/RightToolPanel';

export interface EditorWorkbenchActionRefType {
  editor?: Editor;
  onMounted: () => Promise<void>;
  leftToolBarRef: MutableRefObject<LeftToolBarRef>;
  rightToolBarRef: MutableRefObject<RightToolBarRef>;
  reload: () => void;
}
export interface EditorWorkbenchProps {
  actionRef: Ref<EditorWorkbenchActionRefType>;
}
