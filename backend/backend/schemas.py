from pydantic import BaseModel
from typing import List


class NodeSchema(BaseModel):
    id: str
    type: str = ""
    data: dict = {}


class EdgeSchema(BaseModel):
    id: str
    source: str
    target: str


class PipelineRequest(BaseModel):
    nodes: List[NodeSchema]
    edges: List[EdgeSchema]


class PipelineResponse(BaseModel):
    num_nodes: int
    num_edges: int
    is_dag: bool
