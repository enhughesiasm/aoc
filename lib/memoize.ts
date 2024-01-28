// haven't ended up using this yet, but...
// rather than using lodash, let's implement a basic memoizer using this technique
// (then improve this later!)
// https://boopathi.blog/memoizing-an-n-ary-function-in-typescript

export function memoize<Input, Result>(fn: (input: Input) => Result) {
  const memoMap = new Map<Input, Result>();
  return function (input: Input): Result {
    if (memoMap.has(input)) {
      return memoMap.get(input)!;
    }

    const result = fn(input);
    memoMap.set(input, result);
    return result;
  };
}

function uncurry2<A, B, R>(fn: (a: A) => (b: B) => R) {
  return (a: A, b: B) => fn(a)(b);
}

// uncurry into a 3 arity function
function uncurry3<A, B, C, R>(fn: (a: A) => (b: B) => (c: C) => R) {
  return (a: A, b: B, c: C) => fn(a)(b)(c);
}

// uncurry into a 4 arity function
function uncurry4<A, B, C, D, R>(
  fn: (a: A) => (b: B) => (c: C) => (d: D) => R
) {
  return (a: A, b: B, c: C, d: D) => fn(a)(b)(c)(d);
}

type Fn2<A, B, R> = (a: A, b: B) => R;
export function memoize2<A, B, R>(fn: Fn2<A, B, R>): Fn2<A, B, R> {
  return uncurry2(memoize((a: A) => memoize((b: B) => fn(a, b))));
}

type Fn3<A, B, C, R> = (a: A, b: B, c: C) => R;
export function memoize3<A, B, C, R>(fn: Fn3<A, B, C, R>): Fn3<A, B, C, R> {
  return uncurry3(
    memoize((a: A) => memoize((b: B) => memoize((c: C) => fn(a, b, c))))
  );
}
