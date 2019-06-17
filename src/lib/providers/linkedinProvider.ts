import {SocialUser, LoginProviderClass, LinkedInResponse} from '../entities/user';
import {BaseLoginProviderImpl} from '../entities/baseLoginProviderImpl';

declare let IN: any;

export class LinkedinLoginProvider extends BaseLoginProviderImpl {

    public static readonly PROVIDER_TYPE = 'linkedin';
    public loginProviderObj: LoginProviderClass = new LoginProviderClass();
    TYPE = 'linkedin';

    constructor(private clientId: string) {
        super();
        this.loginProviderObj.id = clientId;
        this.loginProviderObj.name = 'linkedin';
        this.loginProviderObj.url = 'https://platform.linkedin.com/in.js';
    }

    initialize(): Promise<SocialUser> {
        return new Promise((resolve, reject) => {
            this.loadScript(this.loginProviderObj, () => {
                IN.init({
                    api_key: this.clientId,
                    authorize: true,
                    onLoad: this.onLinkedInLoad()
                });

                IN.Event.on(IN, 'auth', () => {
                    if (IN.User.isAuthorized()) {
                        IN.API.Raw(
                            '/people/~:(id,first-name,last-name,email-address,picture-url)'
                        ).result((res: LinkedInResponse) => {
                            resolve(this.drawUser(res));
                        });
                    }
                });

            });
        });
    }

    onLinkedInLoad() {
        IN.Event.on(IN, 'systemReady', () => {
            IN.User.refresh();
        });
    }

    drawUser(response: LinkedInResponse): SocialUser {

        const user: SocialUser = new SocialUser();
        user.id = response.id;
        user.name = response.firstName + ' ' + response.lastName;
        user.email = response.emailAddress;
        user.image = response.pictureUrl;
        user.accessToken = IN.ENV.auth.oauth_token;
        return user;
    }

    signIn(): Promise<SocialUser> {
        return new Promise((resolve, reject) => {
            IN.User.authorize(() => {
                IN.API.Raw('/people/~:(id,first-name,last-name,email-address,picture-url)').result((res) => {
                    console.log('linkedin', res);
                    resolve(this.drawUser(res));
                });
            });
        });
    }

    signOut(): Promise<any> {
        return new Promise((resolve, reject) => {
            IN.User.logout((response: any) => {
                resolve();
            }, (err: any) => {
                reject(err);
            });
        });
    }


    sharing(share?: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const payload = {
                'comment': share ? share.comment : '',
                'visibility': {
                    'code': 'anyone'
                }
            };
            IN.API.Raw('/people/~/shares?format=json')
                .method('POST')
                .body(JSON.stringify(payload))
                .result(data => {
                    console.log('linkedin share', data);
                    resolve();
                })
                .error(onError => {
                    console.log('linkedin', onError);
                });
        });
    }

}
