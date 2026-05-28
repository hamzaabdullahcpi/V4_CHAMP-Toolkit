import React, { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";

export default function AnimatedCounter({ value }: { value: string | number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [displayValue, setDisplayValue] = useState("0");
  
  useEffect(() => {
    if (!isInView) return;
    
    const stringValue = String(value);
    const match = stringValue.match(/^([^0-9]*)([0-9.]+)([^0-9]*)$/);
    if (!match) {
      setDisplayValue(stringValue);
      return;
    }
    
    const prefix = match[1];
    const numStr = match[2];
    const suffix = match[3];
    const target = parseFloat(numStr);
    const isFloat = numStr.includes('.');
    
    let startTimestamp: number;
    const duration = 2000;
    
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = easeProgress * target;
      
      if (isFloat) {
        setDisplayValue(`${prefix}${current.toFixed(1)}${suffix}`);
      } else {
        setDisplayValue(`${prefix}${Math.floor(current)}${suffix}`);
      }
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayValue(stringValue);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [isInView, value]);

  return <span ref={ref}>{displayValue}</span>;
}
