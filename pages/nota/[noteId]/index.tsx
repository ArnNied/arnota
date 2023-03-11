import { Combobox, Listbox, Popover } from '@headlessui/react';
import { useEditor } from '@tiptap/react';
import { clsx } from 'clsx';
import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useEffect, useId, useMemo, useState } from 'react';
import {
  AiFillEye,
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineInfoCircle
} from 'react-icons/ai';
import { HiOutlineChevronDown } from 'react-icons/hi';

import MainLayout from '@/components/layouts/MainLayout';
import NoteTopbarIsNotOwner from '@/components/note/NoteTopbarIsNotOwner';
import NoteTopbarIsOwner from '@/components/note/NoteTopbarIsOwner';
import Topbar from '@/components/shared/Topbar';
import Tiptap from '@/components/tiptap/Tiptap';
import { NOTE_CATEGORY_MAX_LENGTH } from '@/lib/config';
import { notesCollection, usersCollection } from '@/lib/firebase/firestore';
import { useInitializeState } from '@/lib/hooks';
import { configuredEditor } from '@/lib/tiptap';
import {
  convertTagsListToString,
  convertTagsStringToList,
  formatDate,
  sanitizeNoteTags,
  simplifyNoteData
} from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updatePersonalNote } from '@/store/slices/personalNotesSlice';
import { ENoteVisibility } from '@/types/note';

import type { TNote } from '@/types/note';
import type { TAuthenticatedUser, TUser } from '@/types/user';
import type { Content } from '@tiptap/core';
import type { NextPage } from 'next';

const NoteVisibilityIconMap = {
  [ENoteVisibility.PUBLIC]: (
    <AiFillEye size='1.25em' className='fill-darker group-hover:fill-white' />
  ),
  [ENoteVisibility.LIMITED]: (
    <AiOutlineEye
      size='1.25em'
      className='fill-darker group-hover:fill-white'
    />
  ),
  [ENoteVisibility.PRIVATE]: (
    <AiOutlineEyeInvisible
      size='1.25em'
      className='fill-darker group-hover:fill-white'
    />
  )
};

