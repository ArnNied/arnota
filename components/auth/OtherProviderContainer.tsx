import { clsx } from 'clsx';
import {
  signInWithPopup,
  GoogleAuthProvider,
  deleteUser,
  getAdditionalUserInfo,
  GithubAuthProvider
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { AiOutlineGithub } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';

import { auth } from '@/lib/firebase/core';
import { usersCollection } from '@/lib/firebase/firestore';
import { setAuthenticatedUserFunction } from '@/lib/utils';

import type { useAppDispatch } from '@/store/hooks';
import type { TUser } from '@/types/user';
import type { AuthProvider } from 'firebase/auth';
import type { NextRouter } from 'next/router';

const Providers = [
  {
    label: 'Google',
    provider: new GoogleAuthProvider(),
    icon: <FcGoogle className='w-8 h-8' />,
    buttonAdditionalClass: ''
  },
  {
    label: 'Github',
    provider: new GithubAuthProvider(),
    icon: <AiOutlineGithub className='w-8 h-8 fill-white' />,
    buttonAdditionalClass: 'bg-[#181717]'
  }
];

type OtherProviderContainerProps = {
  router: NextRouter;
  dispatcher: ReturnType<typeof useAppDispatch>;
  isRegistering: boolean;
};

export default function OtherProviderContainer({
  router,
  dispatcher,
  isRegistering
}: OtherProviderContainerProps): JSX.Element {
  async function handleProviderSignin(
    label: string,
    provider: AuthProvider
  ): Promise<void> {
    try {
      const user = await signInWithPopup(auth, provider);

      const userInfo = getAdditionalUserInfo(user);

      if (userInfo?.isNewUser) {
        try {
          const userDocRef = doc(usersCollection, user.user.uid);

          await setDoc(userDocRef, {
            username: user.user.displayName
          } as Omit<TUser, 'id'>);
        } catch (err) {
          await deleteUser(user.user);

          console.log(
            'Error setting new user document, delete registered user',
            err
          );
        }
      }
      setAuthenticatedUserFunction(user.user, dispatcher).catch((err) => {
        console.log('Error setting authenticated user', err);
      });

      await router.push('/');
    } catch (err) {
      console.log(`Error signing in with ${label} `, err);
    }
  }
  return (
    <div className='space-y-4'>
      <p className='font-semibold text-center'>
        {isRegistering ? 'Or sign up with' : 'Or sign in with'}
      </p>
      <div className='flex flex-row justify-center items-center space-x-2'>
        {Providers.map(({ label, provider, icon, buttonAdditionalClass }) => (
          <button
            key={label}
            type='button'
            className={clsx('p-1.5 rounded-full shadow', buttonAdditionalClass)}
            onClick={(): Promise<void> => handleProviderSignin(label, provider)}
          >
            {icon}
          </button>
        ))}
      </div>
    </div>
  );
}
