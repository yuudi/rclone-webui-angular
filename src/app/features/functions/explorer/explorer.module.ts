import { ClipboardModule } from '@angular/cdk/clipboard';
import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ExplorerRoutingModule } from './explorer-routing.module';
import { CopyDialogComponent } from './explorer-viewer/copy-dialog/copy-dialog.component';
import { DeleteConfirmDialogComponent } from './explorer-viewer/delete-confirm-dialog/delete-confirm-dialog.component';
import { ExplorerViewerComponent } from './explorer-viewer/explorer-viewer.component';
import { PathSplitterComponent } from './explorer-viewer/path-splitter/path-splitter.component';
import { RenameDialogComponent } from './explorer-viewer/rename-dialog/rename-dialog.component';
import { ExplorerComponent } from './explorer.component';

@NgModule({
  declarations: [
    ExplorerComponent,
    ExplorerViewerComponent,
    DeleteConfirmDialogComponent,
    PathSplitterComponent,
    RenameDialogComponent,
    CopyDialogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ClipboardModule,
    TextFieldModule,
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
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatBadgeModule,
  ],
})
export class ExplorerModule {}
