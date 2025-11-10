import React, { useState, useEffect } from 'react';
import CourseGraph from './components/CourseGraph';
import CourseCard from './components/CourseCard';
import PathFinder from './components/PathFinder';
import { Course } from './types';
import { api } from './api';
import './App.css';

function App() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [graphData, setGraphData] = useState<{ nodes: Course[]; edges: any[] }>({ nodes: [], edges: [] });
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'graph' | 'list'>('graph');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [coursesData, graph] = await Promise.all([
          api.getAllCourses(),
          api.getGraph()
        ]);
        setCourses(coursesData);
        setGraphData(graph);
        setFilteredCourses(coursesData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        alert('Failed to load course data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCourses(courses);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = courses.filter(
        course =>
          course.code.toLowerCase().includes(query) ||
          course.title.toLowerCase().includes(query)
      );
      setFilteredCourses(filtered);
    }
  }, [searchQuery, courses]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>Loading courses...</div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>Building dependency graph</div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🎓 Academic Path Finder</h1>
        <p>Discover valid paths to complete your degree specialization</p>
      </header>

      <div className="main-container">
        <aside className="sidebar">
          <div className="search-section">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <div className="view-toggle">
              <button
                onClick={() => setViewMode('graph')}
                className={viewMode === 'graph' ? 'active' : ''}
              >
                Graph View
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'active' : ''}
              >
                List View
              </button>
            </div>
          </div>

          {selectedCourse && (
            <div className="course-details">
              <h3>{selectedCourse.code}</h3>
              <p className="course-title">{selectedCourse.title}</p>
              <p className="course-credits">{selectedCourse.credits}</p>
              {selectedCourse.prerequisites.length > 0 && (
                <div>
                  <strong>Prerequisites:</strong>
                  <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {selectedCourse.prerequisites.map(prereq => (
                      <span key={prereq} className="prereq-tag">{prereq}</span>
                    ))}
                  </div>
                </div>
              )}
              <p className="course-description">{selectedCourse.description}</p>
            </div>
          )}

          {viewMode === 'list' && (
            <div className="course-list">
              <h3>Courses ({filteredCourses.length})</h3>
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {filteredCourses.map(course => (
                  <CourseCard
                    key={course.code}
                    course={course}
                    onSelect={setSelectedCourse}
                  />
                ))}
              </div>
            </div>
          )}
        </aside>

        <main className="main-content">
          {viewMode === 'graph' ? (
            <div className="graph-container">
              <CourseGraph
                courses={graphData.nodes}
                edges={graphData.edges}
                selectedCourse={selectedCourse?.code}
                onNodeClick={setSelectedCourse}
              />
            </div>
          ) : (
            <div className="list-container">
              <PathFinder courses={courses} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;

