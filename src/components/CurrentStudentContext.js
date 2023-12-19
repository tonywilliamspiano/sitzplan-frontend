import React, { createContext, useContext, useState } from 'react';

// Create a context with a default value (null in this case)
const CurrentStudentContext = createContext(null);

// Custom hook to conveniently use the context
export const useCurrentStudent = () => {
    const context = useContext(CurrentStudentContext);
    if (!context) {
        throw new Error('useCurrentStudent must be used within a CurrentStudentProvider');
    }
    return context;
};

// Provider component to wrap your app
export const CurrentStudentProvider = ({ children }) => {
    const [currentStudent, setCurrentStudent] = useState(null);

    return (
        <CurrentStudentContext.Provider value={{ currentStudent, setCurrentStudent }}>
            {children}
        </CurrentStudentContext.Provider>
    );
};