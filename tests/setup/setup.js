import { beforeAll, afterAll } from 'vitest';
import { JSDOM } from 'jsdom';

// Setup JSDOM for browser environment simulation
beforeAll(() => {
    const dom = new JSDOM(`
        <!DOCTYPE html>
        <html>
            <body>
                <div id="app"></div>
                <div id="questions_area"></div>
                <div id="breadboard"></div>
            </body>
        </html>
    `, {
        url: 'http://localhost',
        pretendToBeVisual: true
    });

    global.window = dom.window;
    global.document = dom.window.document;
    global.navigator = dom.window.navigator;
});

afterAll(() => {
    // Cleanup global namespace
    delete global.window;
    delete global.document;
    delete global.navigator;
}); 