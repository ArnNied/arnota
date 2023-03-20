import { useEditor } from '@tiptap/react';
import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';

import MainLayout from '@/components/layouts/MainLayout';
import ExpandableInput from '@/components/note/ExpandableInput';
import NoteTopbarIsNotOwner from '@/components/note/NoteTopbarIsNotOwner';
import NoteTopbarIsOwner from '@/components/note/NoteTopbarIsOwner';
import Tiptap from '@/components/tiptap/Tiptap';
import { NOTE_CATEGORY_MAX_LENGTH, NOTE_TITLE_MAX_LENGTH } from '@/lib/config';
import { useInitializeState } from '@/lib/context/AuthContextProvider';
import { notesCollection, usersCollection } from '@/lib/firebase/firestore';
import { configuredEditor } from '@/lib/tiptap';
import {
  convertTagsListToString,
  convertTagsStringToList,
  simplifyNoteData
} from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updatePersonalNote } from '@/store/slices/personalNotesSlice';
import { ENoteVisibility } from '@/types/note';

import type { TNote, TEditableNote } from '@/types/note';
import type { TAuthenticatedUser, TUser } from '@/types/user';
import type { Content } from '@tiptap/core';
import type { NextPage } from 'next';

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
      setEditableNote((prev) => {
        return {
          ...prev,
          body: JSON.stringify(editor.getJSON())
        };
      });
    }
  });

  const { noteId } = router.query;

  const [owner, setOwner] = useState<TUser | TAuthenticatedUser>();
  const [originalNote, setOriginalNote] = useState<TNote>();
  const [editableNote, setEditableNote] = useState<TEditableNote>({
    title: '',
    category: '',
    tags: [],
    body: '',
    visibility: ENoteVisibility.PRIVATE
  });
  const [saveStatus, setSaveStatus] = useState<{
    type: 'normal' | 'error';
    message: string;
  }>({
    type: 'normal',
    message: ''
  });

  const filteredCategories = (): string[] => {
    if (editableNote.category === '') {
      return personalNotesSelector.categories;
    } else {
      return personalNotesSelector.categories.filter((category) =>
        category.toLowerCase().includes(editableNote.category.toLowerCase())
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

    if (editableNote.tags.length === 0) {
      return flattened;
    } else {
      // Return matching tags according to the last tag input
      // And exclude the tags that are already in the input
      return flattened.filter(
        (tag) =>
          tag
            .toLowerCase()
            .includes(
              editableNote.tags[editableNote.tags.length - 1].toLowerCase()
            ) &&
          !editableNote.tags
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
      setEditableNote({
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
            setEditableNote({
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
      originalNote?.title !== editableNote.title ||
      originalNote?.category !== editableNote.category ||
      originalNote?.tags !== editableNote.tags ||
      originalNote?.visibility !== editableNote.visibility ||
      originalNote?.body !== editableNote.body;

    if (!originalNote || !hasBeenEdited) return;

    console.log('Saving note');

    setSaveStatus({
      type: 'normal',
      message: 'Saving...'
    });

    const saveNoteTimeout = setTimeout(() => {
      const sanitizedTitle =
        editableNote.title.trim().slice(0, NOTE_TITLE_MAX_LENGTH) || 'Untitled';
      const sanitizedCategory = editableNote.category
        .trim()
        .slice(0, NOTE_CATEGORY_MAX_LENGTH);
      const sanitizedTags = editableNote.tags
        .map((tag) => tag.replace(/\s/g, ''))
        // Remove duplicate tags
        .filter(
          (tag, index, self) => self.indexOf(tag) === index && tag.length > 0
        );

      updateDoc(doc(notesCollection, noteId as string), {
        title: sanitizedTitle,
        category: sanitizedCategory,
        tags: sanitizedTags,
        body: editableNote.body,
        plainBody: editor?.getText(),
        visibility: editableNote.visibility,
        lastModified: serverTimestamp()
      })
        .then(() => {
          console.log('Document successfully updated!');
          console.log('Save success');

          setSaveStatus({
            type: 'normal',
            message: 'Save Successful'
          });

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

          setSaveStatus({
            type: 'error',
            message: 'Failed to save note'
          });
        });
    }, 2000);

    return () => {
      clearTimeout(saveNoteTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editableNote]);

  useEffect(() => {
    if (saveStatus.type === 'normal' && saveStatus.message.length > 0) {
      const saveNoteStatusTimeout = setTimeout(() => {
        setSaveStatus({
          type: 'normal',
          message: ''
        });
      }, 3000);

      return () => {
        clearTimeout(saveNoteStatusTimeout);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveStatus]);

  return (
    <MainLayout navbarCategories={personalNotesSelector.categories}>
      {isOwner ? (
        <NoteTopbarIsOwner
          status={saveStatus}
          isOwner={isOwner}
          originalNote={originalNote}
          editableNote={editableNote}
          setEditableNote={setEditableNote}
        />
      ) : (
        <NoteTopbarIsNotOwner
          owner={owner}
          isOwner={isOwner}
          originalNote={originalNote}
        />
      )}
      <div className='px-24 py-8 mt-12'>
        <h2 className='font-bold font-poppins text-4xl text-darker break-words'>
          <span
            className='w-full focus:outline-none block cursor-text empty:before:content-["Title:_Your_Captivating_Title"] empty:before:text-secondary'
            contentEditable={isOwner}
            suppressContentEditableWarning={true}
            onKeyUp={(e): void => {
              setEditableNote((prev) => {
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
            <ExpandableInput
              label='Category'
              cbLabel='Existing Categories'
              cbValue={editableNote.category}
              cbOptions={filteredCategories()}
              displayValue={editableNote.category}
              cbOnChange={(value): string => {
                const casted = value as string;

                setEditableNote((prev) => {
                  return {
                    ...prev,
                    category: casted
                  };
                });

                return casted;
              }}
              cbInputOnChange={(event): string => {
                setEditableNote((prev) => {
                  return {
                    ...prev,
                    category: event.target.value
                  };
                });

                return event.target.value;
              }}
              isEmpty={editableNote.category.length === 0}
              disabled={!isOwner}
              maxLength={NOTE_CATEGORY_MAX_LENGTH}
            />
          )}

          {(isOwner || originalNote?.tags?.length !== 0) && (
            <ExpandableInput
              label='Tags'
              cbLabel='Existing Tags'
              cbValue={editableNote.tags}
              cbOptions={filteredTags()}
              displayValue={convertTagsListToString(editableNote.tags)}
              cbOnChange={(value): string => {
                const casted = value as string[];

                // Because the Combobox value is tied to the input
                // We need to remove the second to last element
                // Since it is taken from the user's input
                // And the "value" contains said user input
                if (editableNote.tags.length !== 0) {
                  casted.splice(-2, 1);
                }

                setEditableNote((prev) => {
                  return {
                    ...prev,
                    tags: casted
                  };
                });

                return convertTagsListToString(editableNote.tags);
              }}
              cbInputOnChange={(event): string => {
                const tags = convertTagsStringToList(event.target.value);

                setEditableNote((prev) => {
                  return {
                    ...prev,
                    tags
                  };
                });

                return convertTagsListToString(tags);
              }}
              isEmpty={
                editableNote.tags.length === 0 || editableNote.tags[0] === ''
              }
              disabled={!isOwner}
            />
          )}
        </div>

        <Tiptap editor={editor} />
      </div>
    </MainLayout>
  );
};

export default NoteDetailPage;
