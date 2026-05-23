import { useState } from 'react';
import { BaseNode, nodeStyles } from './base/BaseNode';

export const NoteNode = ({ id, data, selected }) => {
  const [text, setText] = useState(data?.text || '');

  return (
    <BaseNode id={id} title="Note" category="note" handles={[]} selected={selected}>
      <textarea
        className={nodeStyles.textarea}
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Add a note..."
        style={{ minHeight: 80, resize: 'vertical', overflow: 'auto' }}
      />
    </BaseNode>
  );
};
