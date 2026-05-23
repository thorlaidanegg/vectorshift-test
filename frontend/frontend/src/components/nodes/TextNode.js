import { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { BaseNode, NodeField, nodeStyles } from './base/BaseNode';
import { extractVariables } from '../../utils/variableExtractor';
import { useAutoSize } from '../../hooks/useAutoSize';

const SOURCE_HANDLE = [{ id: 'output', type: 'source', position: Position.Right }];

const MIRROR_STYLE = {
  position: 'absolute',
  visibility: 'hidden',
  pointerEvents: 'none',
  top: 0,
  left: 0,
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  width: 'max-content',
  maxWidth: '332px', // MAX_WIDTH (380) − H_PADDING (48) = content ceiling
  fontFamily: 'inherit',
  fontSize: '12px',
  lineHeight: '1.5',
  padding: '6px 8px',
  border: '1px solid transparent',
  margin: 0,
  zIndex: -1,
};

export const TextNode = ({ id, data, selected }) => {
  const [text, setText] = useState(data?.text || '{{input}}');
  const { size, mirrorRef } = useAutoSize(text);
  const vars = extractVariables(text);

  return (
    <BaseNode
      id={id}
      title="Text"
      category="text"
      handles={SOURCE_HANDLE}
      selected={selected}
      style={{ width: size.width, minHeight: size.height }}
    >
      {vars.map((v, i) => {
        const topPct = `${((i + 1) / (vars.length + 1)) * 100}%`;
        return (
          <Handle
            key={v}
            type="target"
            position={Position.Left}
            id={`${id}-${v}`}
            style={{ top: topPct }}
          />
        );
      })}
      {vars.map((v, i) => (
        <span
          key={`lbl-${v}`}
          style={{
            position: 'absolute',
            top: `${((i + 1) / (vars.length + 1)) * 100}%`,
            right: 'calc(100% + 10px)',
            transform: 'translateY(-50%)',
            fontSize: 10,
            color: 'var(--text-muted)',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            zIndex: 10,
            fontWeight: 500,
            background: 'var(--bg-canvas)',
            padding: '1px 5px',
            borderRadius: 3,
            border: '1px solid var(--border-subtle)',
            lineHeight: 1.4,
          }}
        >
          {v}
        </span>
      ))}
      <NodeField label="Text" flex>
        <textarea
          className={`${nodeStyles.textarea} nowheel`}
          value={text}
          onChange={e => setText(e.target.value)}
          onWheel={e => { e.stopPropagation(); e.nativeEvent.stopImmediatePropagation(); }}
          style={{ flex: 1, minHeight: 60, overflowY: 'auto' }}
        />
      </NodeField>
      <pre ref={mirrorRef} style={MIRROR_STYLE} />
    </BaseNode>
  );
};
