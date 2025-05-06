// Theme utility functions based on the Pidima Style Guide

// Define theme color variables based on the style guide
const setupThemeVariables = () => {
  const root = document.documentElement;
  const isDark = isDarkModeEnabled();
  
  // Light mode colors
  if (!isDark) {
    // Apply light mode colors
    root.style.setProperty('--color-background', '#ffffff');
    root.style.setProperty('--color-foreground', '#171717');
    root.style.setProperty('--color-card-bg', '#f9fafb');
    root.style.setProperty('--color-card-border', '#e5e7eb');
    root.style.setProperty('--color-primary-button', '#4f46e5');
    root.style.setProperty('--color-primary-button-hover', '#4338ca');
    root.style.setProperty('--color-primary-button-text', '#ffffff');
    root.style.setProperty('--color-secondary-button', '#f3f4f6');
    root.style.setProperty('--color-secondary-button-hover', '#e5e7eb');
    root.style.setProperty('--color-secondary-button-text', '#1f2937');
    root.style.setProperty('--color-accent', '#10b981');
    root.style.setProperty('--color-accent-hover', '#059669');
    root.style.setProperty('--color-link', '#2563eb');
    root.style.setProperty('--color-link-hover', '#1d4ed8');
    root.style.setProperty('--color-success', '#22c55e');
    root.style.setProperty('--color-warning', '#f59e0b');
    root.style.setProperty('--color-error', '#ef4444');
    root.style.setProperty('--color-header-bg', '#ffffff');
    root.style.setProperty('--color-header-border', '#e5e7eb');
    
    // Apply direct styles to body and main elements for more visible changes
    document.body.style.backgroundColor = '#ffffff';
    document.body.style.color = '#171717';
    
    // Additional light mode specific variables
    root.style.setProperty('--color-sidebar-bg', '#ffffff');
    root.style.setProperty('--color-sidebar-active', '#f3f4f6');
    root.style.setProperty('--color-sidebar-hover', '#f9fafb');
    root.style.setProperty('--color-sidebar-text', '#1f2937');
    root.style.setProperty('--color-sidebar-active-text', '#4f46e5');
    root.style.setProperty('--color-input-bg', '#f9fafb');
    root.style.setProperty('--color-input-border', '#e5e7eb');
    root.style.setProperty('--color-input-text', '#1f2937');
    root.style.setProperty('--color-card-shadow', 'rgba(0, 0, 0, 0.1)');
  } 
  // Dark mode colors
  else {
    // Apply dark mode colors
    root.style.setProperty('--color-background', '#111827');
    root.style.setProperty('--color-foreground', '#f3f4f6');
    root.style.setProperty('--color-card-bg', '#1f2937');
    root.style.setProperty('--color-card-border', '#374151');
    root.style.setProperty('--color-primary-button', '#4f46e5');
    root.style.setProperty('--color-primary-button-hover', '#6366f1');
    root.style.setProperty('--color-primary-button-text', '#ffffff');
    root.style.setProperty('--color-secondary-button', '#374151');
    root.style.setProperty('--color-secondary-button-hover', '#4b5563');
    root.style.setProperty('--color-secondary-button-text', '#f9fafb');
    root.style.setProperty('--color-accent', '#10b981');
    root.style.setProperty('--color-accent-hover', '#34d399');
    root.style.setProperty('--color-link', '#60a5fa');
    root.style.setProperty('--color-link-hover', '#93c5fd');
    root.style.setProperty('--color-success', '#34d399');
    root.style.setProperty('--color-warning', '#fbbf24');
    root.style.setProperty('--color-error', '#ef4444');
    root.style.setProperty('--color-header-bg', '#1f2937');
    root.style.setProperty('--color-header-border', '#374151');
    
    // Apply direct styles to body and main elements for more visible changes
    document.body.style.backgroundColor = '#111827';
    document.body.style.color = '#f3f4f6';
    
    // Additional dark mode specific variables
    root.style.setProperty('--color-sidebar-bg', '#1f2937');
    root.style.setProperty('--color-sidebar-active', '#374151');
    root.style.setProperty('--color-sidebar-hover', '#4b5563');
    root.style.setProperty('--color-sidebar-text', '#e5e7eb');
    root.style.setProperty('--color-sidebar-active-text', '#6366f1');
    root.style.setProperty('--color-input-bg', '#374151');
    root.style.setProperty('--color-input-border', '#4b5563');
    root.style.setProperty('--color-input-text', '#f3f4f6');
    root.style.setProperty('--color-card-shadow', 'rgba(0, 0, 0, 0.3)');
    
    // Add specific variables for traceability matrix
    root.style.setProperty('--color-matrix-header', 'rgba(30, 41, 59, 0.8)'); 
    root.style.setProperty('--color-matrix-row-hover', 'rgba(30, 41, 59, 0.5)');
    root.style.setProperty('--color-matrix-selected', 'rgba(30, 58, 138, 0.4)');
    root.style.setProperty('--color-matrix-border', '#374151');
  }
  
  // Force all relevant elements to update based on theme
  updateElementClasses(isDark);
};

