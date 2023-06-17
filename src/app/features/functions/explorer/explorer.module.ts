import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ExplorerRoutingModule } from './explorer-routing.module';
import { ExplorerViewerComponent } from './explorer-viewer/explorer-viewer.component';
import { ExplorerComponent } from './explorer.component';
import { FilesSummaryPipe } from './files-summary.pipe';

@NgModule({
  declarations: [ExplorerComponent, ExplorerViewerComponent, FilesSummaryPipe],
  imports: [
    CommonModule,
    ExplorerRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatListModule,
    MatMenuModule,
    MatSnackBarModule,
    MatCardModule,
    MatToolbarModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
  ],
})
export class ExplorerModule {}
