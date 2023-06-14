import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ConnectionService } from 'src/app/cores/remote-control/connection.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private connectionService: ConnectionService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler) {
    const connection = this.connectionService.getActiveConnection();
    // If remote address is not set, don't modify this request
    if (!connection) {
      return next.handle(req);
    }

    const { remoteAddress, authentication } = connection;

    // If this request is not going to our API, don't modify it
    if (!req.url.startsWith(remoteAddress)) {
      return next.handle(req);
    }

    // If this request is already authenticated, don't modify it
    if (req.headers.has('Authorization')) {
      return next.handle(req);
    }

    if (authentication === null) {
      return next.handle(req);
    }

    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Basic ${authentication}`),
    });
    return next.handle(authReq);
  }
}
