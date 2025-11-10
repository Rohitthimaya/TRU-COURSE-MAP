import { Course, PathResult } from './types';

const API_BASE = '/api';

export const api = {
  async getAllCourses(): Promise<Course[]> {
    const response = await fetch(`${API_BASE}/courses`);
    if (!response.ok) throw new Error('Failed to fetch courses');
    return response.json();
  },

  async getCourse(code: string): Promise<Course> {
    const response = await fetch(`${API_BASE}/courses/${code}`);
    if (!response.ok) throw new Error('Failed to fetch course');
    return response.json();
  },

  async getGraph(): Promise<{ nodes: Course[]; edges: any[] }> {
    const response = await fetch(`${API_BASE}/graph`);
    if (!response.ok) throw new Error('Failed to fetch graph');
    return response.json();
  },

  async getPrerequisites(code: string): Promise<Course[]> {
    const response = await fetch(`${API_BASE}/courses/${code}/prerequisites`);
    if (!response.ok) throw new Error('Failed to fetch prerequisites');
    return response.json();
  },

  async getDependents(code: string): Promise<Course[]> {
    const response = await fetch(`${API_BASE}/courses/${code}/dependents`);
    if (!response.ok) throw new Error('Failed to fetch dependents');
    return response.json();
  },

  async findPaths(start: string, target: string, maxDepth: number = 10): Promise<{ paths: string[][]; count: number }> {
    const response = await fetch(`${API_BASE}/paths/${start}/${target}?maxDepth=${maxDepth}`);
    if (!response.ok) throw new Error('Failed to find paths');
    return response.json();
  },

  async findSpecializationPaths(targetCourses: string[], maxSemesters: number = 8): Promise<PathResult[]> {
    const response = await fetch(`${API_BASE}/specialization`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetCourses, maxSemesters })
    });
    if (!response.ok) throw new Error('Failed to find specialization paths');
    return response.json();
  },

  async searchCourses(query: string): Promise<Course[]> {
    const response = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Failed to search courses');
    return response.json();
  }
};

