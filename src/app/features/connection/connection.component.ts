import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import {
  Connection,
  ConnectionService,
  ConnectionWithAuthentication,
} from 'src/app/cores/remote-control/connection.service';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.scss'],
})
export class ConnectionComponent implements OnInit {
  connections$?: Observable<Connection[]>;

  constructor(private connectionService: ConnectionService) {}

  ngOnInit() {
    this.connections$ = this.connectionService.getConnections();
  }

  onConnectionClicked(connection: Connection) {
    if (connection.authentication === undefined) {
      connection.authentication = this.promptForAuthentication();
    }
    // the type of connection is now ConnectionWithAuthentication
    this.connectionService.activateConnection(
      connection as ConnectionWithAuthentication
    );
  }

  private promptForAuthentication(): string | null {
    return null;
  }
}
