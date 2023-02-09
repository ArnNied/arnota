import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  useAuthState,
  useCreateUserWithEmailAndPassword,
  useUpdateProfile
} from 'react-firebase-hooks/auth';

import InputWithLabel from '@/components/shared/InputWithLabel';
import { auth } from '@/lib/firebase/core';

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
  const [updateProfile, updating, updateProfileError] = useUpdateProfile(auth);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (loading || !router.isReady) return;
    if (error) console.log('Error in RegisterPage useEffect', error);
    else if (user)
      router
        .push('/')
        .then(() => console.log('User logged in'))
        .catch((err) => console.log('Error in RegisterPage useEffect', err));
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

      const updateProfileSuccess = await updateProfile({
        displayName: username
      });

      if (updateProfileSuccess)
        console.log('Profile updated', updateProfileSuccess);

      await router.push('/');
    } else console.log('User not created', registrationError);
  }

  return (
    <div className='p-4 bg-white rounded centered'>
      <h2 className='text-2xl text-center'>Register</h2>
      <form onSubmit={handleSubmit} className='mt-4'>
        <div className='space-y-2'>
          <InputWithLabel
            id='username'
            label='Username'
            type='text'
            onChangeHandler={(e): void => setUsername(e.target.value)}
          />
          <InputWithLabel
            id='email'
            label='Email'
            type='email'
            onChangeHandler={(e): void => setEmail(e.target.value)}
          />
          <InputWithLabel
            id='password'
            label='Password'
            type='password'
            placeholder='Password'
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
