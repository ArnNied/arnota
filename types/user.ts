export type TAuthenticatedUser = {
  uid: string;
  username: string;
  email: string;
  emailVerified: boolean;
};

export type TUser = {
  username: string;
};

export type TUserWithUid = TUser & {
  uid: string;
};
