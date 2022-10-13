/* eslint-disable @typescript-eslint/no-explicit-any */
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void
  ? I
  : never;

type LastOf<T> = UnionToIntersection<T extends any ? () => T : never> extends () => infer R ? R : never;

type Push<T extends Array<any>, V> = [...T, V];

export type TuplifyStringLiteralUnion<
  T extends string,
  L = LastOf<T>,
  N = [T] extends [never] ? true : false,
> = true extends N ? [] : Push<TuplifyStringLiteralUnion<Exclude<T, L>>, L>;
