import { useState } from 'react';

/**
 * Custom hook to manage expandable sections in guide pages
 * @param {Object} initialState - Object with section IDs as keys and boolean values for expanded state
 * @returns {Array} [expandedSections, toggleSection] - Current state and toggle function
 */
const useExpandableSections = (initialState = {}) => {
  // Default all sections to expanded if not specified
  const defaultState = Object.keys(initialState).reduce((acc, key) => {
    acc[key] = initialState[key] !== undefined ? initialState[key] : true;
    return acc;
  }, {});

  const [expandedSections, setExpandedSections] = useState(defaultState);

  // Toggle section visibility
  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  return [expandedSections, toggleSection];
};

export default useExpandableSections; 