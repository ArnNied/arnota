import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  useAuthState,
  useSignInWithEmailAndPassword
} from 'react-firebase-hooks/auth';

import InputWithLabel from '@/components/shared/InputWithLabel';
import { auth } from '@/lib/firebase/core';
import { setAuthenticatedUserFunction } from '@/lib/utils';
import { useAppDispatch } from '@/store/hooks';

import type { NextPage } from 'next';

const LoginPage: NextPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [user, loading, error] = useAuthState(auth);
  const [signInWithEmailAndPassword, signInUser, signInLoading, signInError] =
    useSignInWithEmailAndPassword(auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // If user is already logged in, redirect to home page
  useEffect(() => {
    if (loading || !router.isReady) return;

    if (error) {
      console.log('Error getting authenticated user', error);
    } else if (user) {
      router
        .push('/')
        .then(() => console.log('User already logged in'))
        .catch((err) => console.log('Error redirecting', err));
    }
  }, [user, loading, error, router]);

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
      console.log('Failed to log in', error);
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
