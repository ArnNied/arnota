import { useEffect } from 'react';

import type { User } from 'firebase/auth';
import type { NextRouter } from 'next/router';

type AuthForbiddenMixinProps = {
  children: JSX.Element | JSX.Element[];
  authUser: User | null | undefined;
  router: NextRouter;
};

export default function AuthForbiddenMixin({
  children,
  authUser,
  router
}: AuthForbiddenMixinProps): JSX.Element {
  useEffect(() => {
    if (!router.isReady) return;

    if (authUser) {
      router
        .push('/')
        .then(() => console.log('User already logged in'))
        .catch((err) => console.log('Error redirecting', err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser, router.isReady]);

  return <>{children}</>;
}
