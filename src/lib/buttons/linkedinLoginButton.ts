import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SocialService} from '../social.service';
import {SocialUser} from '../entities';

@Component({
    selector: 'linkedin-login-button',
    template: `
		<button class="btn-block loginBtn --linkedin"
		        (click)="socialSignIn()" type="button">
			Login with LinkedIn
		</button>
    `, styleUrls: ['./buttons.css'],

})
export class LinkedinLoginButton implements OnInit {

    @Input() size: string;
    @Input() scopes: [string];
    @Output() socialUser = new EventEmitter<SocialUser>();

    constructor(private socialAuthService: SocialService) {
    }

    ngOnInit() {

    }

    public socialSignIn() {
        this.socialAuthService.signIn('linkedin', this.scopes).then(
            (userData) => {
                this.socialUser.emit(userData);
            }
        ).catch(() => {
            this.socialUser.emit(null);
        });
    }

}
