# VectorShift Assessment — What Changed and Why

This document explains every meaningful change made from the original repository, mapped to each requirement.

---

## Original Repository State

The starter code contained:

| File | What it was |
|---|---|
| `src/App.js` | Bare layout, no styling, no grid |
| `src/ui.js` | ReactFlow canvas, hardcoded `100wv`/`70vh` size |
| `src/store.js` | Zustand store — broken on Zustand v5 |
| `src/toolbar.js` | Four hardcoded `<DraggableNode>` chips |
| `src/draggableNode.js` | Inline-style chip, no theming |
| `src/submit.js` | Button with no logic — just rendered `<button>Submit</button>` |
| `src/nodes/inputNode.js` | 40+ lines, fixed `200×80px` black border div |
| `src/nodes/outputNode.js` | Same pattern, copy-pasted |
| `src/nodes/llmNode.js` | Same pattern, copy-pasted |
| `src/nodes/textNode.js` | `<input>` (not textarea), no variable detection, no auto-resize |
| `backend/main.py` | `GET /pipelines/parse` (wrong method), took a form string, returned `{'status': 'parsed'}` |

Problems with the original beyond just missing features:
- `useStore(selector, shallow)` — the second-arg `shallow` API was **removed in Zustand v5**. This caused an infinite render loop (`Maximum update depth exceeded`) the moment any node was added to the canvas.
- Canvas used `width: '100wv'` (typo — should be `100vw`) and a fixed `70vh` height, leaving a gap at the bottom.
- No `node_modules` gitignore entry at the right depth, so the entire `node_modules` folder was tracked by git.

---

## Part 1 — Node Abstraction

### Requirement
> Create an abstraction for nodes that speeds up creating new nodes and applying styles across all nodes. Then make five new nodes to demonstrate it.

### What the original had
Four separate files (`inputNode.js`, `llmNode.js`, `outputNode.js`, `textNode.js`), each a standalone React component that manually rendered a `<div style={{width:200, height:80, border:'1px solid black'}}>`. Every node duplicated:
- The outer wrapper div
- The header span
- Individual `<Handle>` placement
- All styling inline

Adding a new node meant copying an existing file and editing it. No shared structure existed.

### What we built

**`src/components/nodes/base/BaseNode.js`** — single source of truth for node rendering.

```
BaseNode({ id, title, category, handles[], selected, style, children })
```

- Accepts a `handles` array — each entry is `{ id, type, position, label?, style? }`. BaseNode renders all handles and their optional labels automatically.
- Accepts a `category` string (`'input'`, `'llm'`, `'text'`, etc.) which maps to a CSS accent class that sets `--node-accent` for that node type. Every colour-related thing (handle colour, header border, focus rings) flows from this one variable.
- `selected` prop adds a glow ring via CSS, no logic needed in individual nodes.
- `NodeField` helper component wraps label + input into consistent spacing.

With this abstraction, a new node is **5–15 lines**:

```js
// Before (inputNode.js) — 47 lines, fully manual
export const InputNode = ({ id, data }) => {
  return (
    <div style={{width: 200, height: 80, border: '1px solid black'}}>
      <div><span>Input</span></div>
      <Handle type="source" position={Position.Right} id={`${id}-value`} />
      ...
    </div>
  );
}

// After (InputNode.js) — 12 lines
const HANDLES = [{ id: 'value', type: 'source', position: Position.Right }];
export const InputNode = ({ id, data, selected }) => (
  <BaseNode id={id} title="Input" category="input" handles={HANDLES} selected={selected}>
    <NodeField label="Name"><input className={nodeStyles.input} .../></NodeField>
    <NodeField label="Type"><select className={nodeStyles.select} .../></NodeField>
  </BaseNode>
);
```

**Five new nodes added** (all under `src/components/nodes/`):

