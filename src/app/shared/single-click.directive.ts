import {
  Directive,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';

import { Subject, bufferTime, filter } from 'rxjs';

@Directive({
  selector: '[appSingleClick]',
})
export class SingleClickDirective implements OnInit, OnDestroy {
  @Input() appSingleClickDelay = 500;
  @Output() appSingleClick = new EventEmitter<MouseEvent>();
  click$ = new Subject<MouseEvent>();

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.click$.next(event);
  }

  ngOnInit() {
    this.click$
      .pipe(
        bufferTime(this.appSingleClickDelay),
        filter((clicks) => clicks.length === 1)
      )
      .subscribe((clicks) => this.appSingleClick.emit(clicks[0]));
  }

  ngOnDestroy() {
    this.click$.unsubscribe();
  }
}
