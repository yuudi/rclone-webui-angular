import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JobRoutingModule } from './job-routing.module';
import { JobComponent } from './job.component';


@NgModule({
  declarations: [
    JobComponent
  ],
  imports: [
    CommonModule,
    JobRoutingModule
  ]
})
export class JobModule { }
