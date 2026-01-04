
// Fixed: Added d3 import to resolve namespace errors for simulation interfaces
import * as d3 from 'd3';

export interface CaseStudy {
  id: string;
  name: string;
  color: string;
  description: string;
}

export interface Student {
  id: string;
  name: string;
  rankings: string[]; // IDs of case studies in order of preference
}

export interface Room {
  id: string;
  caseId: string;
  caseName: string;
  roomNumber: number;
  students: Student[];
}

export interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  primaryCaseId?: string;
}

// Fixed: Explicitly added source and target properties to ensure compatibility with object literal assignments
export interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
  strength: number;
}
