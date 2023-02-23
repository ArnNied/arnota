import { useEffect } from 'react';

import type { User } from 'firebase/auth';
import type { NextRouter } from 'next/router';

type AuthRequiredMixinProps = {
  children: JSX.Element | JSX.Element[];
  authUser: User | null | undefined;
  router: NextRouter;
};

export default function AuthRequiredMixin({
  children,
  authUser,
  router
}: AuthRequiredMixinProps): JSX.Element {
  useEffect(() => {
    if (!router.isReady) return;

    if (authUser === null) {
      router
        .push('/login')
        .then(() => console.log('User not logged in'))
        .catch((err) => console.log('Error redirecting', err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser, router.isReady]);

  return <>{children}</>;
}
