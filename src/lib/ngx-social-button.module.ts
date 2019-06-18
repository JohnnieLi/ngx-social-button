import { NgModule } from '@angular/core';
import { FacebookLoginButton } from './buttons/facebookLoginButton';
import { GoogleLoginButton } from './buttons/googleLoginButton';
import {FacebookSharingButton} from './buttons/facebookSharingButton';
import {LinkedinLoginButton} from './buttons/linkedinLoginButton';
import {LinkedinSharingButton} from './buttons/linkedinSharingButton';

@NgModule({
    imports: [

    ],
    declarations: [FacebookLoginButton, GoogleLoginButton,
        FacebookSharingButton, LinkedinLoginButton,
        LinkedinSharingButton],
    exports: [FacebookLoginButton, GoogleLoginButton,
        FacebookSharingButton, LinkedinLoginButton,
        LinkedinSharingButton]
})
export class NgxSocialButtonModule { }
