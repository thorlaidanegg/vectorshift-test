import styles from './Toolbar.module.css';
import { DraggableNode } from './DraggableNode';
import { NODE_CONFIGS } from '../nodes';

export const Toolbar = () => (
  <div className={styles.toolbar}>
    <span className={styles.sectionLabel}>Nodes</span>
    <div className={styles.divider} />
    <div className={styles.nodes}>
      {NODE_CONFIGS.map(cfg => (
        <DraggableNode key={cfg.type} type={cfg.type} label={cfg.label} category={cfg.category} />
      ))}
    </div>
  </div>
);
