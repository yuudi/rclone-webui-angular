import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import {
  Connection,
  ConnectionService,
  NotSaved,
} from 'src/app/cores/remote-control/connection.service';
import { PromptPasswordComponent } from './prompt-password/prompt-password.component';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.scss'],
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

  connectDeleted(connection: Connection) {
    this.connectionService.deleteConnection(connection.id);
  }
}
