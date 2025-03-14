import Meter from '@models/meter.js';
import Oscilloscope from '@models/oscilloscope.js';
import Workbench from '@models/workbench.js';
import Log from '@models/log.js';
import OscilloscopeView from './views/oscilloscope-view.js';
import WorkbenchView from './views/workbench-view.js';
import BreadboardSVGView from './views/breadboard-svg-view.js';
import FunctionGeneratorView from './views/function-generator-view.js';
import AddComponentsView from './views/add-components-view.js';
import EditComponentsView from './views/edit-components-view.js';
import { initPathDataPolyfill } from './views/path-data-polyfill.js';
import $ from 'jquery';
import 'jquery-ui';
import { WorkbenchController } from './controllers/workbench-controller.js';
import { BreadboardController } from './controllers/breadboard-controller.js';
import './plugins/jquery.js';

// Initialize polyfill before creating any views
initPathDataPolyfill();

// Create model instances
const meter = new Meter();
const oscilloscope = new Oscilloscope();
const workbench = new Workbench();
const log = new Log();

// Get container elements
const oscilloscopeContainer = document.getElementById('oscilloscope-container');
const workbenchContainer = document.getElementById('workbench-container');
const breadboardContainer = document.getElementById('breadboard-container');
const functionGeneratorContainer = document.getElementById('function-generator-container');
const addComponentsContainer = document.getElementById('add-components-container');
const editComponentsContainer = document.getElementById('edit-components-container');

// Create view instances with proper containers and models
const oscilloscopeView = new OscilloscopeView(oscilloscopeContainer, oscilloscope);
const workbenchView = new WorkbenchView(workbenchContainer, workbench);
const breadboardView = new BreadboardSVGView(breadboardContainer, workbench);
const functionGeneratorView = new FunctionGeneratorView(functionGeneratorContainer);
const addComponentsView = new AddComponentsView(addComponentsContainer, workbench);
const editComponentsView = new EditComponentsView(editComponentsContainer, workbench);

// Set up model event handlers
meter.on('change', () => {
    console.log('Meter value changed:', meter.getValue());
    // Add any UI updates needed
});

oscilloscope.on('change', () => {
    console.log('Oscilloscope settings changed:', oscilloscope.getSettings());
    // View will handle its own updates through its model binding
});

workbench.on('change', () => {
    console.log('Workbench components changed:', workbench.components);
    // Views will handle their own updates through model binding
});

log.on('change', () => {
    console.log('Log entries updated:', log.getEntries());
    // Add any UI updates needed
});

// Set up view event handlers
addComponentsView.on('componentAdded', (component) => {
    workbench.addComponent(component);
});

editComponentsView.on('componentEdited', (component) => {
    // Handle component editing
    workbench.emit('change');
});

functionGeneratorView.on('signalChange', (signal) => {
    // Update oscilloscope or other components based on signal changes
    oscilloscope.addData('ch1', signal);
});

// Initialize views with any default state
oscilloscopeView.update();
workbenchView.update();
breadboardView.update();

// Export instances if needed for debugging or external access
window.app = {
    models: {
        meter,
        oscilloscope,
        workbench,
        log
    },
    views: {
        oscilloscopeView,
        workbenchView,
        breadboardView,
        functionGeneratorView,
        addComponentsView,
        editComponentsView
    }
};

// Start any necessary animations or update loops
function animate() {
    requestAnimationFrame(animate);
    // Update any real-time components
    if (oscilloscope.running) {
        // Update oscilloscope data
        oscilloscopeView.update();
    }
}
animate();

// Initialize controllers
const workbenchController = new WorkbenchController();
const breadboardController = new BreadboardController();

// Initialize views
const editComponentsView = new EditComponentsView(workbenchController, breadboardController);

// Start the application
document.addEventListener('DOMContentLoaded', () => {
    workbenchController.initialize();
    breadboardController.initialize();
}); 