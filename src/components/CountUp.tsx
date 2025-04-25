
import React, { useState, useEffect, useRef } from 'react';

interface CountUpProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}

const CountUp: React.FC<CountUpProps> = ({ 
  end, 
  duration = 2000,
  prefix = '',
  suffix = ''
}) => {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && !hasAnimated) {
        setHasAnimated(true);
        
        let startTime: number;
        const startValue = 0;
        const endValue = end;

        const animate = (timestamp: number) => {
          if (!startTime) startTime = timestamp;
          const timeElapsed = timestamp - startTime;
          const progress = Math.min(timeElapsed / duration, 1);
          const currentCount = Math.floor(progress * (endValue - startValue) + startValue);
          
          setCount(currentCount);
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };
        
        requestAnimationFrame(animate);
      }
    };

    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      threshold: 0.1,
    });
    
    if (countRef.current) {
      observer.observe(countRef.current);
    }
    
    return () => {
      if (countRef.current) {
        observer.unobserve(countRef.current);
      }
    };
  }, [end, duration, hasAnimated]);

  return (
    <span ref={countRef}>
      {prefix}{count}{suffix}
    </span>
  );
};

export default CountUp;
