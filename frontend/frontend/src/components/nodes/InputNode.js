import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode, NodeField, nodeStyles } from './base/BaseNode';

const HANDLES = [
  { id: 'value', type: 'source', position: Position.Right },
];

export const InputNode = ({ id, data, selected }) => {
  const [name, setName] = useState(data?.inputName || id.replace('customInput-', 'input_'));
  const [type, setType] = useState(data?.inputType || 'Text');

  return (
    <BaseNode id={id} title="Input" category="input" handles={HANDLES} selected={selected}>
      <NodeField label="Name">
        <input className={nodeStyles.input} value={name} onChange={e => setName(e.target.value)} />
      </NodeField>
      <NodeField label="Type">
        <select className={nodeStyles.select} value={type} onChange={e => setType(e.target.value)}>
          <option>Text</option>
          <option>File</option>
        </select>
      </NodeField>
    </BaseNode>
  );
};
