import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode, NodeField, nodeStyles } from './base/BaseNode';

const HANDLES = [
  { id: 'payload',  type: 'target', position: Position.Left,  label: 'payload' },
  { id: 'response', type: 'source', position: Position.Right, label: 'response' },
];

export const HTTPNode = ({ id, data, selected }) => {
  const [method, setMethod] = useState(data?.method || 'GET');
  const [url, setUrl] = useState(data?.url || '');

  return (
    <BaseNode id={id} title="HTTP Request" category="http" handles={HANDLES} selected={selected}>
      <NodeField label="Method">
        <select className={nodeStyles.select} value={method} onChange={e => setMethod(e.target.value)}>
          <option>GET</option>
          <option>POST</option>
          <option>PUT</option>
          <option>DELETE</option>
        </select>
      </NodeField>
      <NodeField label="URL">
        <input
          className={nodeStyles.input}
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://api.example.com/..."
        />
      </NodeField>
    </BaseNode>
  );
};
