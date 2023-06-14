export type Result<T, E> = Ok<T> | Err<E>;

export class Ok<T = null> {
  readonly ok = true;
  constructor(public value: T) {}
}

export class Err<E> {
  readonly ok = false;
  constructor(public error: E) {}
}
