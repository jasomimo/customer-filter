import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
    selector: '[appAutofocus]'
})
export class AutofocusDirective implements OnInit {

    constructor(private element: ElementRef) {
        
        if (!element.nativeElement['focus']) {
            throw Error('Focus cannot be applied to this element: ' + element.nativeElement['tagName']);
        }
    }

    ngOnInit() {
        const input = this.element.nativeElement as HTMLInputElement;
        input.focus();
    }
}