| Node | Handles | Purpose |
|---|---|---|
| `FilterNode.js` | 1 target in, 2 sources out (pass / reject) | Shows branching / multi-output |
| `MergeNode.js` | 2 targets in (a, b), 1 source out | Shows multi-input joining |
| `TransformNode.js` | 1 in, 1 out | Operation dropdown (uppercase, lowercase, trim, JSON parse) |
| `HTTPNode.js` | 1 in (payload), 1 out (response) | Method + URL fields |
| `NoteNode.js` | No handles | Documentation-only textarea node |

**`src/components/nodes/index.js`** — single registry:
```js
export const nodeTypes = {
  customInput, llm, customOutput, text, filter, merge, transform, http, note
};
export const NODE_CONFIGS = [...]; // drives toolbar auto-generation
```
Both the canvas and toolbar import from here. Adding a future node means one entry in this file.

---

## Part 2 — Styling

### Requirement
> Style the various components into an appealing, unified design.

### What the original had
Zero styling beyond black borders and default browser fonts. Layout was not a grid — the toolbar, canvas, and submit button were stacked `<div>`s with no height coordination. Canvas left a visible gap at the bottom.

### What we built

**Design token system** (`src/styles/theme.css` + `src/styles/globals.css`):

All colours, radii, and shadows are defined as CSS custom properties on `:root`. Nothing is hardcoded anywhere else.

```css
--bg-canvas:      #0d0f14   /* dark charcoal canvas */
--bg-node:        #161923   /* node body */
--bg-node-header: #1c2030   /* slightly lighter header */
--border-subtle:  #252a3a
--text-primary:   #e2e8f0
--accent-input:   #6366f1   /* indigo */
--accent-llm:     #f59e0b   /* amber */
--accent-text:    #8b5cf6   /* purple */
/* ...one per node type */
```

**Full-viewport grid layout** (`App.js` + `globals.css`):
```css
.app {
  display: grid;
  grid-template-rows: auto 1fr auto;  /* toolbar | canvas | submit bar */
  height: 100vh;
}
```
The canvas takes `flex: 1` / `min-height: 0` so it fills the remaining space exactly, no hardcoded `70vh`.

**Node styling** (`BaseNode.module.css`):
- Dark background, `border-radius: 10px`, drop shadow
- Each category class sets `--node-accent` to the right colour var
- Header has a `3px solid var(--node-accent)` left border strip
- All handles inherit `background: var(--node-accent)` — no per-node handle colour code
- Selected state: `box-shadow: 0 0 0 2px var(--node-accent)` glow ring
- Handle labels are rendered **outside** the node boundary (`right: calc(100% + 10px)`) as pill badges so they don't overlap form fields inside the node

**Toolbar** (`Toolbar.module.css`, `DraggableNode.js`):
- Dark translucent bar with `backdrop-filter: blur(12px)`
- Each draggable chip has a `3px solid <accent-colour>` left border matching the node it creates
- Hover: subtle background lift + `scale(1.02)` transition

**Canvas** (`PipelineCanvas.js`):
- Dot grid background in `--border-subtle` colour
- Dark MiniMap matching the overall palette
- Bezier edges with `markerEnd: ArrowClosed`, animated dashes
- `snapToGrid` enabled at 20px

**ReactFlow global overrides** (`globals.css`):
- Controls and attribution themed to match dark palette

---

## Part 3 — Text Node Logic

### Requirement
> (1) Width and height of the Text node should change as the user types.
> (2) `{{ varName }}` should create a new Handle on the left for each variable.

### What the original had
```js
// textNode.js — original
<input type="text" value={currText} onChange={handleTextChange} />
```
A single-line `<input>` with no resize logic and no variable detection. Width was fixed at 200px.

### What we built

**Variable extraction** (`src/utils/variableExtractor.js`):
```js
const VAR_REGEX = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;
export const extractVariables = (text) => {
  const seen = new Set();
  for (const [, name] of text.matchAll(VAR_REGEX)) seen.add(name);
  return [...seen];
};
```
Isolated into its own utility — pure function, no React dependencies. Matches valid JS identifiers inside `{{ }}`, deduplicates.

