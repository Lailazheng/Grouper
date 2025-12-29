
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Student, GraphNode, GraphLink } from '../types';
import { CASE_STUDIES } from '../constants';

interface Props {
  students: Student[];
}

const StudentGraph: React.FC<Props> = ({ students }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || students.length < 2) return;

    const width = 800;
    const height = 600;

    // Clear previous SVG content
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Prepare graph data
    const nodes: GraphNode[] = students.map(s => ({
      id: s.id,
      name: s.name,
      primaryCaseId: s.rankings[0]
    }));

    const links: GraphLink[] = [];
    for (let i = 0; i < students.length; i++) {
      for (let j = i + 1; j < students.length; j++) {
        const s1 = students[i];
        const s2 = students[j];
        
        // Find shared cases
        const shared = s1.rankings.filter(r => s2.rankings.includes(r));
        if (shared.length > 0) {
          links.push({
            source: s1.id,
            target: s2.id,
            strength: shared.length
          });
        }
      }
    }

    const simulation = d3.forceSimulation<GraphNode>(nodes)
      .force("link", d3.forceLink<GraphNode, GraphLink>(links).id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(45));

    const g = svg.append("g");

    // Add zoom behavior
    svg.call(d3.zoom<SVGSVGElement, unknown>().on("zoom", (event) => {
      g.attr("transform", event.transform);
    }));

    // Draw links with different shades of Green
    const link = g.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", d => {
        // Different shades of Green/Emerald based on strength
        if (d.strength === 1) return "#a7f3d0"; // Light Green (Emerald 200)
        if (d.strength === 2) return "#34d399"; // Medium Green (Emerald 400)
        return "#059669"; // Dark Green (Emerald 600)
      })
      .attr("stroke-opacity", 0.7)
      .attr("stroke-width", d => {
        if (d.strength === 1) return 1.5;
        if (d.strength === 2) return 4;
        return 8; // shared 3
      });

    // Draw nodes
    const node = g.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(d3.drag<SVGGElement, GraphNode>()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })
      );

    // Flower Petals Path - 4 petals
    const flowerPath = "M 0,0 C 5,-15 15,-5 0,0 C 15,5 5,15 0,0 C -5,15 -15,5 0,0 C -15,-5 -5,-15 0,0 Z";

    node.append("path")
      .attr("d", flowerPath)
      .attr("fill", d => {
        const cs = CASE_STUDIES.find(c => c.id === d.primaryCaseId);
        return cs ? cs.color : "#94a3b8";
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .attr("transform", () => `rotate(${Math.random() * 360}) scale(1.2)`);

    // Center of the flower
    node.append("circle")
      .attr("r", 3)
      .attr("fill", "#fff")
      .attr("stroke", d => {
        const cs = CASE_STUDIES.find(c => c.id === d.primaryCaseId);
        return cs ? cs.color : "#94a3b8";
      })
      .attr("stroke-width", 1);

    node.append("text")
      .attr("dx", 18)
      .attr("dy", 4)
      .text(d => d.name)
      .style("font-size", "11px")
      .style("font-weight", "600")
      .attr("fill", "#334155")
      .style("paint-order", "stroke")
      .style("stroke", "#fff")
      .style("stroke-width", "3px")
      .style("stroke-linecap", "round")
      .style("stroke-linejoin", "round");

    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as any).x)
        .attr("y1", d => (d.source as any).y)
        .attr("x2", d => (d.target as any).x)
        .attr("y2", d => (d.target as any).y);

      node.attr("transform", d => `translate(${d.x},${d.y})`);
    });

  }, [students]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <h3 className="font-bold text-slate-700 flex items-center gap-2">
          <i className="fa-solid fa-seedling text-emerald-500"></i>
          Student Interest Garden
        </h3>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-1">
             <div className="w-4 h-0.5 bg-[#a7f3d0]"></div>
             <span className="text-[10px] text-slate-500">1 Shared</span>
          </div>
          <div className="flex items-center gap-1">
             <div className="w-4 h-1 bg-[#34d399]"></div>
             <span className="text-[10px] text-slate-500">2 Shared</span>
          </div>
          <div className="flex items-center gap-1">
             <div className="w-4 h-2 bg-[#059669]"></div>
             <span className="text-[10px] text-slate-500">3 Shared</span>
          </div>
        </div>
      </div>
      <div className="relative h-[600px] w-full bg-slate-50/30">
        <svg 
          ref={svgRef} 
          width="100%" 
          height="100%" 
          viewBox="0 0 800 600"
          className="cursor-move"
        />
        {students.length < 2 && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
            <div className="text-center">
              <i className="fa-solid fa-sun text-amber-400 text-4xl mb-3 animate-spin-slow"></i>
              <p className="text-slate-400 font-medium">Add at least 2 students to grow your garden</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentGraph;
