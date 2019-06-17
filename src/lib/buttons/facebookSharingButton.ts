import {Component, OnInit, Input, Output, EventEmitter, Inject} from '@angular/core';
import {DOCUMENT} from '@angular/common';

import {SocialService} from '../social.service';

@Component({
    selector: 'facebook-share-button',
    template: `
      <button class="button btn-block loginBtn --facebook" 
              (click)="sharing()" type="button">Share</button>
  `,
    styleUrls: ['./buttons.css'],
})
export class FacebookSharingButton implements OnInit {

    @Input() share: any = null;
    @Output() response = new EventEmitter<Boolean>();

    constructor(private socialAuthService: SocialService,
     @Inject(DOCUMENT) private document: any) { }

    ngOnInit() {

    }

    public sharing() {
        console.log(this.document.location.href);
        if(!this.share){
            this.share = {href:this.document.location.href}
        }else if(!this.share.href){
            this.share.href = this.document.location.href
        }
        this.socialAuthService.facebookSharing(this.share).then(()=>{
            this.response.emit(true);
        }).catch((err)=>{
            this.response.emit(false);
        });
    }

}
