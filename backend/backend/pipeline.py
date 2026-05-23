from schemas import PipelineRequest, PipelineResponse


def _is_dag(nodes, edges) -> bool:
    adj = {n.id: [] for n in nodes}
    for e in edges:
        if e.source in adj:
            adj[e.source].append(e.target)

    WHITE, GRAY, BLACK = 0, 1, 2
    color = {n.id: WHITE for n in nodes}

    for start in list(color):
        if color[start] != WHITE:
            continue
        stack = [(start, iter(adj.get(start, [])))]
        color[start] = GRAY
        while stack:
            node, neighbors = stack[-1]
            try:
                nxt = next(neighbors)
                c = color.get(nxt, BLACK)
                if c == GRAY:
                    return False
                if c == WHITE:
                    color[nxt] = GRAY
                    stack.append((nxt, iter(adj.get(nxt, []))))
            except StopIteration:
                color[node] = BLACK
                stack.pop()

    return True


def analyze_pipeline(req: PipelineRequest) -> PipelineResponse:
    return PipelineResponse(
        num_nodes=len(req.nodes),
        num_edges=len(req.edges),
        is_dag=_is_dag(req.nodes, req.edges),
    )
