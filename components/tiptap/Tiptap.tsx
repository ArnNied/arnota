import { Listbox, Popover } from '@headlessui/react';
import { EditorContent, FloatingMenu, BubbleMenu } from '@tiptap/react';
import { clsx } from 'clsx';
import { useState } from 'react';
import {
  AiOutlineBold,
  AiOutlineItalic,
  AiOutlineOrderedList,
  AiOutlineStrikethrough,
  AiOutlineUnorderedList
} from 'react-icons/ai';
import { BiHeading, BiImageAdd } from 'react-icons/bi';
import { IoMdQuote } from 'react-icons/io';
import { VscHorizontalRule } from 'react-icons/vsc';

import TiptapExtensionButton from './TiptapExtensionButton';

import type { Level } from '@tiptap/extension-heading';
import type { useEditor } from '@tiptap/react';

type TiptapProps = {
  editor: ReturnType<typeof useEditor>;
};

export default function Tiptap({ editor }: TiptapProps): JSX.Element {
  const [imagePrompt, setImagePrompt] = useState<{
    url: string;
    title: string;
  }>({
    url: '',
    title: ''
  });

  function handleAddImage(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();

    // TODO: add image title input
    if (imagePrompt.url) {
      editor?.chain().focus().setImage({ src: imagePrompt.url }).run();
    } else {
      alert('Image URL is cannot be empty.');
    }
  }

  return (
    <div id='tiptap-editor-container' className='w-full mt-4'>
      {editor && (
        <>
          <BubbleMenu
            editor={editor}
            className='flex flex-row p-1 bg-white sticky z-10'
          >
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
              Icon={AiOutlineStrikethrough}
              isActive={editor?.isActive('strike')}
              onClickHandler={(): boolean | undefined =>
                editor?.chain().focus().toggleStrike().run()
              }
            />
          </BubbleMenu>
          <FloatingMenu
            editor={editor}
            className='flex flex-row p-1 bg-white sticky z-10'
          >
            <Listbox
              defaultValue={1}
              onChange={(value): void =>
                void editor
                  ?.chain()
                  .focus()
                  .toggleHeading({ level: value as Level })
                  .run()
              }
            >
              <div className='relative'>
                <Listbox.Button as='div'>
                  <TiptapExtensionButton
                    Icon={BiHeading}
                    isActive={editor?.isActive('heading')}
                  />
                </Listbox.Button>
                <Listbox.Options className='mt-2 py-1 bg-white absolute'>
                  {[1, 2, 3].map((level) => (
                    <Listbox.Option
                      key={level}
                      value={level}
                      className={clsx(
                        'w-8 h-8 flex justify-center items-center hover:bg-secondary/50 active:bg-secondary cursor-pointer',
                        {
                          'text-primary': editor?.isActive('heading', { level })
                        }
                      )}
                    >
                      <BiHeading />
                      <span className='text-xs'>{level}</span>
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </Listbox>
            {/* <TiptapExtensionButton
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
            /> */}
            {/* TODO: Fix isActive state for nested element of OrderedList and BulletList extension */}
            <TiptapExtensionButton
              Icon={AiOutlineOrderedList}
              isActive={editor?.isActive('orderedList')}
              onClickHandler={(): boolean | undefined =>
                editor?.chain().focus().toggleOrderedList().run()
              }
            />
            <TiptapExtensionButton
              Icon={AiOutlineUnorderedList}
              isActive={editor?.isActive('bulletList')}
              onClickHandler={(): boolean | undefined =>
                editor?.chain().focus().toggleBulletList().run()
              }
            />
            <TiptapExtensionButton
              Icon={VscHorizontalRule}
              onClickHandler={(): boolean | undefined =>
                editor?.chain().focus().setHorizontalRule().run()
              }
            />
            <TiptapExtensionButton
              Icon={IoMdQuote}
              isActive={editor?.isActive('blockquote')}
              onClickHandler={(): boolean | undefined =>
                editor?.chain().focus().toggleBlockquote().run()
              }
            />
            {/* Image extension */}
            <Popover className='relative'>
              <Popover.Button
                as='div'
                className='group inline-flex items-center'
              >
                <TiptapExtensionButton Icon={BiImageAdd} />
              </Popover.Button>
              <Popover.Panel className='w-72 mt-3 p-2 bg-white rounded shadow shadow-primary/50 left-1/2 z-10 -translate-x-1/2 transform absolute'>
                <form
                  onSubmit={handleAddImage}
                  className='w-full flex flex-row space-x-2'
                >
                  <input
                    type='text'
                    placeholder='Image URL'
                    className='w-full px-2 py-1 border-b border-gray-500 focus:border-primary focus:outline-none'
                    onChange={(e): void =>
                      setImagePrompt({ ...imagePrompt, url: e.target.value })
                    }
                  />
                  <button
                    type='submit'
                    className='px-4 py-1 bg-primary text-white rounded'
                  >
                    Add
                  </button>
                </form>
              </Popover.Panel>
            </Popover>
          </FloatingMenu>
        </>
      )}
      <EditorContent editor={editor} />
    </div>
  );
}
