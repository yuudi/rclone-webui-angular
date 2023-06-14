import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import {
  Connection,
  ConnectionService,
} from 'src/app/cores/remote-control/connection.service';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.scss'],
})
export class ConnectionComponent implements OnInit {
  connections$?: Observable<Connection[]>;

  constructor(
    private route: Router,
    private connectionService: ConnectionService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.connections$ = this.connectionService.getConnections();
  }

  onConnectionClicked(connection: Connection) {
    if (connection.authentication === undefined) {
      this.route.navigate(['connection', 'edit', connection.id]);
      return;
    }
    const result = this.connectionService.activateConnection(connection.id);
    if (result.ok) {
      this.route.navigate(['']);
      return;
    }
    this.snackBar.open(result.error, 'Dismiss');
  }
}
