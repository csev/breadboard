// Test setup file
import { beforeEach, afterEach } from 'vitest';
import { JSDOM } from 'jsdom';

// Setup JSDOM environment for browser-like testing
beforeEach(() => {
    const dom = new JSDOM('<!DOCTYPE html><div id="app"></div>', {
        url: 'http://localhost',
        pretendToBeVisual: true
    });
    
    global.window = dom.window;
    global.document = dom.window.document;
    global.navigator = dom.window.navigator;
});

afterEach(() => {
    // Cleanup
}); 