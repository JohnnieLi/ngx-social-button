import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SocialService} from '../social.service';
import {SocialUser} from '../entities';

@Component({
    selector: 'google-login-button',
    template: `
		<button [className]="style == 'round' ? 'social-btn google' : 'button btn-block loginBtn --google'"
		        (click)="socialSignIn()" type="button">
			{{style == 'round' ? '':  text ? text : 'Login with Google'}}
		</button>
    `, styleUrls: ['./buttons.css'],

})
export class GoogleLoginButton implements OnInit {

    @Input() size: string;
    @Input() style: string;
    @Input() text: string;
    @Input() scopes: [string];
    @Output() socialUser = new EventEmitter<SocialUser>();

    constructor(private socialAuthService: SocialService) {
    }

    ngOnInit() {

    }

    public socialSignIn() {
        this.socialAuthService.signIn('google', this.scopes).then(
            (userData) => {
                this.socialUser.emit(userData);
            }
        ).catch(() => {
            this.socialUser.emit(null);
        });
    }

}