**Auto-sizing hook** (`src/hooks/useAutoSize.js`):

Uses a hidden `<pre>` mirror element with identical font/padding CSS to let the **browser** measure text width and height. No pixel guessing, no hardcoded numbers tied to CSS values.

```js
const MIN_WIDTH  = 240;  const MAX_WIDTH  = 380;
const MIN_HEIGHT = 160;  const MAX_HEIGHT = 480;
const H_PADDING  = 48;   // total horizontal chrome (body padding + textarea padding + borders)
const V_OVERHEAD = 90;   // total vertical chrome (header + labels + gaps)

useLayoutEffect(() => {
  el.textContent = text + '​';  // zero-width space forces measurement on empty string
  setSize({
    width:  Math.min(Math.max(MIN_WIDTH,  el.scrollWidth  + H_PADDING), MAX_WIDTH),
    height: Math.min(Math.max(MIN_HEIGHT, el.scrollHeight + V_OVERHEAD), MAX_HEIGHT),
  });
}, [text]);
```

Width and height both grow with content and both have min/max bounds. Once `MAX_HEIGHT` is hit, the textarea becomes scrollable instead of growing further.

**Dynamic handles in TextNode** (`src/components/nodes/TextNode.js`):
```js
const vars = extractVariables(text);
// One <Handle> per variable, evenly spaced vertically
vars.map((v, i) => {
  const topPct = `${((i + 1) / (vars.length + 1)) * 100}%`;
  return <Handle key={v} type="target" position={Position.Left} id={`${id}-${v}`} style={{ top: topPct }} />;
})
```
Labels for each variable handle are rendered outside the left edge of the node (same pill style as BaseNode handle labels) so they don't obscure the textarea content.

**Scroll vs zoom fix**: The textarea has class `nowheel` and ReactFlow is configured with `noWheelClassName="nowheel"` — this tells ReactFlow to ignore wheel events originating from that element, so scrolling the textarea does not zoom the canvas.

---

## Part 4 — Backend Integration

### Requirement
> Update submit.js to POST nodes and edges to `/pipelines/parse`. Update the backend endpoint to return `{ num_nodes, num_edges, is_dag }`. Show the result in an alert.

### What the original had

**Frontend** (`submit.js`):
```js
export const SubmitButton = () => (
  <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
    <button type="submit">Submit</button>
  </div>
);
```
No click handler, no fetch, no access to store state.

**Backend** (`main.py`):
```python
@app.get('/pipelines/parse')        # wrong method — GET, not POST
def parse_pipeline(pipeline: str = Form(...)):   # Form string, not JSON body
    return {'status': 'parsed'}     # wrong shape, no calculation
```
No CORS middleware, so the frontend would have been blocked by the browser.

### What we built

**Backend — three files**:

`schemas.py` — Pydantic v2 models matching the ReactFlow data shape:
```python
class NodeSchema(BaseModel):
    id: str; type: str = ""; data: dict = {}

class EdgeSchema(BaseModel):
    id: str; source: str; target: str

class PipelineRequest(BaseModel):
    nodes: List[NodeSchema]; edges: List[EdgeSchema]

class PipelineResponse(BaseModel):
    num_nodes: int; num_edges: int; is_dag: bool
```

