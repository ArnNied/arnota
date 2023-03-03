export type TAuthenticatedUser = {
  uid: string;
  username: string;
  email: string;
  emailVerified: boolean;
};

export type TUser = {
  id: string;
  username: string;
};
