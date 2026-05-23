import { useState, useRef, useCallback } from 'react';
import ReactFlow, {
  Controls,
  Background,
  MiniMap,
  BackgroundVariant,
  MarkerType,
} from 'reactflow';
import { useStore } from '../../store/pipelineStore';
import { useShallow } from 'zustand/react/shallow';
import { nodeTypes } from '../nodes';
import styles from './PipelineCanvas.module.css';
import 'reactflow/dist/style.css';

const GRID = 20;
const proOptions = { hideAttribution: true };

const selector = (state) => ({
  nodes:         state.nodes,
  edges:         state.edges,
  getNodeID:     state.getNodeID,
  addNode:       state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect:     state.onConnect,
});

const defaultEdgeOptions = {
  type: 'default',
  animated: true,
  markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16, color: '#3d4460' },
  style: { stroke: '#3d4460', strokeWidth: 1.5 },
};

export const PipelineCanvas = () => {
  const wrapperRef = useRef(null);
  const [rfInstance, setRfInstance] = useState(null);
  const { nodes, edges, getNodeID, addNode, onNodesChange, onEdgesChange, onConnect } =
    useStore(useShallow(selector));

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const raw = event.dataTransfer.getData('application/reactflow');
      if (!raw) return;
      const { nodeType: type } = JSON.parse(raw);
      if (!type) return;

      const bounds = wrapperRef.current.getBoundingClientRect();
      const position = rfInstance.project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      const id = getNodeID(type);
      addNode({ id, type, position, data: { id, nodeType: type } });
    },
    [rfInstance, getNodeID, addNode]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div ref={wrapperRef} className={styles.canvas}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setRfInstance}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        snapGrid={[GRID, GRID]}
        snapToGrid
        connectionLineType="default"
        noWheelClassName="nowheel"
        defaultEdgeOptions={defaultEdgeOptions}
        deleteKeyCode={['Delete', 'Backspace']}
        panOnScroll
        zoomOnScroll={false}
        zoomOnPinch
        defaultViewport={{ x: 0, y: 0, zoom: 0.9 }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          color="var(--border-subtle)"
          gap={GRID}
          size={1.2}
        />
        <Controls />
        <MiniMap
          nodeColor="var(--bg-node-header)"
          maskColor="rgba(13, 15, 20, 0.75)"
        />
      </ReactFlow>
    </div>
  );
};
