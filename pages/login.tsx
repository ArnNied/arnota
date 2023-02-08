import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';

import { auth } from '@/lib/firebase/core';

import type { NextPage } from 'next';

const LoginPage: NextPage = () => {
  const router = useRouter();

  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault();

    const user = await signInWithEmailAndPassword(email, password);

    if (user) {
      console.log('User logged in', user);
      await router.push('/');
    } else console.log('Failed to log in', error);
  }

  return (
    <div className='p-4 bg-white rounded centered'>
      <h2 className='text-2xl text-center'>Login</h2>
      <form onSubmit={handleSubmit} className='mt-4'>
        <div className='space-y-1'>
          <label htmlFor='email'>Email</label>
          <input
            type='email'
            id='email'
            placeholder='Email'
            className='block w-full px-2 py-1 border-2 border-secondary focus:border-primary focus:outline-none rounded'
            autoComplete='off'
            onChange={(e): void => setEmail(e.target.value)}
          />
        </div>
        <div className='mt-2 space-y-1'>
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            id='password'
            placeholder='Password'
            className='block w-full px-2 py-1 border-2 border-secondary focus:border-primary focus:outline-none rounded'
            autoComplete='off'
            onChange={(e): void => setPassword(e.target.value)}
          />
        </div>
        <button
          type='submit'
          className='w-full mt-2 px-2 py-1 bg-primary text-white rounded'
        >
          {loading && 'Loading...'}
          {!loading && 'Login'}
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
