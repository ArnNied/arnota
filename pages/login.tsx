import { signInWithEmailAndPassword } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

import AuthForbiddenMixin from '@/components/mixin/AuthForbiddenMixin';
import InputWithLabel from '@/components/shared/InputWithLabel';
import SharedButton from '@/components/shared/SharedButton';
import { auth } from '@/lib/firebase/core';
import { useInitializeState } from '@/lib/hooks';
import { setAuthenticatedUserFunction } from '@/lib/utils';
import { useAppDispatch } from '@/store/hooks';

import type { NextPage } from 'next';

const LoginPage: NextPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { authUserLoading, authUser } = useInitializeState();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault();

    try {
      const signedInUser = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      setAuthenticatedUserFunction(signedInUser.user, dispatch).catch((err) => {
        console.log('Error setting authenticated user', err);
      });

      await router.push('/');
    } catch (err) {
      console.log('Error signing in', err);
    }
  }

  return (
    <AuthForbiddenMixin
      authUserLoading={authUserLoading}
      authUser={authUser}
      router={router}
    >
      <div className='h-screen flex flex-col items-center justify-center'>
        <h1 className='w-fit p-4 font-bold text-4xl text-primary text-center'>
          <Link href='/' className='block p-4'>
            Arnota
          </Link>
        </h1>
        <div className='w-full max-w-[20rem] bg-white p-8 rounded shadow'>
          <h2 className='font-semibold text-2xl text-center'>Sign In</h2>
          <form onSubmit={handleSubmit} className='w-full mt-4'>
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
            <SharedButton
              type='PRIMARY'
              text='Sign In'
              inputType='submit'
              additionalContainerClassName='w-full mt-2'
            />
            <div className='my-4 border'></div>
            <p className='font-semibold'>
              New to Arnota?{' '}
              <Link href='/register' className='text-primary'>
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </AuthForbiddenMixin>
  );
};

export default LoginPage;
