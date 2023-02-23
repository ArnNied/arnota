import { doc, setDoc } from 'firebase/firestore';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';

import AuthForbiddenMixin from '@/components/mixin/AuthForbiddenMixin';
import InputWithLabel from '@/components/shared/InputWithLabel';
import { auth } from '@/lib/firebase/core';
import { usersCollection } from '@/lib/firebase/firestore';
import { useInitializeState } from '@/lib/hooks';
import { setAuthenticatedUserFunction } from '@/lib/utils';
import { useAppDispatch } from '@/store/hooks';

import type { NextPage } from 'next';

const RegisterPage: NextPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { authUser } = useInitializeState();
  const [
    createUserWithEmailAndPassword,
    ,
    registrationLoading,
    registrationError
  ] = useCreateUserWithEmailAndPassword(auth, { sendEmailVerification: true });

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault();

    if (registrationLoading) return;

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
    <AuthForbiddenMixin authUser={authUser} router={router}>
      <div className='h-full flex flex-col items-center justify-center'>
        <h1 className='w-fit p-4 font-bold text-4xl text-primary text-center'>
          <Link href='/' className='block p-4'>
            Arnota
          </Link>
        </h1>
        <div className='w-full max-w-[20rem] bg-white p-8 rounded shadow'>
          <h2 className='font-semibold text-2xl text-center'>Sign Up</h2>
          <form onSubmit={handleSubmit} className='w-full mt-4'>
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
              {!registrationLoading && 'Sign Up'}
            </button>
            <div className='my-4 border'></div>
            <p className='font-semibold'>
              Already have an account?{' '}
              <Link href='/login' className='text-primary'>
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </AuthForbiddenMixin>
  );
};

export default RegisterPage;
