from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from schemas import PipelineRequest, PipelineResponse
from pipeline import analyze_pipeline

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get('/')
def health():
    return {'ping': 'pong'}


@app.post('/pipelines/parse', response_model=PipelineResponse)
def parse_pipeline(req: PipelineRequest):
    return analyze_pipeline(req)
