import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { useInitializeState } from '@/lib/context/AuthContextProvider';

type AuthRequiredMixinProps = {
  children: JSX.Element | JSX.Element[];
};

export default function AuthRequiredMixin({
  children
}: AuthRequiredMixinProps): JSX.Element {
  const router = useRouter();
  const { authUser, authUserLoading } = useInitializeState();

  useEffect(() => {
    console.log('1');
    if (authUserLoading || !router.isReady) return;

    console.log('2');

    if (authUser === null) {
      router
        .push('/login')
        .then(() => console.log('User not logged in'))
        .catch((err) => console.log('Error redirecting', err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUserLoading, authUser, router.isReady]);

  return <>{children}</>;
}
