// KameraViewContext.js

import React, { createContext, useContext, useState } from 'react';

const KlassenListeContext = createContext();

export const useKlassenListeContext = () => {
    const context = useContext(KlassenListeContext);
    if (!context) {
        throw new Error('useKameraContext must be used within a KameraViewProvider');
    }
    return [context.klassenListeReload, context.setKlassenListeReload];
};

export const KlassenListeProvider = ({ children }) => {
    const [klassenListeReload, setKlassenListeReload] = useState(0);

    return (
        <KlassenListeContext.Provider value={{ klassenListeReload, setKlassenListeReload }}>
            {children}
        </KlassenListeContext.Provider>
    );
};
