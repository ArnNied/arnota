import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { useInitializeState } from '@/lib/context/AuthContextProvider';

type AuthForbiddenMixinProps = {
  children: JSX.Element | JSX.Element[];
};

export default function AuthForbiddenMixin({
  children
}: AuthForbiddenMixinProps): JSX.Element {
  const router = useRouter();
  const { authUser, authUserLoading } = useInitializeState();

  useEffect(() => {
    if (authUserLoading || !router.isReady) return;

    if (authUser) {
      void (async (): Promise<void> => {
        try {
          console.log('User already logged in');

          await router.push('/');
        } catch (err) {
          console.log('Error redirecting', err);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUserLoading, authUser, router.isReady]);

  return <>{children}</>;
}
