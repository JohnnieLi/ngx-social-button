import { LoginProvider } from './loginProvider';
import { SocialUser, LoginProviderClass } from './user';

export abstract class BaseLoginProviderImpl implements LoginProvider {


    constructor() {}

  abstract initialize(): Promise<SocialUser>;
  abstract signIn(scopes?:[string]): Promise<SocialUser>;
  abstract signOut(): Promise<any>;
  abstract sharing(share?:any):Promise<any>;
  abstract TYPE: string;

  loadScript(obj: LoginProviderClass, onload: any): void {
    if (document.getElementById(obj.name)) { return; }
    let signInJS = document.createElement('script');
    signInJS.async = true;
    signInJS.src = obj.url;
    signInJS.onload = onload;
    if (obj.name === 'linkedin') {
      signInJS.async = false;
      signInJS.text = ('api_key: ' + obj.id).replace('\'', '');
    }
    document.head.appendChild(signInJS);
  }
}