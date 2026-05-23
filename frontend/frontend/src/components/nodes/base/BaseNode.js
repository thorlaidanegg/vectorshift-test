import { Handle, Position } from 'reactflow';
import styles from './BaseNode.module.css';

export { styles as nodeStyles };

const ACCENT_CLASS = {
  input:     styles.accentInput,
  output:    styles.accentOutput,
  llm:       styles.accentLlm,
  text:      styles.accentText,
  filter:    styles.accentFilter,
  merge:     styles.accentMerge,
  transform: styles.accentTransform,
  http:      styles.accentHttp,
  note:      styles.accentNote,
};

export const NodeField = ({ label, children, flex }) => (
  <div className={[styles.field, flex ? styles.fieldFlex : ''].filter(Boolean).join(' ')}>
    {label && <span className={styles.fieldLabel}>{label}</span>}
    {children}
  </div>
);

export const BaseNode = ({ id, title, category, handles = [], selected, style, children }) => {
  const accentClass = ACCENT_CLASS[category] ?? '';

  return (
    <div
      className={[styles.node, accentClass, selected ? styles.selected : ''].filter(Boolean).join(' ')}
      style={style}
    >
      {handles.map(h => (
        <Handle
          key={h.id}
          type={h.type}
          position={h.position}
          id={`${id}-${h.id}`}
          style={h.style}
        />
      ))}
      {handles.map(h =>
        h.label ? (
          <span
            key={`lbl-${h.id}`}
            className={[
              styles.handleLabel,
              h.position === Position.Left ? styles.handleLabelLeft : styles.handleLabelRight,
            ].join(' ')}
            style={{ top: h.style?.top ?? '50%' }}
          >
            {h.label}
          </span>
        ) : null
      )}
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
      </div>
      <div className={styles.body}>{children}</div>
    </div>
  );
};
