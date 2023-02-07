import { EditorContent } from '@tiptap/react';
import { AiOutlineBold, AiOutlineItalic } from 'react-icons/ai';

import TiptapExtensionButton from './TiptapExtensionButton';

import type { useEditor } from '@tiptap/react';

type TiptapProps = {
  editor: ReturnType<typeof useEditor>;
};

export default function Tiptap({ editor }: TiptapProps): JSX.Element {
  return (
    <div
      id='tiptap-editor-container'
      className='w-full bg-white border-2 border-secondary rounded'
    >
      <div className='p-1'>
        <TiptapExtensionButton
          Icon={AiOutlineBold}
          isActive={editor?.isActive('bold')}
          onClickHandler={(): boolean | undefined =>
            editor?.chain().focus().toggleBold().run()
          }
        />
        <TiptapExtensionButton
          Icon={AiOutlineItalic}
          isActive={editor?.isActive('italic')}
          onClickHandler={(): boolean | undefined =>
            editor?.chain().focus().toggleItalic().run()
          }
        />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
