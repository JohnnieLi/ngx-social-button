import { BaseLoginProviderImpl } from '../entities/baseLoginProviderImpl';
import { SocialUser, LoginProviderClass } from '../entities/user';

declare let FB: any;

export class FacebookLoginProvider extends BaseLoginProviderImpl {

  public static readonly PROVIDER_TYPE = 'facebook';
  public static readonly SCOPES = {
    EMAIL : 'email',
    PUBLIC_PROFILE: 'public_profile'
  };

  public TYPE = 'facebook';
  public loginProviderObj: LoginProviderClass = new LoginProviderClass();

  constructor(private clientId: string) {
    super();
    this.loginProviderObj.id = clientId;
    this.loginProviderObj.name = 'facebook';
    this.loginProviderObj.url = 'https://connect.facebook.net/en_US/sdk.js';
  }

  initialize(): Promise<SocialUser> {
    return new Promise((resolve, reject) => {
      this.loadScript(this.loginProviderObj, () => {
          FB.init({
            appId: this.clientId,
            autoLogAppEvents: true,
            cookie: true,
            xfbml: true,
            version: 'v2.8'
          });
          FB.AppEvents.logPageView();

          FB.getLoginStatus(function (response: any) {
            if (response.status === 'connected') {
              const accessToken = FB.getAuthResponse()['accessToken'];
              FB.api('/me?fields=name,email,picture', (res: any) => {
                resolve(FacebookLoginProvider.drawUser(Object.assign({}, {token: accessToken}, res)));
              });
            }
          });
        });
    });
  }

  static drawUser(response: any): SocialUser {
    let user: SocialUser = new SocialUser();
    user.id = response.id;
    user.name = response.name;
    user.email = response.email;
    user.accessToken = response.accessToken;
    user.image = 'https://graph.facebook.com/' + response.id + '/picture?type=normal';
    return user;
  }


  signIn(scopes?:[string]): Promise<SocialUser> {
    return new Promise((resolve, reject) => {
      FB.login((response: any) => {
        console.log("facebook", response);
        if (response.authResponse) {
          const accessToken = FB.getAuthResponse()['accessToken'];
          FB.api('/me?fields=name,email,picture', (res: any) => {
            console.log("me", res);
            resolve(FacebookLoginProvider.drawUser(Object.assign({}, {accessToken: accessToken}, res)));
          });
        }
      }, { scope: scopes && scopes.length > 0 ? scopes.join(',') : 'email,public_profile' });
    });
  }

  sharing(share?:any): Promise<any>{
      return new Promise((resolve, reject) => {
            FB.ui({
                method: 'share',
                href: share.href,
                hashtag: (share.hashtag && share.hashtag.indexOf('#')>=0)?share.hashtag :  null
            }, function(response){
              console.log(response);
              resolve();
            });
      });
  }
  signOut(): Promise<any> {
    return new Promise((resolve, reject) => {
      FB.logout((response: any) => {
        resolve();
      });
    });
  }

}