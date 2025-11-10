# Quick Start Guide 🚀

## Installation & Setup

### Step 1: Install Dependencies

Open your terminal in the project root directory and run:

```bash
npm run install-all
```

This will install dependencies for:
- Root project (concurrently for running both servers)
- Backend server (Express, TypeScript, etc.)
- Frontend client (React, React Flow, etc.)

**Alternative:** If the above doesn't work, install separately:

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
cd ..
```

### Step 2: Start the Application

Run both frontend and backend together:

```bash
npm run dev
```

**Or run separately in two terminals:**

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
Backend will run on `http://localhost:3000`

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
Frontend will run on `http://localhost:5173`

### Step 3: Open in Browser

Navigate to: **http://localhost:5173**

---

## How to Use the Application

### 🎯 Main Features

#### 1. **Graph View** (Default)
- **Visualize Course Dependencies**: See all courses and their prerequisite relationships
- **Click on Nodes**: Click any course node to see details in the sidebar
- **Navigate**: 
  - Use mouse to pan (drag) and zoom (scroll)
  - Use the minimap (bottom-left) to navigate large graphs
  - Use controls (bottom-left) to zoom in/out and fit view

#### 2. **List View**
- Switch to "List View" using the toggle button in the sidebar
- Browse courses in a card-based layout
- Click any course card to see details

#### 3. **Search Courses**
- Type in the search box to filter courses by:
  - Course code (e.g., "COMP 1130")
  - Course title (e.g., "programming")

#### 4. **Find Path Between Courses**
1. Switch to "List View"
2. Scroll to the "Path Finder" section
3. Select a **Start Course** from the dropdown
4. Select a **Target Course** from the dropdown
5. Click **"Find Path"**
6. View all valid paths from start to target course

**Example:**
- Start: `COMP 1130` (Computer Programming 1)
- Target: `COMP 4910` (Computing Science Project)
- Result: Shows all possible course sequences

#### 5. **Find Specialization Path**
1. In "List View", scroll to "Find Specialization Path"
2. Click the dropdown to add target courses (courses you want to complete)
3. Add multiple target courses (e.g., `COMP 4910`, `COMP 4930`)
4. Click **"Find Specialization Path"**
5. View the complete course plan with:
   - All required courses
   - Semester-by-semester breakdown
   - Total credits needed

**Example:**
- Target Courses: `COMP 4910`, `COMP 4930`
- Result: Complete course sequence organized by semesters

---

## Understanding the Graph

### Node Colors
- **White nodes**: Regular courses
- **Blue nodes**: Selected course (clicked)

### Edges (Arrows)
- Arrows point from **prerequisite** → **course**
- Example: `COMP 1130` → `COMP 1230` means COMP 1130 is required before COMP 1230

### Layout
- Courses are arranged by **prerequisite level**
- Level 0: Courses with no prerequisites (left side)
- Higher levels: Courses with more prerequisites (right side)

---

## API Endpoints (For Developers)

If you want to use the API directly:

### Get All Courses
```bash
curl http://localhost:3000/api/courses
```

### Get Specific Course
```bash
curl http://localhost:3000/api/courses/COMP%201130
```

### Search Courses
```bash
curl "http://localhost:3000/api/search?q=programming"
```

### Find Paths
```bash
curl http://localhost:3000/api/paths/COMP%201130/COMP%204910
```

### Find Specialization Path
```bash
curl -X POST http://localhost:3000/api/specialization \
  -H "Content-Type: application/json" \
  -d '{"targetCourses": ["COMP 4910", "COMP 4930"], "maxSemesters": 8}'
```

---

## Troubleshooting

### Port Already in Use
If port 3000 or 5173 is already in use:

**Backend (port 3000):**
- Kill the process using port 3000
- Or set `PORT` to use a different port when starting the server

**Frontend (port 5173):**
- Kill the process using port 5173
- Or set `CLIENT_PORT` to use a different port

### Module Not Found Errors
```bash
# Clean install
rm -rf node_modules server/node_modules client/node_modules
npm run install-all
```

### TypeScript Errors
Make sure you're using Node.js 18+:
```bash
node --version
```

### JSON Import Issues
If you see errors about JSON imports, make sure:
- You're using Node.js 18+ (supports JSON imports)
- TypeScript is configured correctly (already done in `tsconfig.json`)

---

## Tips

1. **Start with Graph View**: Get an overview of all course relationships
2. **Use Search**: Quickly find specific courses
3. **Explore Dependencies**: Click on courses to see what they require and what requires them
4. **Plan Your Path**: Use the specialization path finder to plan your entire degree
5. **Multiple Paths**: Some courses have multiple prerequisite paths - explore them all!

---

## Example Workflow

1. **Explore**: Open Graph View, zoom out to see the full course network
2. **Search**: Type "COMP 4" to see all 4000-level courses
3. **Select**: Click on `COMP 4910` (Computing Science Project)
4. **Plan**: Switch to List View, add `COMP 4910` as a specialization target
5. **Find Path**: Click "Find Specialization Path" to see all courses needed
6. **Review**: Check the semester breakdown to plan your academic journey

---

Enjoy exploring your academic path! 🎓

