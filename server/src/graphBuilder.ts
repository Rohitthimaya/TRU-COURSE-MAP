import { Course, CourseNode, GraphEdge, PathResult } from './types.js';
import coursesData from '../../courses.json' assert { type: 'json' };

export class CourseGraph {
  private nodes: Map<string, CourseNode> = new Map();
  private edges: GraphEdge[] = [];
  private adjacencyList: Map<string, string[]> = new Map();
  private reverseAdjacencyList: Map<string, string[]> = new Map();

  constructor() {
    this.buildGraph();
  }

  private extractCourseCodes(prereqText: string): string[] {
    if (!prereqText || prereqText.trim() === '' || prereqText.toLowerCase().includes('none')) {
      return [];
    }

    // Pattern to match course codes like "COMP 1130", "COMP 1231", etc.
    const courseCodePattern = /\b([A-Z]{2,4})\s+(\d{4})\b/g;
    const matches: string[] = [];
    let match;

    while ((match = courseCodePattern.exec(prereqText)) !== null) {
      const code = `${match[1]} ${match[2]}`;
      matches.push(code);
    }

    return [...new Set(matches)]; // Remove duplicates
  }

  private buildGraph(): void {
    const courses = coursesData as Course[];

    // First pass: Create all nodes
    courses.forEach(course => {
      const prerequisites = this.extractCourseCodes(course.prereq);
      
      const node: CourseNode = {
        id: course.code,
        code: course.code,
        title: course.title,
        credits: course.credits,
        description: course.description,
        prerequisites: prerequisites
      };

      this.nodes.set(course.code, node);
      this.adjacencyList.set(course.code, []);
      this.reverseAdjacencyList.set(course.code, []);
    });

    // Second pass: Create edges (prerequisites)
    courses.forEach(course => {
      const prerequisites = this.extractCourseCodes(course.prereq);
      
      prerequisites.forEach(prereqCode => {
        // Only create edge if prerequisite course exists
        if (this.nodes.has(prereqCode)) {
          const edge: GraphEdge = {
            id: `${prereqCode}-${course.code}`,
            source: prereqCode,
            target: course.code,
            type: 'prerequisite'
          };

          this.edges.push(edge);
          
          // Add to adjacency lists
          const prereqList = this.adjacencyList.get(prereqCode) || [];
          prereqList.push(course.code);
          this.adjacencyList.set(prereqCode, prereqList);

          const reverseList = this.reverseAdjacencyList.get(course.code) || [];
          reverseList.push(prereqCode);
          this.reverseAdjacencyList.set(course.code, reverseList);
        }
      });
    });
  }

  getAllNodes(): CourseNode[] {
    return Array.from(this.nodes.values());
  }

  getAllEdges(): GraphEdge[] {
    return this.edges;
  }

  getNode(code: string): CourseNode | undefined {
    return this.nodes.get(code);
  }

  getPrerequisites(code: string): string[] {
    return this.reverseAdjacencyList.get(code) || [];
  }

  getDependents(code: string): string[] {
    return this.adjacencyList.get(code) || [];
  }

  // Find all paths from start to target using DFS
  findAllPaths(start: string, target: string, maxDepth: number = 10): string[][] {
    const paths: string[][] = [];
    const visited = new Set<string>();

    const dfs = (current: string, path: string[], depth: number) => {
      if (depth > maxDepth) return;
      
      if (current === target) {
        paths.push([...path]);
        return;
      }

      const dependents = this.getDependents(current);
      for (const next of dependents) {
        if (!visited.has(next) && !path.includes(next)) {
          visited.add(next);
          path.push(next);
          dfs(next, path, depth + 1);
          path.pop();
          visited.delete(next);
        }
      }
    };

    if (this.nodes.has(start) && this.nodes.has(target)) {
      dfs(start, [start], 0);
    }

    return paths;
  }

  // Find valid course sequence (topological sort)
  getTopologicalOrder(): string[] {
    const inDegree = new Map<string, number>();
    const queue: string[] = [];
    const result: string[] = [];

    // Initialize in-degree
    this.nodes.forEach((_, code) => {
      inDegree.set(code, this.getPrerequisites(code).length);
      if (inDegree.get(code) === 0) {
        queue.push(code);
      }
    });

    // Process nodes
    while (queue.length > 0) {
      const current = queue.shift()!;
      result.push(current);

      const dependents = this.getDependents(current);
      dependents.forEach(dependent => {
        const degree = inDegree.get(dependent)! - 1;
        inDegree.set(dependent, degree);
        if (degree === 0) {
          queue.push(dependent);
        }
      });
    }

    return result;
  }

  // Find all courses needed to reach a target course
  getAllRequiredCourses(target: string): Set<string> {
    const required = new Set<string>();
    const visited = new Set<string>();

    const dfs = (code: string) => {
      if (visited.has(code)) return;
      visited.add(code);
      required.add(code);

      const prerequisites = this.getPrerequisites(code);
      prerequisites.forEach(prereq => {
        dfs(prereq);
      });
    };

    if (this.nodes.has(target)) {
      dfs(target);
    }

    return required;
  }

  // Find valid paths to complete specialization
  findSpecializationPaths(targetCourses: string[], maxSemesters: number = 8): PathResult[] {
    const allRequired = new Set<string>();
    
    // Collect all required courses
    targetCourses.forEach(target => {
      const required = this.getAllRequiredCourses(target);
      required.forEach(course => allRequired.add(course));
    });

    // Filter to only include courses that are required
    const requiredList = Array.from(allRequired);
    const topologicalOrder = this.getTopologicalOrder().filter(c => requiredList.includes(c));

    // Group into semesters (assuming 4-5 courses per semester)
    const coursesPerSemester = 4;
    const semesters: string[][] = [];
    
    for (let i = 0; i < topologicalOrder.length; i += coursesPerSemester) {
      semesters.push(topologicalOrder.slice(i, i + coursesPerSemester));
    }

    // Calculate total credits
    let totalCredits = 0;
    requiredList.forEach(code => {
      const node = this.getNode(code);
      if (node) {
        const credits = parseInt(node.credits.match(/\d+/)?.[0] || '0');
        totalCredits += credits;
      }
    });

    return [{
      path: topologicalOrder,
      totalCredits,
      semesters: semesters.slice(0, maxSemesters)
    }];
  }

  // Search courses by code or title
  searchCourses(query: string): CourseNode[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.nodes.values()).filter(node =>
      node.code.toLowerCase().includes(lowerQuery) ||
      node.title.toLowerCase().includes(lowerQuery)
    );
  }
}

