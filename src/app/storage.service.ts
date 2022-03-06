import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private storageSub = new Subject<String>();
  watchStorage = this.storageSub.asObservable();

  constructor() {}

  setItem(key: string, data: any) {
    localStorage.setItem(key, data);
    this.storageSub.next(key);
  }

  removeItem(key) {
    localStorage.removeItem(key);
    this.storageSub.next('changed');
  }
}
