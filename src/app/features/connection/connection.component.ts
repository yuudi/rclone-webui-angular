import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import {
  Connection,
  ConnectionService,
  NotSaved,
} from 'src/app/cores/remote-control/connection.service';
import { ConnectionEditorComponent } from './connection-editor/connection-editor.component';
import { PromptPasswordComponent } from './prompt-password/prompt-password.component';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.scss'],
  imports: [
    CommonModule,
    MatListModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    ConnectionEditorComponent,
  ],
})
export class ConnectionComponent implements OnInit {
  connections$?: Observable<Connection[]>;
  selectedConnection?: Connection;

  constructor(
    private route: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private connectionService: ConnectionService,
  ) {}

  ngOnInit() {
    this.connections$ = this.connectionService.getConnections();
  }

  connectSelected(connection: Connection) {
    this.selectedConnection = connection;
  }

  async connectClicked(connection: Connection) {
    if (connection.authentication === NotSaved) {
      this.dialog.open(PromptPasswordComponent, {
        data: connection,
      });
      return;
    }
    try {
      await this.connectionService.activateConnection(connection.id);
      this.route.navigate(['']);
    } catch (err) {
      this.snackBar.open((err as Error).message, $localize`Dismiss`);
    }
  }

  async connectDeleted(connection: Connection) {
    try {
      await this.connectionService.deleteConnection(connection.id);
    } catch (err) {
      this.snackBar.open((err as Error).message, $localize`Dismiss`);
    }
  }
}
