import { EditorContent } from '@tiptap/react';
import { AiOutlineBold, AiOutlineItalic } from 'react-icons/ai';
import { clsx } from 'clsx';
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
        <button
          type='button'
          onClick={(): boolean | undefined =>
            editor?.chain().focus().toggleBold().run()
          }
          className='p-2 hover:bg-secondary/50 rounded active:bg-secondary'
        >
          <AiOutlineBold
            className={clsx({
              'fill-primary': editor?.isActive('bold'),
              'fill-darker': !editor?.isActive('bold')
            })}
          />
        </button>
        <button
          type='button'
          onClick={(): boolean | undefined =>
            editor?.chain().focus().toggleItalic().run()
          }
          className='p-2 hover:bg-secondary/50 rounded active:bg-secondary'
        >
          <AiOutlineItalic
            className={clsx({
              'fill-primary': editor?.isActive('italic'),
              'fill-darker': !editor?.isActive('italic')
            })}
          />
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
