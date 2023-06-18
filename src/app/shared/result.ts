interface Ok<T = never> {
  readonly ok: true;
  value: T;
}

function Ok(): Ok;
function Ok<T>(value: T): Ok<T>;
function Ok<T>(value?: T) {
  return { ok: true, value };
}

interface Err<E> {
  readonly ok: false;
  error: E;
}

function Err<E>(error: E): Err<E> {
  return { ok: false, error };
}

type Result<T, E> = Ok<T> | Err<E>;

export { Ok, Err, Result };
