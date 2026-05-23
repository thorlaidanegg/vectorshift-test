import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode, NodeField, nodeStyles } from './base/BaseNode';

const HANDLES = [
  { id: 'input',  type: 'target', position: Position.Left },
  { id: 'pass',   type: 'source', position: Position.Right, label: 'pass',   style: { top: '33%' } },
  { id: 'reject', type: 'source', position: Position.Right, label: 'reject', style: { top: '66%' } },
];

export const FilterNode = ({ id, data, selected }) => {
  const [condition, setCondition] = useState(data?.condition || '');

  return (
    <BaseNode id={id} title="Filter" category="filter" handles={HANDLES} selected={selected} style={{ minHeight: 130 }}>
      <NodeField label="Condition">
        <input
          className={nodeStyles.input}
          value={condition}
          onChange={e => setCondition(e.target.value)}
          placeholder="e.g. value > 0"
        />
      </NodeField>
    </BaseNode>
  );
};
