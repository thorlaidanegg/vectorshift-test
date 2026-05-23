import { useState } from 'react';
import { useStore } from '../../store/pipelineStore';
import { useShallow } from 'zustand/react/shallow';
import { ResultModal } from './ResultModal';
import styles from './SubmitButton.module.css';

const selector = (state) => ({ nodes: state.nodes, edges: state.edges });

export const SubmitButton = () => {
  const { nodes, edges } = useStore(useShallow(selector));
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:8000/pipelines/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      setResult(await res.json());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.bar}>
        {error && <span className={styles.error}>{error}</span>}
        <button className={styles.button} onClick={handleSubmit} disabled={loading}>
          {loading ? 'Analysing…' : 'Analyse Pipeline'}
        </button>
      </div>
      {result && <ResultModal result={result} onClose={() => setResult(null)} />}
    </>
  );
};
