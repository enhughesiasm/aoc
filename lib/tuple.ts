export type ShiftTuple<TTuple extends any[]> = TTuple extends [
  TTuple[0],
  ...infer TRest
]
  ? TRest
  : never;

export class TupleSet<TTuple extends any[]> {
  #set: Set<string>;

  constructor(iterable?: TTuple[] | TupleSet<TTuple> | Set<TTuple>) {
    if (!iterable) {
      this.#set = new Set<string>();
      return;
    }

    const strings = [...iterable].map((point) => JSON.stringify(point));
    this.#set = new Set<string>(strings);
  }

  get size() {
    return this.#set.size;
  }

  *[Symbol.iterator]() {
    for (const value of this.#set[Symbol.iterator]()) {
      yield JSON.parse(value) as TTuple;
    }
  }

  add(point: TTuple) {
    this.#set.add(JSON.stringify(point));
    return this;
  }

  clear() {
    this.#set.clear();
  }

  delete(point: TTuple) {
    return this.#set.delete(JSON.stringify(point));
  }

  *entries(): IterableIterator<[TTuple, TTuple]> {
    for (const [value1, value2] of this.#set.entries()) {
      yield [JSON.parse(value1), JSON.parse(value2)] as [
        point: TTuple,
        point: TTuple
      ];
    }
  }

  forEach(
    callbackfn: (
      point: TTuple,
      point2: TTuple,
      points: TupleSet<TTuple>
    ) => void,
    thisArg?: any
  ) {
    this.#set.forEach((value) => {
      const point = JSON.parse(value) as TTuple;
      callbackfn.call(thisArg, point, point, this);
    });
  }

  has(point: TTuple) {
    return this.#set.has(JSON.stringify(point));
  }

  *keys(): IterableIterator<TTuple> {
    for (const key of this.#set.keys()) {
      yield JSON.parse(key) as TTuple;
    }
  }

  *values(): IterableIterator<TTuple> {
    for (const value of this.#set.values()) {
      yield JSON.parse(value) as TTuple;
    }
  }
}
