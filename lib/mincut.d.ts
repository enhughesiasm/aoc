declare module '@graph-algorithm/minimum-cut' {
  export function mincut<TEdge extends [any, any]>(
    edges: TEdge[]
  ): Generator<TEdge>;
}
