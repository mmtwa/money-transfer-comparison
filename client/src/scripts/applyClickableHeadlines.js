/**
 * Guide for applying clickable headlines to all guides
 * 
 * Steps to update each guide page:
 * 
 * 1. Update imports:
 *    - Add these imports at the top of each guide file:
 *    ```
 *    import ClickableHeadline from '../../components/common/ClickableHeadline';
 *    import useExpandableSections from '../../hooks/useExpandableSections';
 *    ```
 * 
 * 2. Add section config:
 *    - Add this inside your component, before related guides:
 *    ```
 *    // Define sections to be expandable
 *    const sections = {
 *      'section-id-1': true,
 *      'section-id-2': true,
 *      // Add one entry for each section headline
 *    };
 *  
 *    // Use the custom hook to manage section state
 *    const [expandedSections, toggleSection] = useExpandableSections(sections);
 *    ```
 * 
 * 3. Update h2 elements to ClickableHeadline components:
 *    - Replace all h2 elements with:
 *    ```
 *    <ClickableHeadline 
 *      id="your-section-id" 
 *      isExpanded={expandedSections['your-section-id']} 
 *      onClick={toggleSection}
 *    >
 *      Your Headline Text
 *    </ClickableHeadline>
 *    ```
 * 
 * 4. Wrap section content in conditional rendering:
 *    - Wrap the content of each section in a conditional rendering statement:
 *    ```
 *    {expandedSections['your-section-id'] && (
 *      <>
 *        ... Your section content here ...
 *      </>
 *    )}
 *    ```
 * 
 * NOTE: When creating new guide pages in the future, follow this same pattern.
 */

// This file is for documentation purposes only 