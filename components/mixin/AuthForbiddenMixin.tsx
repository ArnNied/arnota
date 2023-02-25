import { useEffect } from 'react';

import type { User } from 'firebase/auth';
import type { NextRouter } from 'next/router';

type AuthForbiddenMixinProps = {
  children: JSX.Element | JSX.Element[];
  authUserLoading: boolean;
  authUser: User | null | undefined;
  router: NextRouter;
};

export default function AuthForbiddenMixin({
  children,
  authUserLoading,
  authUser,
  router
}: AuthForbiddenMixinProps): JSX.Element {
  useEffect(() => {
    if (authUserLoading || !router.isReady) return;

    if (authUser) {
      router
        .push('/')
        .then(() => console.log('User already logged in'))
        .catch((err) => console.log('Error redirecting', err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUserLoading, authUser, router.isReady]);

  return <>{children}</>;
}
