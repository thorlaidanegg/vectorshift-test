import { useEffect } from 'react';
import styles from './ResultModal.module.css';

const Stat = ({ label, value, color }) => (
  <div className={styles.stat}>
    <span className={styles.statLabel}>{label}</span>
    <span className={styles.statValue} style={color ? { color } : {}}>
      {value}
    </span>
  </div>
);

export const ResultModal = ({ result, onClose }) => {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <span className={styles.title}>Pipeline Analysis</span>
          <button className={styles.close} onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className={styles.body}>
          <Stat label="Nodes" value={result.num_nodes} />
          <Stat label="Edges" value={result.num_edges} />
          <Stat
            label="Valid DAG"
            value={result.is_dag ? 'Yes' : 'No'}
            color={result.is_dag ? 'var(--accent-output)' : 'var(--accent-filter)'}
          />
        </div>
      </div>
    </div>
  );
};
