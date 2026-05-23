import { Position } from 'reactflow';
import { BaseNode, nodeStyles } from './base/BaseNode';

const HANDLES = [
  { id: 'a',      type: 'target', position: Position.Left,  label: 'a',      style: { top: '33%' } },
  { id: 'b',      type: 'target', position: Position.Left,  label: 'b',      style: { top: '66%' } },
  { id: 'merged', type: 'source', position: Position.Right, label: 'merged' },
];

export const MergeNode = ({ id, data, selected }) => (
  <BaseNode
    id={id}
    title="Merge"
    category="merge"
    handles={HANDLES}
    selected={selected}
    style={{ minHeight: 120 }}
  >
    <span className={nodeStyles.infoText}>Combines two inputs into one</span>
  </BaseNode>
);
