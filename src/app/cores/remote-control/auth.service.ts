import { Injectable } from '@angular/core';

type Credentials = {
  username: string;
  password: string;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  credentials: Credentials | null = null;

  setCredentials(credentials: Credentials) {
    this.credentials = credentials;
  }

  getCredentials(): Credentials | null {
    return this.credentials;
  }
}
