import { BehaviorSubject, Observable } from 'rxjs';

export interface StorageItem<T> extends AwaitableStorageItem<T> {
  get(): T;
  set(v: T): void;
}

export interface AwaitableStorageItem<T> {
  get(): Promise<T> | T;
  set(v: T): void;
}

export interface ObservableAwaitableStorageItem<T>
  extends AwaitableStorageItem<T> {
  asObservable(): Observable<T>;
  destructor(): void;
}

export abstract class BaseStorage {
  protected abstract prefix: string;

  getItem<S>(
    localKey: string,
    defaultValueFn: () => S
  ): AwaitableStorageItem<S> {
    return new LocalStorageStorageItem<S>(
      `${this.prefix}-${localKey}`,
      defaultValueFn
    );
  }

  getObservableItem<S>(
    localKey: string,
    defaultValueFn: () => S
  ): ObservableAwaitableStorageItem<S> {
    const valueSubject = new BehaviorSubject<S>(defaultValueFn());
    const storageItem = this.getItem(localKey, defaultValueFn);
    return {
      get(): S | Promise<S> {
        return storageItem.get();
      },
      set(v: S) {
        storageItem.set(v);
        valueSubject.next(v);
      },
      asObservable(): Observable<S> {
        return valueSubject;
      },
      destructor(): void {
        valueSubject.complete();
      },
    };
  }
}

class LocalStorageStorageItem<T> implements StorageItem<T> {
  private _value?: T;
  constructor(private key: string, private defaultFn: () => T) {}

  get(): T {
    if (this._value !== undefined) {
      return this._value;
    }
    const storageString = localStorage.getItem(this.key);
    if (storageString !== null) {
      this._value = JSON.parse(storageString) as T;
      return this._value;
    }
    this._value = this.defaultFn();
    return this._value;
  }

  set(v: T) {
    this._value = v;
    localStorage.setItem(this.key, JSON.stringify(v));
  }
}

// class IndexedDbStorageItem<T> implements AsyncStorageItem<T> {
