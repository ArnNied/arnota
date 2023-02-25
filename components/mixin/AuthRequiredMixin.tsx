import { useEffect } from 'react';

import type { User } from 'firebase/auth';
import type { NextRouter } from 'next/router';

type AuthRequiredMixinProps = {
  children: JSX.Element | JSX.Element[];
  authUserLoading: boolean;
  authUser: User | null | undefined;
  router: NextRouter;
};

export default function AuthRequiredMixin({
  children,
  authUserLoading,
  authUser,
  router
}: AuthRequiredMixinProps): JSX.Element {
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
