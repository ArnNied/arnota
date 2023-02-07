import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  useAuthState,
  useCreateUserWithEmailAndPassword
} from 'react-firebase-hooks/auth';

import { auth } from '@/core/firebase';

import type { NextPage } from 'next';

const RegisterPage: NextPage = () => {
  const router = useRouter();

  const [user, loading, error] = useAuthState(auth);
  const [
    createUserWithEmailAndPassword,
    registrationUser,
    registrationLoading,
    registrationError
  ] = useCreateUserWithEmailAndPassword(auth, { sendEmailVerification: true });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (loading || !router.isReady) return;
    if (error) console.log('Error in RegisterPage useEffect', error);
    else if (user) void router.push('/');
  }, [user, loading, error, router]);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault();

    if (email === '' || password === '')
      return alert("Email or password can't be empty");
    else if (password.length < 6)
      return alert('Password must be at least 6 characters long');

    const registeredUser = await createUserWithEmailAndPassword(
      email,
      password
    );

    if (registeredUser) {
      console.log('User created', registeredUser);

      await router.push('/');
    } else console.log('User not created', registrationError);
  }

  return (
    <div className='p-4 bg-white rounded centered'>
      <h2 className='text-2xl text-center'>Register</h2>
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
          className='w-full mt-2 px-2 py-1 bg-primary bg-blend-overlay text-white rounded'
        >
          {registrationLoading && 'Loading...'}
          {!registrationLoading && 'Register'}
        </button>
        <div className='my-2 border'></div>
        <Link
          href='/login'
          className='block w-full px-2 py-1 bg-primary text-white text-center rounded'
        >
          Login
        </Link>
      </form>
    </div>
  );
};

export default RegisterPage;
