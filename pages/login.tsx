import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';

import InputWithLabel from '@/components/shared/InputWithLabel';
import { auth } from '@/lib/firebase/core';
import { useInitializeState } from '@/lib/hooks';
import { setAuthenticatedUserFunction } from '@/lib/utils';
import { useAppDispatch } from '@/store/hooks';

import type { NextPage } from 'next';

const LoginPage: NextPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { authUser } = useInitializeState();

  const [signInWithEmailAndPassword, , signInLoading, signInError] =
    useSignInWithEmailAndPassword(auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // If user is already logged in, redirect to home page
  useEffect(() => {
    if (authUser === undefined || !router.isReady) return;

    if (authUser) {
      router
        .push('/')
        .then(() => console.log('User already logged in'))
        .catch((err) => console.log('Error redirecting', err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser, router.isReady]);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault();

    const signedInUser = await signInWithEmailAndPassword(email, password);

    if (signedInUser) {
      console.log('User logged in', signedInUser);

      setAuthenticatedUserFunction(signedInUser.user, dispatch).catch((err) => {
        console.log('Error setting authenticated user', err);
      });

      await router.push('/');
    } else {
      console.log('Failed to log in', signInError);
    }
  }

  return (
    <div className='p-4 bg-white rounded centered'>
      <h2 className='text-2xl text-center'>Login</h2>
      <form onSubmit={handleSubmit} className='mt-4'>
        <div className='space-y-2'>
          <InputWithLabel
            id='email'
            label='Email'
            type='email'
            value={email}
            onChangeHandler={(e): void => setEmail(e.target.value)}
          />
          <InputWithLabel
            id='password'
            label='Password'
            type='password'
            placeholder='Password'
            value={password}
            onChangeHandler={(e): void => setPassword(e.target.value)}
          />
        </div>
        <button
          type='submit'
          className='w-full mt-2 px-2 py-1 bg-primary text-white rounded'
        >
          {signInLoading && 'Loading...'}
          {!signInLoading && 'Login'}
        </button>
        <div className='my-2 border'></div>
        <Link
          href='/register'
          className='block w-full px-2 py-1 bg-primary text-white text-center rounded'
        >
          Register
        </Link>
      </form>
    </div>
  );
};

export default LoginPage;
