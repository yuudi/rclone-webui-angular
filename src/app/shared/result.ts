abstract class BaseResult<T, E> {
  abstract readonly ok: boolean;

  abstract or(t: T): T;
  abstract orElse(fn: (e: E) => T): T;
  abstract orThrow(): T;
}

class OkResult<T> extends BaseResult<T, never> implements Ok<T> {
  readonly ok = true;
  constructor(readonly value: T) {
    super();
  }
  or() {
    return this.value;
  }
  orElse() {
    return this.value;
  }
  orThrow() {
    return this.value;
  }
}

class ErrResult<E> extends BaseResult<never, E> implements Err<E> {
  readonly ok = false;
  constructor(readonly error: E) {
    super();
  }
  or<T>(t: T) {
    return t;
  }
  orElse<T>(fn: (e: E) => T): T {
    return fn(this.error);
  }
  orThrow(): never {
    throw this.error;
  }
}

interface Ok<T = unknown> {
  readonly ok: true;
  value: T;
  orThrow(): T;
}

function Ok(): Ok<void>;
function Ok<T>(value: T): Ok<T>;
function Ok<T>(value?: T) {
  return new OkResult(value);
}

interface Err<E> {
  readonly ok: false;
  error: E;
  orThrow(): never;
}

function Err<E>(error: E): Err<E> {
  return new ErrResult(error);
}

type Result<T = unknown, E = unknown> = Ok<T> | Err<E>;

export { Ok, Err, Result };