// Update classes for various elements based on the theme
const updateElementClasses = (isDark: boolean) => {
  // Update cards and backgrounds
  const cards = document.querySelectorAll('.card, .bg-white, .bg-gray-50, .bg-gray-100, [class*="bg-"]');
  cards.forEach(card => {
    if (isDark) {
      (card as HTMLElement).classList.add('force-dark-mode');
    } else {
      (card as HTMLElement).classList.remove('force-dark-mode');
    }
  });
  
  // Update header elements specifically
  const headerElements = document.querySelectorAll('header');
  headerElements.forEach(header => {
    if (isDark) {
      (header as HTMLElement).classList.remove('bg-white', 'text-gray-900', 'border-gray-200');
      (header as HTMLElement).classList.add('bg-gray-800', 'text-gray-100', 'border-gray-700');
    } else {
      (header as HTMLElement).classList.remove('bg-gray-800', 'text-gray-100', 'border-gray-700');
      (header as HTMLElement).classList.add('bg-white', 'text-gray-900', 'border-gray-200');
    }
  });
  
  // Update sidebar elements specifically
  const sidebarElements = document.querySelectorAll('.sidebar');
  sidebarElements.forEach(sidebar => {
    if (isDark) {
      (sidebar as HTMLElement).classList.remove('bg-white', 'text-gray-900', 'border-gray-200');
      (sidebar as HTMLElement).classList.add('bg-gray-800', 'text-gray-100', 'border-gray-700');
    } else {
      (sidebar as HTMLElement).classList.remove('bg-gray-800', 'text-gray-100', 'border-gray-700');
      (sidebar as HTMLElement).classList.add('bg-white', 'text-gray-900', 'border-gray-200');
    }
  });
  
  // Update input fields
  const inputElements = document.querySelectorAll('input, select, textarea');
  inputElements.forEach(input => {
    if (isDark) {
      (input as HTMLElement).classList.remove('bg-gray-50', 'border-gray-300', 'text-gray-900');
      (input as HTMLElement).classList.add('bg-gray-700', 'border-gray-600', 'text-gray-100');
    } else {
      (input as HTMLElement).classList.remove('bg-gray-700', 'border-gray-600', 'text-gray-100');
      (input as HTMLElement).classList.add('bg-gray-50', 'border-gray-300', 'text-gray-900');
    }
  });
  
  // Update table elements 
  const tableElements = document.querySelectorAll('table, tr, th, td');
  tableElements.forEach(table => {
    if (isDark) {
      (table as HTMLElement).classList.add('dark-table');
    } else {
      (table as HTMLElement).classList.remove('dark-table');
    }
  });
  
  // Update MUI components (for Tooltips and other components)
  const muiElements = document.querySelectorAll('.MuiTooltip-tooltip');
  muiElements.forEach(element => {
    if (isDark) {
      (element as HTMLElement).style.backgroundColor = '#1f2937';
      (element as HTMLElement).style.color = '#f3f4f6';
      (element as HTMLElement).style.border = '1px solid #374151';
    } else {
      (element as HTMLElement).style.backgroundColor = '#f5f5f9';
      (element as HTMLElement).style.color = 'rgba(0, 0, 0, 0.87)';
      (element as HTMLElement).style.border = '1px solid #e5e7eb';
    }
  });
}

// Check if dark mode is enabled based on localStorage or system preference
export const isDarkModeEnabled = (): boolean => {
  return (
    localStorage.getItem('theme') === 'dark' ||
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );
};

// Apply dark mode to the document
export const applyDarkMode = (isDark: boolean): void => {
  if (isDark) {
    document.documentElement.classList.add('dark');
    document.body.classList.add('dark-mode');
    document.body.classList.remove('light-mode');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    document.body.classList.remove('dark-mode');
    document.body.classList.add('light-mode');
    localStorage.setItem('theme', 'light');
  }
  
  // Update CSS variables based on the current theme
  setupThemeVariables();
  
  // Force repaint to ensure theme changes are visible
  document.body.style.display = 'none';
  setTimeout(() => {
    document.body.style.display = '';
  }, 5);
};

// Toggle dark mode
export const toggleDarkMode = (): boolean => {
  const currentMode = isDarkModeEnabled();
  const newMode = !currentMode;
  applyDarkMode(newMode);
  
  // Dispatch a custom event that components can listen for
  window.dispatchEvent(new CustomEvent('themechange', { detail: { isDarkMode: newMode } }));
  
  return newMode;
};

// Initialize dark mode
export const initializeDarkMode = (): void => {
  applyDarkMode(isDarkModeEnabled());
  setupThemeVariables();
  
  // Add listener for system preference changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleSystemPreferenceChange = (e: MediaQueryListEvent) => {
    // Only update if user hasn't manually set a preference
    if (localStorage.getItem('theme') === null) {
      applyDarkMode(e.matches);
      window.dispatchEvent(new CustomEvent('themechange', { detail: { isDarkMode: e.matches } }));
    }
  };
  
  mediaQuery.addEventListener('change', handleSystemPreferenceChange);
}; 