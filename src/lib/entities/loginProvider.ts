import { SocialUser } from './user';

export interface LoginProvider {
  TYPE: string;
  initialize(): Promise<SocialUser>;
  signIn(scopes?:[string]): Promise<SocialUser>;
  sharing(share?:any):Promise<any>;
  signOut(): Promise<any>;
}