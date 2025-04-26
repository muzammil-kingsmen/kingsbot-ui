import { useEffect, useRef } from 'react';

const AutoScroll = ({ dependencies = [] }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    // Check if scroll reference exists
    if (scrollRef.current) {
      // Multiple scrolling techniques for maximum compatibility
      scrollRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'end',
        inline: 'nearest' 
      });

      // Fallback scroll method
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollIntoView({ 
            behavior: 'auto', 
            block: 'end' 
          });
        }
      }, 50);
    }
  }, [dependencies]);

  return <div ref={scrollRef} />;
};

export default AutoScroll;