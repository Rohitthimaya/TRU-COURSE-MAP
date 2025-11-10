import express from 'express';
import cors from 'cors';
import { CourseGraph } from './graphBuilder.js';

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(cors());
app.use(express.json());

// Initialize graph
const courseGraph = new CourseGraph();

// Get all courses
app.get('/api/courses', (req, res) => {
  try {
    const courses = courseGraph.getAllNodes();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// Get a specific course
app.get('/api/courses/:code', (req, res) => {
  try {
    const code = req.params.code.toUpperCase();
    const course = courseGraph.getNode(code);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch course' });
  }
});

// Get graph data (nodes and edges)
app.get('/api/graph', (req, res) => {
  try {
    const nodes = courseGraph.getAllNodes();
    const edges = courseGraph.getAllEdges();
    res.json({ nodes, edges });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch graph data' });
  }
});

// Get prerequisites for a course
app.get('/api/courses/:code/prerequisites', (req, res) => {
  try {
    const code = req.params.code.toUpperCase();
    const prerequisites = courseGraph.getPrerequisites(code);
    const prerequisiteCourses = prerequisites
      .map(prereq => courseGraph.getNode(prereq))
      .filter(course => course !== undefined);
    
    res.json(prerequisiteCourses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch prerequisites' });
  }
});

// Get dependents (courses that require this course)
app.get('/api/courses/:code/dependents', (req, res) => {
  try {
    const code = req.params.code.toUpperCase();
    const dependents = courseGraph.getDependents(code);
    const dependentCourses = dependents
      .map(dep => courseGraph.getNode(dep))
      .filter(course => course !== undefined);
    
    res.json(dependentCourses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dependents' });
  }
});

// Find paths between two courses
app.get('/api/paths/:start/:target', (req, res) => {
  try {
    const start = req.params.start.toUpperCase();
    const target = req.params.target.toUpperCase();
    const maxDepth = parseInt(req.query.maxDepth as string) || 10;
    
    const paths = courseGraph.findAllPaths(start, target, maxDepth);
    res.json({ paths, count: paths.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to find paths' });
  }
});

// Find specialization paths
app.post('/api/specialization', (req, res) => {
  try {
    const { targetCourses, maxSemesters } = req.body;
    
    if (!Array.isArray(targetCourses) || targetCourses.length === 0) {
      return res.status(400).json({ error: 'targetCourses must be a non-empty array' });
    }
    
    const paths = courseGraph.findSpecializationPaths(
      targetCourses.map((c: string) => c.toUpperCase()),
      maxSemesters || 8
    );
    
    res.json(paths);
  } catch (error) {
    res.status(500).json({ error: 'Failed to find specialization paths' });
  }
});

// Search courses
app.get('/api/search', (req, res) => {
  try {
    const query = req.query.q as string;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter "q" is required' });
    }
    
    const results = courseGraph.searchCourses(query);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search courses' });
  }
});

// Get topological order (valid course sequence)
app.get('/api/topological-order', (req, res) => {
  try {
    const order = courseGraph.getTopologicalOrder();
    const courses = order.map(code => courseGraph.getNode(code)).filter(c => c !== undefined);
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get topological order' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

