import Editor from '@peeto/editor';
import { MutableRefObject, Ref } from 'react';
import { LeftToolBarRef } from './conponents/LeftToolBar';

export interface EditorWorkbenchActionRefType {
  editor?: Editor;
  onMounted: () => Promise<void>;
  leftToolBarRef: MutableRefObject<LeftToolBarRef>;
}
export interface EditorWorkbenchProps {
  actionRef: Ref<EditorWorkbenchActionRefType>;
}
