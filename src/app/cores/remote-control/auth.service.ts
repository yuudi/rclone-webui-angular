import { Injectable } from '@angular/core';

type Credentials = {
  username: string;
  password: string;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private remoteAddress: string | null = null;
  private authentication: string | null = null;

  constructor() {
    const remoteAddress = localStorage.getItem('remoteAddress');
    if (remoteAddress) {
      this.remoteAddress = remoteAddress;
    }

    const authentication = localStorage.getItem('authentication');
    if (authentication) {
      this.authentication = authentication;
    }
  }

  setRemoteAddress(remoteAddress: string, save = false) {
    this.remoteAddress = remoteAddress;
    if (save) {
      localStorage.setItem('remoteAddress', this.remoteAddress);
    }
  }

  getRemoteAddress() {
    return this.remoteAddress;
  }

  setCredentials(credentials: Credentials, save = false) {
    this.authentication = btoa(
      `${credentials.username}:${credentials.password}`
    );
    if (save) {
      localStorage.setItem('authentication', this.authentication);
    }
  }

  getBasicAuthorization(): string | null {
    return this.authentication;
  }

  clear() {
    this.remoteAddress = null;
    this.authentication = null;
    localStorage.removeItem('remoteAddress');
    localStorage.removeItem('authentication');
  }
}
