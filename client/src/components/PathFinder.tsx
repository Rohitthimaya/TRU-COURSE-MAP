import React, { useState } from 'react';
import { Course, PathResult } from '../types';
import { api } from '../api';

interface PathFinderProps {
  courses: Course[];
}

const PathFinder: React.FC<PathFinderProps> = ({ courses }) => {
  const [startCourse, setStartCourse] = useState('');
  const [targetCourse, setTargetCourse] = useState('');
  const [paths, setPaths] = useState<string[][]>([]);
  const [loading, setLoading] = useState(false);
  const [specializationTargets, setSpecializationTargets] = useState<string[]>([]);
  const [specializationPaths, setSpecializationPaths] = useState<PathResult[]>([]);

  const handleFindPath = async () => {
    if (!startCourse || !targetCourse) return;
    
    setLoading(true);
    try {
      const result = await api.findPaths(startCourse, targetCourse);
      setPaths(result.paths);
    } catch (error) {
      console.error('Failed to find paths:', error);
      alert('Failed to find paths');
    } finally {
      setLoading(false);
    }
  };

  const handleFindSpecialization = async () => {
    if (specializationTargets.length === 0) return;
    
    setLoading(true);
    try {
      const result = await api.findSpecializationPaths(specializationTargets);
      setSpecializationPaths(result);
    } catch (error) {
      console.error('Failed to find specialization paths:', error);
      alert('Failed to find specialization paths');
    } finally {
      setLoading(false);
    }
  };

  const addSpecializationTarget = (code: string) => {
    if (code && !specializationTargets.includes(code)) {
      setSpecializationTargets([...specializationTargets, code]);
    }
  };

  return (
    <div style={{ padding: '20px', background: '#fff', borderRadius: '8px', marginBottom: '20px' }}>
      <h2 style={{ marginBottom: '20px', color: '#1f2937' }}>Path Finder</h2>
      
      {/* Path between two courses */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ marginBottom: '15px', color: '#4b5563' }}>Find Path Between Courses</h3>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
          <select
            value={startCourse}
            onChange={(e) => setStartCourse(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              minWidth: '200px',
            }}
          >
            <option value="">Select start course</option>
            {courses.map(course => (
              <option key={course.code} value={course.code}>
                {course.code} - {course.title.substring(0, 40)}...
              </option>
            ))}
          </select>
          
          <select
            value={targetCourse}
            onChange={(e) => setTargetCourse(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              minWidth: '200px',
            }}
          >
            <option value="">Select target course</option>
            {courses.map(course => (
              <option key={course.code} value={course.code}>
                {course.code} - {course.title.substring(0, 40)}...
              </option>
            ))}
          </select>
          
          <button
            onClick={handleFindPath}
            disabled={loading || !startCourse || !targetCourse}
            style={{
              padding: '8px 16px',
              background: '#4f46e5',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: loading || !startCourse || !targetCourse ? 'not-allowed' : 'pointer',
              opacity: loading || !startCourse || !targetCourse ? 0.5 : 1,
            }}
          >
            {loading ? 'Finding...' : 'Find Path'}
          </button>
        </div>

        {paths.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h4 style={{ marginBottom: '10px' }}>Found {paths.length} path(s):</h4>
            {paths.slice(0, 5).map((path, idx) => (
              <div
                key={idx}
                style={{
                  padding: '10px',
                  marginBottom: '10px',
                  background: '#f3f4f6',
                  borderRadius: '6px',
                }}
              >
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {path.map((code, i) => (
                    <React.Fragment key={i}>
                      <span
                        style={{
                          padding: '4px 8px',
                          background: '#6366f1',
                          color: '#fff',
                          borderRadius: '4px',
                          fontSize: '12px',
                        }}
                      >
                        {code}
                      </span>
                      {i < path.length - 1 && <span>→</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Specialization path finder */}
      <div>
        <h3 style={{ marginBottom: '15px', color: '#4b5563' }}>Find Specialization Path</h3>
        <div style={{ marginBottom: '15px' }}>
          <select
            onChange={(e) => {
              if (e.target.value) {
                addSpecializationTarget(e.target.value);
                e.target.value = '';
              }
            }}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              minWidth: '200px',
            }}
          >
            <option value="">Add target course</option>
            {courses.map(course => (
              <option key={course.code} value={course.code}>
                {course.code} - {course.title.substring(0, 40)}...
              </option>
            ))}
          </select>
        </div>

        {specializationTargets.length > 0 && (
          <div style={{ marginBottom: '15px' }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
              {specializationTargets.map(code => (
                <span
                  key={code}
                  style={{
                    padding: '6px 12px',
                    background: '#6366f1',
                    color: '#fff',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  {code}
                  <button
                    onClick={() => setSpecializationTargets(specializationTargets.filter(c => c !== code))}
                    style={{
                      background: 'rgba(255,255,255,0.2)',
                      border: 'none',
                      color: '#fff',
                      cursor: 'pointer',
                      borderRadius: '4px',
                      padding: '2px 6px',
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <button
              onClick={handleFindSpecialization}
              disabled={loading}
              style={{
                padding: '8px 16px',
                background: '#10b981',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1,
              }}
            >
              {loading ? 'Finding...' : 'Find Specialization Path'}
            </button>
          </div>
        )}

        {specializationPaths.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            {specializationPaths.map((result, idx) => (
              <div key={idx} style={{ marginBottom: '20px', padding: '15px', background: '#f3f4f6', borderRadius: '6px' }}>
                <h4 style={{ marginBottom: '10px' }}>
                  Total Credits: {result.totalCredits} | Semesters: {result.semesters.length}
                </h4>
                {result.semesters.map((semester, semIdx) => (
                  <div key={semIdx} style={{ marginBottom: '15px' }}>
                    <strong>Semester {semIdx + 1}:</strong>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                      {semester.map(code => (
                        <span
                          key={code}
                          style={{
                            padding: '4px 8px',
                            background: '#10b981',
                            color: '#fff',
                            borderRadius: '4px',
                            fontSize: '12px',
                          }}
                        >
                          {code}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PathFinder;

