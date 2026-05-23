import { useRef, useLayoutEffect, useState } from 'react';

const MIN_WIDTH  = 240;
const MAX_WIDTH  = 380;
const MIN_HEIGHT = 160;
const MAX_HEIGHT = 480;
const H_PADDING  = 48;
const V_OVERHEAD = 90;

export const useAutoSize = (text) => {
  const mirrorRef = useRef(null);
  const [size, setSize] = useState({ width: MIN_WIDTH, height: MIN_HEIGHT });

  useLayoutEffect(() => {
    const el = mirrorRef.current;
    if (!el) return;
    el.textContent = text + '​';
    setSize({
      width:  Math.min(Math.max(MIN_WIDTH, el.scrollWidth + H_PADDING), MAX_WIDTH),
      height: Math.min(Math.max(MIN_HEIGHT, el.scrollHeight + V_OVERHEAD), MAX_HEIGHT),
    });
  }, [text]);

  return { size, mirrorRef };
};
