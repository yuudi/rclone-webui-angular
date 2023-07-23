import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  AsyncValidatorFn,
  FormBuilder,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import {
  Subject,
  Subscription,
  debounceTime,
  distinctUntilChanged,
  first,
  map,
  switchMap,
} from 'rxjs';

import { CronService, Task } from '../cron.service';

@Component({
  selector: 'app-cron-editor',
  templateUrl: './cron-editor.component.html',
  styleUrls: ['./cron-editor.component.scss'],
})
export class CronEditorComponent implements OnInit, OnDestroy {
  cronForm = this.fb.nonNullable.group({
    advancedCron: [false],
    expression: ['', [Validators.required], [this.cronExpressionValidator()]],
    operation: [''],
    from: [''],
    to: [''],
  });
  @Input() task?: Task;
  @Output() taskChange = new EventEmitter<Task>();
  constructor(
    private fb: FormBuilder,
    private cronService: CronService,
  ) {}

  ngOnInit(): void {
    if (this.task) {
      this.patchTaskToForm(this.task);
    }
  }

  subscriptionGroup = new Subscription();

  ngOnDestroy(): void {
    this.subscriptionGroup.unsubscribe();
  }

  patchTaskToForm(task: Task): void {
    console.log(task);
    //TODO: implement
  }

  cronExpressionValidator(): AsyncValidatorFn {
    const inputSubject = new Subject<string>();
    const resultSubject = new Subject<ValidationErrors | null>();
    inputSubject
      .pipe(
        distinctUntilChanged(),
        debounceTime(1000),
        switchMap((expression) =>
          this.cronService.validateExpression(expression),
        ),
        map<boolean, ValidationErrors | null>((valid) =>
          valid ? null : { invalidCronExpression: true },
        ),
      )
      .subscribe(resultSubject);
    this.subscriptionGroup.add(inputSubject);
    this.subscriptionGroup.add(resultSubject);
    return (control) => {
      inputSubject.next(control.value);
      return resultSubject.pipe(first());
    };
  }

  async saveClicked() {
    const expression = this.cronForm.value.expression;
    const operation = this.cronForm.value.operation;
    if (!expression || !operation) {
      throw new Error('Invalid cron expression or operation');
    }
    let params;
    if (operation === 'sync') {
      params = {
        srcFs: this.cronForm.value.from,
        dstFs: this.cronForm.value.to,
        createEmptySrcDirs: true,
      };
    } else if (operation === 'move') {
      params = {
        srcFs: this.cronForm.value.from,
        dstFs: this.cronForm.value.to,
        createEmptySrcDirs: true,
        deleteEmptySrcDirs: false,
      };
    } else if (operation === 'bisync') {
      params = {
        path1: this.cronForm.value.from,
        path2: this.cronForm.value.to,
        resync: true,
        maxDelete: 100,
      };
    } else {
      throw new Error('Invalid operation');
    }
    const task = await this.cronService.toTask(
      expression,
      'sync/' + operation,
      params,
    );
    this.taskChange.emit(task);
  }
}
