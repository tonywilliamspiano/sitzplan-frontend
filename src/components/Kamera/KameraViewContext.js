// KameraViewContext.js

import React, { createContext, useContext, useState } from 'react';

const KameraViewContext = createContext();

export const useKameraContext = () => {
    const context = useContext(KameraViewContext);
    if (!context) {
        throw new Error('useKameraContext must be used within a KameraViewProvider');
    }
    return [context.kameraView, context.setKameraView];
};

export const KameraViewProvider = ({ children }) => {
    const [kameraView, setKameraView] = useState(false);

    return (
        <KameraViewContext.Provider value={{ kameraView, setKameraView }}>
            {children}
        </KameraViewContext.Provider>
    );
};

// Provide a default value for useKameraContext outside the provider
KameraViewContext.defaultProps = {
    kameraView: false,
    setKameraView: () => {},
};