import { Injectable } from '@angular/core';

import { BaseStorage } from './base-storage';

@Injectable({
  providedIn: 'root',
})
export class AppStorageService extends BaseStorage {
  protected prefix = 'rwa';
}