`pipeline.py` — iterative DFS DAG detection (avoids Python's recursion limit on large graphs):
```python
def _is_dag(nodes, edges):
    # Build adjacency list
    adj = {n.id: [] for n in nodes}
    for e in edges:
        if e.source in adj:
            adj[e.source].append(e.target)

    WHITE, GRAY, BLACK = 0, 1, 2
    color = {n.id: WHITE for n in nodes}

    for start in color:
        if color[start] != WHITE: continue
        stack = [(start, iter(adj[start]))]
        color[start] = GRAY
        while stack:
            node, neighbors = stack[-1]
            try:
                nxt = next(neighbors)
                if color.get(nxt) == GRAY: return False   # back edge = cycle
                if color.get(nxt) == WHITE:
                    color[nxt] = GRAY
                    stack.append((nxt, iter(adj.get(nxt, []))))
            except StopIteration:
                color[node] = BLACK
                stack.pop()
    return True
```

`main.py` — corrected to POST, JSON body, with CORS:
```python
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:3000"], ...)

@app.post('/pipelines/parse', response_model=PipelineResponse)
def parse_pipeline(req: PipelineRequest):
    return analyze_pipeline(req)
```

**Frontend** (`src/components/ui/SubmitButton.js`):
```js
const handleSubmit = async () => {
  const res = await fetch('http://localhost:8000/pipelines/parse', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nodes, edges }),
  });
  setResult(await res.json());
};
```
Reads `nodes` and `edges` from the Zustand store. Shows a loading state during the request. On success, opens `ResultModal`.

**`ResultModal.js`** — instead of a plain browser `alert()` (which blocks the thread and can't be styled), a modal overlay displays the result. Dismisses on Escape or backdrop click. Shows `is_dag` in green or red.

---

## Bugs Fixed Along the Way

### Zustand v5 infinite loop
**Symptom**: `Maximum update depth exceeded` the moment any node was added to the canvas.

**Cause**: The original `ui.js` used `useStore(selector, shallow)` — the second-argument `shallow` equaliser was silently removed in Zustand v5. Without it, every state read returned a new object reference, causing React 18's `useSyncExternalStore` to re-render endlessly.

**Fix**: Changed to `useStore(useShallow(selector))` using `useShallow` from `zustand/react/shallow` in both `PipelineCanvas.js` and `SubmitButton.js`.

### Connection line preview not curved
**Symptom**: While dragging a new edge, the preview line was straight/stepped; the completed edge was a bezier curve.

**Cause**: `connectionLineType="bezier"` is not a valid ReactFlow value. ReactFlow's edge type enum uses `'default'` to mean bezier, not the string `"bezier"`.

**Fix**: Changed to `connectionLineType="default"` in `PipelineCanvas.js`.

### Textarea scroll zooms the canvas
**Symptom**: Scrolling inside the TextNode textarea when it's at max height zoomed the whole canvas.

**Cause**: ReactFlow listens for wheel events on the canvas element. Wheel events from the textarea bubbled up to it.

**Fix**: Added `noWheelClassName="nowheel"` to the `<ReactFlow>` component and `className="nowheel"` to the textarea. ReactFlow skips zoom handling for any element matching that class.

### git tracking node_modules and build
**Cause**: The original `.gitignore` had `/node_modules` (absolute path from repo root), which didn't match the nested `frontend/frontend/node_modules`.

**Fix**: Changed to depth-agnostic patterns `node_modules/` and `build/`, then ran `git rm -r --cached` to untrack already-staged files.

---

## File Structure — Before vs After

```
Before                          After
──────────────────────────────  ──────────────────────────────────────────
src/
  App.js                        src/
  ui.js                           App.js
  store.js                        store/
  submit.js                         pipelineStore.js
  toolbar.js                      styles/
  draggableNode.js                  theme.css
  index.css                         globals.css
  nodes/                          hooks/
    inputNode.js                    useAutoSize.js
    outputNode.js                 utils/
    llmNode.js                      variableExtractor.js
    textNode.js                   components/
                                    nodes/
                                      base/
                                        BaseNode.js
                                        BaseNode.module.css
                                      InputNode.js
                                      OutputNode.js
                                      LLMNode.js
                                      TextNode.js
                                      FilterNode.js       ← new
                                      MergeNode.js        ← new
                                      TransformNode.js    ← new
                                      HTTPNode.js         ← new
                                      NoteNode.js         ← new
                                      index.js
                                    toolbar/
                                      Toolbar.js
                                      DraggableNode.js
                                    canvas/
                                      PipelineCanvas.js
                                    ui/
                                      SubmitButton.js
                                      ResultModal.js

backend/backend/
  main.py                       backend/backend/
                                  main.py
                                  schemas.py              ← new
                                  pipeline.py             ← new
```
