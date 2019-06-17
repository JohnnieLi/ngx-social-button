import {
    Component, OnInit, Input, Output, EventEmitter, Inject, ElementRef, ViewChild,
    AfterViewInit
} from '@angular/core';
import {DOCUMENT} from '@angular/common';

import {SocialService} from '../social.service';

@Component({
    selector: 'linkedin-share-button',
    template: `
        <span #element></span>
    `,
})
export class LinkedinSharingButton implements AfterViewInit {

    @Input() share: any = {href: location.href};
    @Output() response = new EventEmitter<Boolean>();
    @ViewChild('element') element: ElementRef;

    constructor(private socialAuthService: SocialService,
                @Inject(DOCUMENT) private document: any) {
    }

    ngAfterViewInit() {
        // add linkedin share button script tag to element
        this.element.nativeElement.innerHTML = `<script type="IN/Share" data-url="${this.share.href}"></script>`;
        // render share button
        // window['IN'] && window['IN'].parse();
    }

}
