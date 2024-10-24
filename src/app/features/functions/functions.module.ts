import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FunctionsRoutingModule } from './functions-routing.module';
import { FunctionsComponent } from './functions.component';

@NgModule({
  declarations: [FunctionsComponent],
  imports: [CommonModule, FunctionsRoutingModule],
})
export class FunctionsModule {}
