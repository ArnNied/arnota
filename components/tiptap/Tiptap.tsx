import { EditorContent } from '@tiptap/react';
import { AiOutlineBold, AiOutlineItalic } from 'react-icons/ai';
import { BiHeading } from 'react-icons/bi';

import TiptapExtensionButton from './TiptapExtensionButton';

import type { useEditor } from '@tiptap/react';

type TiptapProps = {
  editor: ReturnType<typeof useEditor>;
};

export default function Tiptap({ editor }: TiptapProps): JSX.Element {
  return (
    <div
      id='tiptap-editor-container'
      className='w-full border-2 border-secondary rounded'
    >
      <div className='flex flex-row p-1 bg-white sticky top-12 z-10'>
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
        <TiptapExtensionButton
          Icon={BiHeading}
          textAfter='1'
          isActive={editor?.isActive('heading', { level: 1 })}
          onClickHandler={(): boolean | undefined =>
            editor?.chain().focus().toggleHeading({ level: 1 }).run()
          }
        />
        <TiptapExtensionButton
          Icon={BiHeading}
          textAfter='2'
          isActive={editor?.isActive('heading', { level: 2 })}
          onClickHandler={(): boolean | undefined =>
            editor?.chain().focus().toggleHeading({ level: 2 }).run()
          }
        />
        <TiptapExtensionButton
          Icon={BiHeading}
          textAfter='3'
          isActive={editor?.isActive('heading', { level: 3 })}
          onClickHandler={(): boolean | undefined =>
            editor?.chain().focus().toggleHeading({ level: 3 }).run()
          }
        />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
