import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FunctionsRoutingModule } from './functions-routing.module';
import { FunctionsComponent } from './functions.component';

@NgModule({
  imports: [CommonModule, FunctionsRoutingModule, FunctionsComponent],
})
export class FunctionsModule {}
