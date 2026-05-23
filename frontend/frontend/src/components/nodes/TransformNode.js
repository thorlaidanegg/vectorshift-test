import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode, NodeField, nodeStyles } from './base/BaseNode';

const HANDLES = [
  { id: 'input',  type: 'target', position: Position.Left },
  { id: 'output', type: 'source', position: Position.Right },
];

export const TransformNode = ({ id, data, selected }) => {
  const [fn, setFn] = useState(data?.fn || 'uppercase');

  return (
    <BaseNode id={id} title="Transform" category="transform" handles={HANDLES} selected={selected}>
      <NodeField label="Operation">
        <select className={nodeStyles.select} value={fn} onChange={e => setFn(e.target.value)}>
          <option value="uppercase">Uppercase</option>
          <option value="lowercase">Lowercase</option>
          <option value="trim">Trim</option>
          <option value="json_parse">JSON Parse</option>
          <option value="json_stringify">JSON Stringify</option>
        </select>
      </NodeField>
    </BaseNode>
  );
};
