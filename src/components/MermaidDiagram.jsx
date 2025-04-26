import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

// Initialize mermaid with optimized settings
mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  fontSize: 14,
  securityLevel: 'loose',
  flowchart: {
    htmlLabels: true,
    curve: 'basis'
  },
  darkMode: true
});

const MermaidDiagram = ({ chart }) => {
  const containerRef = useRef(null);
  const [error, setError] = useState(null);
  
  // Generate a unique ID for each chart render
  const chartId = useRef(`mermaid-${Math.random().toString(36).substring(2, 11)}`).current;

  useEffect(() => {
    if (!containerRef.current || !chart) return;
    
    try {
      // Clean up the diagram syntax
      let processedChart = chart.trim();
      
      // If diagram doesn't start with a valid diagram type, prepend "graph TD"
      if (!processedChart.match(/^(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram|gantt|pie|mindmap|timeline)/)) {
        processedChart = `graph TD\n${processedChart}`;
      }
      
      // Add default styling if no style statements exist
      if (!processedChart.includes('style ')) {
        processedChart += `\nstyle A fill:#6495ED,stroke:#333,stroke-width:2px`;
      }
      
      mermaid.render(chartId, processedChart).then(({ svg, bindFunctions }) => {
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
          if (bindFunctions) bindFunctions(containerRef.current);
          setError(null);
        }
      }).catch(err => {
        console.error("Failed to render mermaid diagram:", err);
        setError(`Rendering error: ${err.message}`);
      });
      
    } catch (error) {
      console.error("Mermaid diagram error:", error);
      setError(`Diagram error: ${error.message}`);
    }
  }, [chart, chartId]);

  if (error) {
    return (
      <div className="p-3 bg-red-900/50 border border-red-700 rounded text-white">
        <p className="font-semibold">Error rendering diagram</p>
        <p className="text-sm opacity-90">{error}</p>
        <div className="mt-2 p-2 bg-gray-800 rounded">
          <pre className="whitespace-pre-wrap text-xs text-gray-300">{chart}</pre>
        </div>
      </div>
    );
  }

  return (
    <div className="mermaid-wrapper overflow-auto bg-gray-800/50 p-3 rounded border border-gray-700">
      <div ref={containerRef} className="mermaid-container flex justify-center" />
    </div>
  );
};

export default MermaidDiagram;