import React from 'react';
import { Course } from '../types';

interface CourseCardProps {
  course: Course;
  onSelect?: (course: Course) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onSelect }) => {
  return (
    <div
      onClick={() => onSelect?.(course)}
      style={{
        padding: '16px',
        margin: '8px',
        background: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        cursor: onSelect ? 'pointer' : 'default',
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        if (onSelect) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
        }
      }}
      onMouseLeave={(e) => {
        if (onSelect) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        }
      }}
    >
      <h3 style={{ marginBottom: '8px', color: '#1f2937' }}>{course.code}</h3>
      <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
        {course.title}
      </p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', color: '#9ca3af' }}>{course.credits}</span>
        {course.prerequisites.length > 0 && (
          <span style={{ fontSize: '12px', color: '#6366f1' }}>
            {course.prerequisites.length} prereq{course.prerequisites.length > 1 ? 's' : ''}
          </span>
        )}
      </div>
    </div>
  );
};

export default CourseCard;

