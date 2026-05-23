import styles from './DraggableNode.module.css';

const ACCENT = {
  input:     'var(--accent-input)',
  output:    'var(--accent-output)',
  llm:       'var(--accent-llm)',
  text:      'var(--accent-text)',
  filter:    'var(--accent-filter)',
  merge:     'var(--accent-merge)',
  transform: 'var(--accent-transform)',
  http:      'var(--accent-http)',
  note:      'var(--accent-note)',
};

export const DraggableNode = ({ type, label, category }) => {
  const onDragStart = (e) => {
    e.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType: type }));
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className={styles.chip}
      style={{ '--chip-accent': ACCENT[category] ?? ACCENT.input }}
      draggable
      onDragStart={onDragStart}
    >
      <span className={styles.dot} />
      <span className={styles.label}>{label}</span>
    </div>
  );
};
