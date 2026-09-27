import React, { createContext, useContext, useState } from 'react';

const RoleContext = createContext();

export function RoleProvider({ children }) {
  const [role, setRole] = useState('District Officer');

  const scopedDistrict = 'Patna';
  const scopedState = 'Bihar';

  const filterByRole = (projects = []) => {
    if (role === 'District Officer') {
      return projects.filter(p => p.district === scopedDistrict);
    }
    if (role === 'State Officer') {
      return projects.filter(p => p.state === scopedState);
    }
    return projects; // Central Ministry
  };

  return (
    <RoleContext.Provider
      value={{
        role,
        setRole,
        scopedDistrict,
        scopedState,
        filterByRole
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
