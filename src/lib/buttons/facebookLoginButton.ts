import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {SocialService} from '../social.service';
import { SocialUser } from '../entities';
@Component({
  selector: 'facebook-login-button',
  template: `
      <button class="button btn-block loginBtn --facebook" 
              (click)="socialSignIn()" type="button">
          Login with Facebook</button>
  `,
    styleUrls: ['./buttons.css'],
})
export class FacebookLoginButton implements OnInit {

  @Input() size: string;
  @Input() scopes: [string];
  @Output() socialUser = new EventEmitter<SocialUser>();

  constructor(private socialAuthService: SocialService) { }

  ngOnInit() {

  }

  public socialSignIn() {    
    this.socialAuthService.signIn('facebook', this.scopes).then(
      (userData:SocialUser) => {
        console.log("socialSignIn", userData);
       this.socialUser.emit(userData)
      }
    ).catch(()=>{
        this.socialUser.emit(null);
    });
  }

}
