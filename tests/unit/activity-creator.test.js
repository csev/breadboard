import { describe, it, beforeEach, afterEach, beforeAll, afterAll, expect } from 'vitest';
import { ActivityConstructor } from '@/controllers/activity-constructor.js';
import { OscilloscopeView } from '@/views/oscilloscope-view.js';
import { getBreadBoard } from '@/models/breadboard.js';
import { activityController } from '@/controllers/activity-controller.js';
import { sectionController } from '@/controllers/section-controller.js';

describe('Activity Creator', () => {
    // Store original OscilloscopeView
    let originalOScopeView;

    beforeAll(() => {
        originalOScopeView = OscilloscopeView;
        
        // Mock OscilloscopeView
        class MockOscilloscopeView {
            getView() { 
                return document.createElement('div'); 
            }
            renderSignal() {}
            removeTrace() {}
            setModel() {}
            horizontalScaleChanged() {}
            verticalScaleChanged() {}
        }
        
        OscilloscopeView = MockOscilloscopeView;
    });

    afterAll(() => {
        // Restore original OscilloscopeView
        OscilloscopeView = originalOScopeView;
    });

    beforeEach(() => {
        // Reset state before each test
        getBreadBoard().clear();
        sectionController.reset();
        activityController.reset();
    });

    afterEach(() => {
        // Cleanup after each test
        document.querySelectorAll('#questions_area, #breadboard').forEach(el => el.remove());
        activityController.reset();
    });

    describe('Circuit creation', () => {
        it('should be able to create a circuit', () => {
            const jsonSection = {
                circuit: [{
                    type: 'resistor',
                    connections: 'b2,b3'
                }]
            };

            const ac = new ActivityConstructor(jsonSection);
            const board = getBreadBoard();
            const netlist = board.generateNetlist();
            
            expect(netlist).toMatch(/R:resistor.* L2 L3/);
        });

        it('should be able to create a circuit with faults', () => {
            const jsonSection = {
                circuit: [{
                    type: 'resistor',
                    UID: 'r1',
                    connections: 'b2,b3'
                }],
                faults: [{
                    type: 'open',
                    component: 'r1'
                }]
            };

            const ac = new ActivityConstructor(jsonSection);
            const board = getBreadBoard();
            
            expect(board.components['r1'].resistance).toBe(1e20);
        });
    });

    describe('Adding DMMs and OScopes', () => {
        it('should not set the section.meter property if no multimeter or oscope is visible', () => {
            const jsonSection = {
                circuit: [{
                    type: 'resistor',
                    UID: 'r1',
                    connections: 'b2,b3'
                }]
            };

            const ac = new ActivityConstructor(jsonSection);
            const currentSection = activityController.currentSection;
            
            expect(currentSection.meter.dmm).toBeNull();
            expect(currentSection.meter.oscope).toBeNull();
        });

        it('should set the section.meter property to be a DMM if multimeter is visible', () => {
            const jsonSection = {
                circuit: [{
                    type: 'resistor',
                    UID: 'r1',
                    connections: 'b2,b3'
                }],
                show_multimeter: true
            };

            const ac = new ActivityConstructor(jsonSection);
            const currentSection = activityController.currentSection;
            
            expect(currentSection.meter.dmm).not.toBeNull();
            expect(currentSection.meter.dmm.dialPosition).not.toBeNull();
            expect(currentSection.meter.oscope).toBeNull();
        });

        it('should set the section.meter property to be an o-scope if o-scope is visible', () => {
            const jsonSection = {
                circuit: [{
                    type: 'resistor',
                    UID: 'r1',
                    connections: 'b2,b3'
                }],
                show_oscilloscope: true
            };

            const ac = new ActivityConstructor(jsonSection);
            const currentSection = activityController.currentSection;
            
            expect(currentSection.meter.oscope).not.toBeNull();
            expect(currentSection.meter.oscope.PROBE_CHANNEL).not.toBeNull();
            expect(currentSection.meter.dmm).toBeNull();
        });
    });

    describe('Question creation', () => {
        it('should be able to create a simple question', () => {
            const jsonSection = {
                pages: [{
                    questions: [{
                        prompt: 'What is the resistance of R1?',
                        correct_answer: '100',
                        correct_units: 'V'
                    }]
                }]
            };

            const ac = new ActivityConstructor(jsonSection);
            
            expect(window.sparks.activity).toBeDefined();
            
            const section = activityController.currentSection;
            expect(section.pages).toHaveLength(1);
            
            const question = section.pages[0].questions[0];
            expect(question.prompt).toBe('What is the resistance of R1?');
            expect(question.correct_answer).toBe(100);
            expect(question.correct_units).toBe('V');
        });
    });

    describe('Activity displaying', () => {
        it('should be able to embed images in main body of page', () => {
            const jsonSection = {
                _id: 'test',
                image: 'test.jpg'
            };

            const imageDiv = document.createElement('div');
            const ac = new ActivityConstructor(jsonSection);
            
            ac.view.setEmbeddingTargets({ imageDiv });
            ac.view.layoutCurrentSection();
            
            const img = imageDiv.querySelector('img');
            expect(img).not.toBeNull();
            expect(img.src).toBe('http://couchdb.cosmos.concord.org/sparks/test/test.jpg');
        });
    });
}); 