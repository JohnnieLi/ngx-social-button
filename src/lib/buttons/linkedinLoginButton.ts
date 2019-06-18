import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SocialService} from '../social.service';
import {SocialUser} from '../entities';

@Component({
    selector: 'linkedin-login-button',
    template: `
		<button [className]="style == 'round' ? 'social-btn linkedin' : 'button btn-block loginBtn --linkedin'"
		        (click)="socialSignIn()" type="button">
			{{style == 'round' ? '':  text ? text : 'Login with LinkedIn'}}
		</button>
    `, styleUrls: ['./buttons.css'],

})
export class LinkedinLoginButton implements OnInit {

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
        this.socialAuthService.signIn('linkedin', this.scopes).then(
            (userData) => {
                this.socialUser.emit(userData);
            }
        ).catch(() => {
            this.socialUser.emit(null);
        });
    }

}
