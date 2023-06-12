import { Injectable } from '@angular/core';
import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';

import { ConnectionService } from 'src/app/cores/remote-control/connection.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private connectionService: ConnectionService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler) {
    const remoteAddress = this.connectionService.getRemoteAddress();
    // If remote address is not set, don't modify this request
    if (!remoteAddress) {
      return next.handle(req);
    }

    // If this request is not going to our API, don't modify it
    if (!req.url.startsWith(remoteAddress)) {
      return next.handle(req);
    }

    const authentication = this.connectionService.getBasicAuthorization();
    if (authentication === null) {
      return next.handle(req);
    }

    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Basic ${authentication}`),
    });
    return next.handle(authReq);
  }
}
