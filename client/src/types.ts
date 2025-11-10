export interface Course {
  id: string;
  code: string;
  title: string;
  credits: string;
  description: string;
  prerequisites: string[];
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
}

export interface PathResult {
  path: string[];
  totalCredits: number;
  semesters: string[][];
}