const NoteDetailPage: NextPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { authUser, authUserLoading, personalNotesSelector } =
    useInitializeState();

  const authenticatedUserSelector = useAppSelector(
    (state) => state.authenticatedUser
  );

  const editor = useEditor({
    ...configuredEditor,
    onUpdate: ({ editor }) => {
      setEditedNote((prev) => {
        return {
          ...prev,
          body: JSON.stringify(editor.getJSON())
        };
      });
    }
  });

  const noteCategoryInputId = useId();
  const noteTagsInputId = useId();

  const { noteId } = router.query;

  const [owner, setOwner] = useState<TUser | TAuthenticatedUser>();
  const [originalNote, setOriginalNote] = useState<TNote>();

  const [editedNote, setEditedNote] = useState<
    Pick<TNote, 'title' | 'category' | 'tags' | 'body' | 'visibility'>
  >({
    title: '',
    category: '',
    tags: [],
    body: '',
    visibility: ENoteVisibility.PRIVATE
  });

  const filteredCategories = (): string[] => {
    if (editedNote.category === '') {
      return personalNotesSelector.categories;
    } else {
      return personalNotesSelector.categories.filter((category) =>
        category.toLowerCase().includes(editedNote.category.toLowerCase())
      );
    }
  };

  const filteredTags = (): string[] => {
    // ES2015 required
    // const flattened = [
    //   ...new Set(personalNotesSelector.notes.map((note) => note.tags).flat())
    // ];

    const flattened = personalNotesSelector.notes
      .map((note) => note.tags)
      .flat()
      .filter((value, index, self) => self.indexOf(value) === index);

    if (editedNote.tags.length === 0) {
      return flattened;
    } else {
      // Return matching tags according to the last tag input
      // And exclude the tags that are already in the input
      return flattened.filter(
        (tag) =>
          tag
            .toLowerCase()
            .includes(
              editedNote.tags[editedNote.tags.length - 1].toLowerCase()
            ) &&
          !editedNote.tags
            .map((tag) => tag.toLowerCase())
            .includes(tag.toLowerCase())
      );
    }
  };

  const isOwner = useMemo(() => {
    if (!authUser) return false;

    return (
      originalNote?.owner !== undefined && originalNote?.owner === authUser.uid
    );
  }, [authUser, originalNote?.owner]);

  // TODO: Add a listener for counting the number of favorites
  useEffect(() => {
    if (!router.isReady || !authenticatedUserSelector || authUserLoading) {
      return;
    }

    const isAnOwnedNote = personalNotesSelector.notes.find(
      (note) => note.id === noteId
    );

    if (isAnOwnedNote) {
      setOwner(authenticatedUserSelector);
      setOriginalNote(isAnOwnedNote);
      setEditedNote({
        title: isAnOwnedNote.title,
        category: isAnOwnedNote.category,
        tags: isAnOwnedNote.tags,
        body: isAnOwnedNote.body,
        visibility: isAnOwnedNote.visibility
      });
      editor?.commands.setContent(JSON.parse(isAnOwnedNote.body) as Content);
      editor?.setEditable(true);
    } else {
      const noteDocRef = doc(notesCollection, noteId as string);

      getDoc(noteDocRef)
        .then((noteDoc) => {
          if (noteDoc.exists()) {
            const noteDocData = simplifyNoteData(noteDoc.data());

            setOriginalNote(noteDocData);
            setEditedNote({
              title: noteDocData.title,
              category: noteDocData.category,
              tags: noteDocData.tags,
              body: noteDocData.body,
              visibility: noteDocData.visibility
            });

            editor?.commands.setContent(
              JSON.parse(noteDocData.body) as Content
            );
            editor?.setEditable(authUser?.uid === noteDocData.owner);

            // Get the owner of the note if it is not owned by the authenticated user
            const userDocRef = doc(usersCollection, noteDocData.owner);
            getDoc(userDocRef)
              .then((userDoc) => {
                if (userDoc.exists()) {
                  setOwner(userDoc.data());
                }
              })
              .catch((error) => {
                console.log("Error getting owner's document:", error);
              });
          } else {
            console.log('No such document!');
          }
        })
        .catch((error) => {
          console.log('Error getting document:', error);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    noteId,
    router.isReady,
    authUserLoading,
    personalNotesSelector,
    authenticatedUserSelector
  ]);

  useEffect(() => {
    const hasBeenEdited =
      originalNote?.title !== editedNote.title ||
      originalNote?.category !== editedNote.category ||
      originalNote?.tags !== editedNote.tags ||
      originalNote?.visibility !== editedNote.visibility ||
      originalNote?.body !== editedNote.body;

    if (!originalNote || !hasBeenEdited) return;

    console.log('Saving note');

    const saveNoteTimeout = setTimeout(() => {
      const sanitizedTitle =
        editedNote.title.trim().slice(0, 128) || 'Untitled';
      const sanitizedCategory = editedNote.category.trim().slice(0, 32);
      const sanitizedTags = sanitizeNoteTags(editedNote.tags);

      updateDoc(doc(notesCollection, noteId as string), {
        title: sanitizedTitle,
        category: sanitizedCategory,
        tags: sanitizedTags,
        body: editedNote.body,
        plainBody: editor?.getText(),
        visibility: editedNote.visibility,
        lastModified: serverTimestamp()
      })
        .then(() => {
          console.log('Document successfully updated!');
          console.log('Save success');

          getDoc(doc(notesCollection, noteId as string))
            .then((docSnap) => {
              if (docSnap.exists()) {
                const docData = simplifyNoteData(docSnap.data());
                setOriginalNote(docData);
                dispatch(updatePersonalNote(docData));
              }
            })
            .catch((err) => {
              console.log('Error getting document:', err);
            });
        })
        .catch((error) => {
          console.log('Error updating document:', error);
        });
    }, 2000);

    return () => {
      clearTimeout(saveNoteTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editedNote]);

  return (
    <MainLayout navbarCategories={personalNotesSelector.categories}>
      <Topbar align='between'>
        <p className='text-darker'>
          By: {owner?.username}
          {isOwner && <span className='ml-1 text-secondary'>(You)</span>}
        </p>
        <div className='flex flex-row items-center space-x-2'>
          {isOwner && (
            <Listbox value={editedNote.visibility}>
              <div className='relative'>
                <Listbox.Button className='w-28 flex flex-row items-center justify-between p-1 text-start rounded'>
                  <div className='flex flex-row items-center text-darker'>
                    <span className='mr-1'>
                      {editedNote.visibility &&
                        NoteVisibilityIconMap[editedNote.visibility]}
                    </span>{' '}
                    {editedNote.visibility}
                  </div>
                  <HiOutlineChevronDown size='1.25em' className='fill' />
                </Listbox.Button>
                <Listbox.Options
                  as='div'
                  className='w-28 absolute mt-2 py-1 bg-white rounded overflow-hidden'
                >
                  {Object.values(ENoteVisibility).map((visibility) => (
                    <Listbox.Option
                      as='button'
                      key={visibility}
                      value={visibility}
                      onClick={(): void =>
                        setEditedNote((prev) => {
                          return {
                            ...prev,
                            visibility
                          };
                        })
                      }
                      className='flex flex-row group'
                    >
                      <div className='w-28 flex flex-row items-center p-1 group-hover:bg-primary group-hover:text-white text-start'>
                        <span className='mr-1'>
                          {NoteVisibilityIconMap[visibility]}
                        </span>{' '}
                        {visibility}
                      </div>
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </Listbox>
          )}
          <Popover className='relative'>
            <Popover.Button className='group flex flex-row items-center focus:outline-none space-x-1'>
              <AiOutlineInfoCircle className='w-5 h-5 fill-secondary group-hover:fill-darker' />
              <p className='text-secondary group-hover:text-darker'>Details</p>
            </Popover.Button>
            <Popover.Panel
              className={clsx(
                'w-72 mt-3 p-4 bg-white rounded shadow shadow-primary/50 right-0 left-1/2 z-10 -translate-x-1/2 transform absolute'
              )}
            >
              {originalNote && (
                <>
                  <h3 className='font-bold text-xl mb-1'>Details</h3>
                  <p className='text-darker'>
                    Author: {owner?.username}
                    {isOwner && (
                      <span className='ml-1 text-secondary'>(You)</span>
                    )}
                  </p>
                  <p className='text-darker'>
                    Category:{' '}
                    {originalNote?.category || (
                      <span className='text-secondary'>None</span>
                    )}
                  </p>
                  <p className='text-darker'>
                    Tags:{' '}
                    {convertTagsListToString(originalNote?.tags) || (
                      <span className='text-secondary'>None</span>
                    )}
                  </p>
                  <p className='text-darker'>
                    Visibility: {originalNote?.visibility}
                  </p>
                  <p className='text-darker'>
                    Date Created: {formatDate(originalNote?.createdAt)}
                  </p>
                  <p className='text-darker'>
                    Last Modified: {formatDate(originalNote?.lastModified)}
                  </p>
                </>
              )}
            </Popover.Panel>
          </Popover>
          {isOwner ? (
            <NoteTopbarIsOwner
              router={router}
              dispatcher={dispatch}
              note={originalNote as TNote}
            />
          ) : (
            <NoteTopbarIsNotOwner
              router={router}
              dispatcher={dispatch}
              note={originalNote as TNote}
              authenticatedUserSelector={authenticatedUserSelector}
            />
          )}
        </div>
      </Topbar>
      <div className='px-24 py-8 mt-12'>
        <h2 className='font-bold font-poppins text-4xl text-darker break-words'>
          <span
            className='w-full focus:outline-none block cursor-text empty:before:content-["Title:_Your_Captivating_Title"] empty:before:text-secondary'
            contentEditable={isOwner}
            suppressContentEditableWarning={true}
            onKeyUp={(e): void => {
              setEditedNote((prev) => {
                return {
                  ...prev,
                  title: (e.target as HTMLHeadingElement).innerText
                };
              });
            }}
          >
            {originalNote?.title}
          </span>
        </h2>
        <div className='flex flex-row mt-2 space-x-4'>
          {(isOwner || originalNote?.category) && (
            <h3 className='flex flex-row items-center font-semibold text-sm italic text-secondary'>
              <label>Category: </label>
              <Combobox
                value={editedNote.category}
                onChange={(value): void => {
                  const spanActual = document.getElementById(
                    noteCategoryInputId
                  ) as HTMLSpanElement;

                  spanActual.innerText = value;
                  setEditedNote((prev) => {
                    return {
                      ...prev,
                      category: value
                    };
                  });
                }}
                disabled={!isOwner}
              >
                <div className='relative'>
                  {/* https://css-tricks.com/auto-growing-inputs-textareas/ */}
                  <div
                    id='input-grow-horizontal-wrapper'
                    className='min-w-[4rem] px-2 flex flex-row items-center relative'
                  >
                    <span
                      id={noteCategoryInputId}
                      aria-hidden='true'
                      className='min-w-[4rem] px-0.5 invisible empty:before:content-[""] before:inline-block whitespace-pre-wrap'
                    >
                      {editedNote.category}
                    </span>
                    <Combobox.Input
                      onChange={(event): void => {
                        const spanActual = document.getElementById(
                          noteCategoryInputId
                        ) as HTMLSpanElement;

                        spanActual.innerText = event.target.value;
                        setEditedNote((prev) => {
                          return {
                            ...prev,
                            category: event.target.value
                          };
                        });
                      }}
                      className={clsx(
                        'w-full min-w-[4rem] px-2 bg-inherit italic focus:outline-none absolute left-0',
                        {
                          'border-b border-secondary':
                            editedNote.category.length === 0
                        }
                      )}
                      maxLength={NOTE_CATEGORY_MAX_LENGTH}
                    />
                  </div>{' '}
                  <Combobox.Options className='w-full mt-1 py-2 bg-white text-darker not-italic rounded shadow space-y-1 absolute z-10'>
                    <p className='px-2 text-sm text-secondary'>
                      Existing Category:
                    </p>
                    <hr />
                    {filteredCategories().map((category) => (
                      <Combobox.Option
                        key={category}
                        value={category}
                        className={({ active }): string =>
                          clsx(
                            'px-2 hover:bg-primary hover:text-white break-words hover:cursor-pointer',
                            {
                              'bg-primary text-white': active
                            }
                          )
                        }
                      >
                        {category}
                      </Combobox.Option>
                    ))}
                  </Combobox.Options>
                </div>
              </Combobox>
            </h3>
          )}

          {(isOwner || originalNote?.tags?.length !== 0) && (
            <h3 className='flex flex-row items-center font-semibold text-sm italic text-secondary space-x-1'>
              <label>Tags: </label>
              <Combobox
                value={editedNote.tags}
                onChange={(value): void => {
                  const spanActual = document.getElementById(
                    noteTagsInputId
                  ) as HTMLSpanElement;

                  // Because the Combobox value is tied to the input
                  // We need to remove the second to last element
                  // Since it is taken from the user's input
                  // And the "value" value contains said user input
                  if (editedNote.tags.length !== 0) {
                    value.splice(-2, 1);
                  }

                  spanActual.innerText = convertTagsListToString(
                    editedNote.tags
                  );

                  setEditedNote((prev) => {
                    return {
                      ...prev,
                      tags: value
                    };
                  });
                }}
                disabled={!isOwner}
                multiple
              >
                <div className='relative'>
                  {/* https://css-tricks.com/auto-growing-inputs-textareas/ */}
                  <div
                    id='input-grow-horizontal-wrapper'
                    className='min-w-[4rem] px-2 flex flex-row items-center relative'
                  >
                    <span
                      id={noteTagsInputId}
                      aria-hidden='true'
                      className='min-w-[4rem] px-0.5 invisible empty:before:content-[""] before:inline-block whitespace-pre-wrap'
                    >
                      {convertTagsListToString(editedNote.tags)}
                    </span>
                    <Combobox.Input
                      onChange={(event): void => {
                        const spanActual = document.getElementById(
                          noteTagsInputId
                        ) as HTMLSpanElement;

                        console.log(
                          convertTagsStringToList(event.target.value)
                        );

                        spanActual.innerText = event.target.value;
                        setEditedNote((prev) => {
                          return {
                            ...prev,
                            tags: convertTagsStringToList(event.target.value)
                          };
                        });
                      }}
                      value={convertTagsListToString(editedNote.tags)}
                      className={clsx(
                        'w-full min-w-[4rem] px-2 bg-inherit italic focus:outline-none absolute left-0',
                        {
                          'border-b border-secondary':
                            editedNote.tags.length === 0 ||
                            editedNote.tags[0] === ''
                        }
                      )}
                    />
                  </div>{' '}
                  <Combobox.Options className='w-full mt-1 py-2 bg-white text-darker not-italic rounded shadow space-y-1 absolute z-10'>
                    <p className='px-2 text-sm text-secondary'>Existing Tag:</p>
                    <hr />
                    {filteredTags().map((tag) => (
                      <Combobox.Option
                        key={tag}
                        value={tag}
                        className={({ active }): string =>
                          clsx(
                            'px-2 hover:bg-primary hover:text-white break-words hover:cursor-pointer',
                            {
                              'bg-primary text-white': active
                            }
                          )
                        }
                      >
                        {tag}
                      </Combobox.Option>
                    ))}
                  </Combobox.Options>
                </div>
              </Combobox>
            </h3>
          )}
        </div>

        {/* <div className='mt-4 font-poppins text-darker whitespace-pre-wrap ProseMirror'>
          {parse(output ?? '')}
        </div> */}
        <Tiptap editor={editor} />
      </div>
    </MainLayout>
  );
};

export default NoteDetailPage;
