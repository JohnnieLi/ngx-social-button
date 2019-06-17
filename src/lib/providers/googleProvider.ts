import {BaseLoginProviderImpl} from '../entities/baseLoginProviderImpl';
import {LoginProviderClass, SocialUser} from '../entities/user';

declare let gapi: any;

export class GoogleLoginProvider extends BaseLoginProviderImpl {

    public static readonly PROVIDER_TYPE = 'google';
    public loginProviderObj: LoginProviderClass = new LoginProviderClass();
    private auth2: any;
    public TYPE = 'google';

    constructor(private clientId: string) {
        super();
        this.loginProviderObj.id = clientId;
        this.loginProviderObj.name = 'google';
        this.loginProviderObj.url = 'https://apis.google.com/js/platform.js';
    }

    initialize(): Promise<SocialUser> {
        return new Promise((resolve, reject) => {
            this.loadScript(this.loginProviderObj, () => {
                gapi.load('auth2', () => {
                    this.auth2 = gapi.auth2.init({
                        client_id: this.clientId,
                        scope: 'email'
                    });

                    this.auth2.then(() => {
                        if (this.auth2.isSignedIn.get()) {
                            resolve(this.drawUser());
                        }
                    });
                });
            });
        });
    }

    drawUser(): SocialUser {
        const user: SocialUser = new SocialUser();
        const profile = this.auth2.currentUser.get().getBasicProfile();
        const authResponseObj = this.auth2.currentUser.get().getAuthResponse(true);
        user.id = profile.getId();
        user.name = profile.getName();
        user.email = profile.getEmail();
        user.image = profile.getImageUrl();
        user.accessToken = authResponseObj.access_token;
        user.idToken = authResponseObj.id_token;
        return user;
    }

    signIn(scopes?: [string]): Promise<SocialUser> {
        return new Promise((resolve, reject) => {
            const promise = this.auth2.signIn();
            promise.then(() => {
                resolve(this.drawUser());
            }).catch((err) => {
                reject(err);
            });
        });
    }

    signOut(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.auth2.signOut().then((err: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    sharing(share?: any): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve();
        });
    }
}
