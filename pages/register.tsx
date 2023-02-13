import { doc, setDoc } from 'firebase/firestore';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  useAuthState,
  useCreateUserWithEmailAndPassword
} from 'react-firebase-hooks/auth';

import InputWithLabel from '@/components/shared/InputWithLabel';
import { auth } from '@/lib/firebase/core';
import { usersCollection } from '@/lib/firebase/firestore';
import { setAuthenticatedUserFunction } from '@/lib/utils';
import { useAppDispatch } from '@/store/hooks';

import type { NextPage } from 'next';

const RegisterPage: NextPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [user, loading, error] = useAuthState(auth);
  const [
    createUserWithEmailAndPassword,
    registrationUser,
    registrationLoading,
    registrationError
  ] = useCreateUserWithEmailAndPassword(auth, { sendEmailVerification: true });

  const [username, setUsername] = useState('');
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

    if (email === '' || password === '') {
      return alert("Email or password can't be empty");
    } else if (password.length < 6) {
      return alert('Password must be at least 6 characters long');
    }

    const registeredUser = await createUserWithEmailAndPassword(
      email,
      password
    );

    if (registeredUser) {
      console.log('User created', registeredUser);

      try {
        const userDocRef = doc(usersCollection, registeredUser.user.uid);

        await setDoc(userDocRef, {
          username
        });

        setAuthenticatedUserFunction(registeredUser.user, dispatch).catch(
          (err) => {
            console.log('Error setting authenticated user', err);
          }
        );

        await router.push('/');
      } catch (error) {
        console.log(
          'Error setting new user document, delete registered user',
          error
        );

        await registeredUser.user.delete();
      }
    } else {
      console.log('User not created', registrationError);
    }
  }

  return (
    <div className='p-4 bg-white rounded centered'>
      <h2 className='text-2xl text-center'>Register</h2>
      <form onSubmit={handleSubmit} className='mt-4'>
        <div className='space-y-2'>
          <InputWithLabel
            id='username'
            label='Username'
            value={username}
            onChangeHandler={(e): void => setUsername(e.target.value)}
          />
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
