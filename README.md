# Academic Path Finder 🎓

A graph-based system to model university course dependencies and discover valid paths to complete degree specializations.

## Features

- **Interactive Course Dependency Graph**: Visualize course prerequisites using React Flow
- **Path Finding**: Find all valid paths between two courses
- **Specialization Planning**: Discover complete course sequences for degree specializations
- **Course Search**: Search and filter courses by code or title
- **Topological Ordering**: View courses in a valid completion order

## Tech Stack

### Frontend
- React 18
- TypeScript
- React Flow (for graph visualization)
- D3.js (for graph layout algorithms)
- Vite (build tool)

### Backend
- Node.js
- Express
- TypeScript
- Graph algorithms (DFS, Topological Sort)

## Project Structure

```
TRU-COURSE-FINDER/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── api.ts         # API client
│   │   └── App.tsx        # Main app component
│   └── package.json
├── server/                 # Express backend
│   ├── src/
│   │   ├── graphBuilder.ts # Graph construction and algorithms
│   │   └── index.ts        # API routes
│   └── package.json
└── courses.json            # Course data

```

## Getting Started

### Prerequisites

- **Node.js 18+** (check with `node --version`)
- **npm** (comes with Node.js)

### Quick Start

1. **Install all dependencies:**
   ```bash
   npm run install-all
   ```

2. **Start the application:**
   ```bash
    npm run dev
   ```
   This starts both backend (port 3000) and frontend (port 5173) together.

3. **Open your browser:**
   Navigate to **http://localhost:3000**

### Detailed Usage Guide

📖 See [QUICKSTART.md](./QUICKSTART.md) for:
- Step-by-step installation instructions
- How to use all features
- Troubleshooting tips
- Example workflows

### Running Separately (Optional)

If you prefer to run frontend and backend in separate terminals:

```bash
# Terminal 1 - Backend (port 3000)
cd server && npm run dev

# Terminal 2 - Frontend (port 5173)
cd client && npm run dev
```

### Using Custom Ports

Ports can be changed via environment variables:

```bash
# Example: backend on 4000, frontend on 6000
PORT=4000 API_PORT=4000 CLIENT_PORT=6000 npm run dev
```

Variables:
- `PORT`: backend server port
- `API_PORT`: proxy target for the frontend (defaults to `PORT`)
- `CLIENT_PORT`: frontend dev server port (defaults to `5173`)

## API Endpoints

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:code` - Get a specific course
- `GET /api/search?q=query` - Search courses

### Graph
- `GET /api/graph` - Get graph data (nodes and edges)
- `GET /api/courses/:code/prerequisites` - Get prerequisites for a course
- `GET /api/courses/:code/dependents` - Get courses that require this course

### Path Finding
- `GET /api/paths/:start/:target?maxDepth=10` - Find paths between two courses
- `POST /api/specialization` - Find specialization paths
  ```json
  {
    "targetCourses": ["COMP 4910", "COMP 4930"],
    "maxSemesters": 8
  }
```
- `GET /api/topological-order` - Get courses in topological order

## Usage

### Graph View
- Click on any course node to see details
- Use the minimap to navigate large graphs
- Zoom and pan to explore the dependency network

### Path Finding
1. Select a start course and target course
2. Click "Find Path" to discover all valid paths
3. View the course sequence for each path

### Specialization Planning
1. Add target courses for your specialization
2. Click "Find Specialization Path" to get a complete course plan
3. View the semester-by-semester breakdown

## Graph Algorithms

The system implements several graph algorithms:

1. **Depth-First Search (DFS)**: Used to find all paths between courses
2. **Topological Sort**: Determines valid course completion order
3. **Reachability Analysis**: Finds all required courses for a target

## License

MIT

# TRU-COURSE-MAP
