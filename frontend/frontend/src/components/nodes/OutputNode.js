import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode, NodeField, nodeStyles } from './base/BaseNode';

const HANDLES = [
  { id: 'value', type: 'target', position: Position.Left },
];

export const OutputNode = ({ id, data, selected }) => {
  const [name, setName] = useState(data?.outputName || id.replace('customOutput-', 'output_'));
  const [type, setType] = useState(data?.outputType || 'Text');

  return (
    <BaseNode id={id} title="Output" category="output" handles={HANDLES} selected={selected}>
      <NodeField label="Name">
        <input className={nodeStyles.input} value={name} onChange={e => setName(e.target.value)} />
      </NodeField>
      <NodeField label="Type">
        <select className={nodeStyles.select} value={type} onChange={e => setType(e.target.value)}>
          <option>Text</option>
          <option>Image</option>
        </select>
      </NodeField>
    </BaseNode>
  );
};
