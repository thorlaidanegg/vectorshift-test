import { Position } from 'reactflow';
import { BaseNode, nodeStyles } from './base/BaseNode';

const HANDLES = [
  { id: 'system',   type: 'target', position: Position.Left,  label: 'system', style: { top: '32%' } },
  { id: 'prompt',   type: 'target', position: Position.Left,  label: 'prompt', style: { top: '68%' } },
  { id: 'response', type: 'source', position: Position.Right, label: 'response' },
];

export const LLMNode = ({ id, data, selected }) => (
  <BaseNode
    id={id}
    title="LLM"
    category="llm"
    handles={HANDLES}
    selected={selected}
    style={{ minHeight: 130 }}
  >
    <span className={nodeStyles.infoText}>Language Model</span>
  </BaseNode>
);
