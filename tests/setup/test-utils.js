// Modern test utilities for Vite/Vitest environment

// Mock Flash functionality
export const mockFlash = {
    getFlashMovie: (movieName) => ({
        sendMessageToFlash: () => {}
    }),
    
    sendCommand: () => {}
};

// Test utilities
export const testUtils = {
    // Convert object values to array
    objectValues: (object) => Object.values(object),
    
    // Create mock DOM elements
    createMockContainer: () => {
        const container = document.createElement('div');
        container.id = 'test-container';
        return container;
    },
    
    // Mock event handling
    createMockEvent: (type, data = {}) => ({
        type,
        ...data,
        preventDefault: () => {},
        stopPropagation: () => {}
    }),
    
    // Mock component creation
    createMockComponent: (type, props = {}) => ({
        type,
        ...props,
        id: `mock-${type}-${Date.now()}`
    })
};

// Mock global sparks object
export const mockSparks = {
    flash: mockFlash
};

// Helper functions for common test scenarios
export const helpers = {
    // Wait for next tick in event loop
    nextTick: () => new Promise(resolve => setTimeout(resolve, 0)),
    
    // Create a mock event emitter
    createMockEmitter: () => {
        const listeners = new Map();
        return {
            on: (event, callback) => {
                if (!listeners.has(event)) {
                    listeners.set(event, []);
                }
                listeners.get(event).push(callback);
            },
            emit: (event, ...args) => {
                const callbacks = listeners.get(event) || [];
                callbacks.forEach(callback => callback(...args));
            },
            removeAllListeners: () => listeners.clear()
        };
    }
};

// Setup function to initialize test environment
export function setupTestEnvironment() {
    // Replace global objects with mocks
    global.sparks = mockSparks;
    
    return {
        cleanup: () => {
            // Cleanup function to reset test environment
            delete global.sparks;
        }
    };
}

// Test data generators
export const generators = {
    // Generate mock measurement data
    createMockMeasurement: (type, value) => ({
        type,
        value,
        timestamp: Date.now()
    }),
    
    // Generate mock circuit data
    createMockCircuit: (components = []) => ({
        id: `circuit-${Date.now()}`,
        components,
        connections: []
    })
}; 