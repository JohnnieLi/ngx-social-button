import {Injectable} from '@angular/core';

import {BehaviorSubject, Observable} from 'rxjs';

import {LoginProvider} from './entities/loginProvider';
import {FacebookLoginProvider} from './providers/facebookProvider';
import {GoogleLoginProvider} from './providers/googleProvider';
import {LinkedinLoginProvider} from './providers/linkedinProvider';

import {SocialUser} from './entities/user';

export interface SocialServiceConfigItem {
    provider: LoginProvider;
}


export class SocialServiceConfig {
    private providers: Map<string, LoginProvider> = new Map<string, LoginProvider>();

    constructor(providers?: SocialServiceConfigItem[]) {
        if (providers) {
            for (let i = 0; i < providers.length; i++) {
                const element = providers[i];
                this.providers.set(element.provider.TYPE, element.provider);
            }
        }
    }

    getProviders() {
        return this.providers;
    }

    private addProvider(provider: LoginProvider) {
        if (!this.providers.get(provider.TYPE)) {
            this.providers.set(provider.TYPE, provider);
        }

    }

    addFacebook(clientId: string): SocialServiceConfig {
        this.addProvider(new FacebookLoginProvider(clientId));
        return this;
    }

    addGoogle(clientId: string): SocialServiceConfig {
        this.addProvider(new GoogleLoginProvider(clientId));
        return this;
    }

    addLinkedIn(clientId: string): SocialServiceConfig {
        this.addProvider(new LinkedinLoginProvider(clientId));
        return this;
    }

}

@Injectable({
    providedIn: 'root'
})
export class SocialService {

    private static readonly LOGIN_PROVIDER_NOT_FOUND = 'Login provider not found';
    private static readonly USER_POPUP_CLOSE = 'User close the popup';

    private providers: Map<string, LoginProvider>;

    private _user: SocialUser = null;
    private _authState: BehaviorSubject<SocialUser> = new BehaviorSubject(null);

    get authState(): Observable<SocialUser> {
        return this._authState.asObservable();
    }

    constructor(config: SocialServiceConfig) {
        this.providers = config.getProviders();
        this.providers.forEach((provider: LoginProvider, key: string) => {
            provider.initialize().then((user: SocialUser) => {
                user.provider = key;
                this._user = user;
                this._authState.next(user);
            }).catch((err) => {
                // this._authState.next(null);
            });
        });
    }

    isSocialLoggedIn() {
        return (this._user != null);
    }


    sharing(providerType: string, share?: any) {
        return new Promise((resolve, reject) => {
            let providerObject = this.providers.get(providerType);
            if (providerObject) {
                providerObject.sharing(share).then(() => {
                    resolve(true);
                });
            } else {
                reject(SocialService.LOGIN_PROVIDER_NOT_FOUND);
            }
        });
    }

    facebookSharing(share?: any) {
        return this.sharing('facebook', share);
    }

    // linkedinSharing(share?: any) {
    //     return this.sharing('linkedin', share);
    // }

    signIn(providerType: string, scopes?: [string]): Promise<SocialUser> {
        return new Promise((resolve, reject) => {
            let providerObject = this.providers.get(providerType);
            if (providerObject) {
                providerObject.signIn(scopes).then((user: SocialUser) => {
                    user.provider = providerType;
                    resolve(user);
                    this._user = user;
                    this._authState.next(user);
                }).catch((err) => {
                    reject(SocialService.USER_POPUP_CLOSE);
                });
            } else {
                reject(SocialService.LOGIN_PROVIDER_NOT_FOUND);
            }
        });
    }

    signOut(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this._user && this._user.provider) {
                let providerType = this._user.provider;
                let providerObject = this.providers.get(providerType);
                providerObject.signOut().then(() => {
                    this._user = null;
                    this._authState.next(null);
                    resolve();
                }).catch((err) => {
                    this._authState.next(null);
                });
            } else {
                reject(SocialService.LOGIN_PROVIDER_NOT_FOUND);
            }
        });
    }

}
