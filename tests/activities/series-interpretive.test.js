import { describe, it, expect, beforeEach } from 'vitest';
import Workbench from '@/models/workbench.js';
import { Resistor, Wire } from '@/models/components.js';

describe('Series Circuit Interpretation Activity', () => {
    let workbench;

    beforeEach(() => {
        workbench = new Workbench();
    });

    describe('Circuit Setup', () => {
        it('should create a valid series circuit', () => {
            // Create components
            const r1 = new Resistor({ value: '100' });
            const r2 = new Resistor({ value: '200' });
            const wire = new Wire();

            // Add to workbench
            workbench.addComponent(r1);
            workbench.addComponent(r2);
            workbench.addComponent(wire);

            expect(workbench.components).toHaveLength(3);
            expect(workbench.isValidSeriesCircuit()).toBe(true);
        });

        it('should calculate total resistance correctly', () => {
            const r1 = new Resistor({ value: '100' });
            const r2 = new Resistor({ value: '200' });
            
            workbench.addComponent(r1);
            workbench.addComponent(r2);
            
            expect(workbench.getTotalResistance()).toBe(300);
        });
    });

    describe('Student Interactions', () => {
        it('should track student measurements', () => {
            const measurements = [];
            workbench.on('measurement', (data) => {
                measurements.push(data);
            });

            // Simulate student taking measurements
            workbench.measure('voltage', 5);
            workbench.measure('current', 0.1);

            expect(measurements).toHaveLength(2);
            expect(measurements[0].type).toBe('voltage');
            expect(measurements[0].value).toBe(5);
        });

        it('should validate student answers', () => {
            const answer = {
                totalResistance: '300',
                voltage: '5',
                current: '0.0167'
            };

            expect(workbench.validateAnswer(answer)).toBe(true);
        });
    });

    describe('Activity Progress', () => {
        it('should track completion status', () => {
            expect(workbench.isActivityComplete()).toBe(false);
            
            // Complete required measurements
            workbench.measure('voltage', 5);
            workbench.measure('current', 0.1);
            workbench.submitAnswer({
                totalResistance: '300',
                voltage: '5',
                current: '0.0167'
            });

            expect(workbench.isActivityComplete()).toBe(true);
        });

        it('should provide appropriate feedback', () => {
            const feedback = workbench.getFeedback();
            expect(feedback).toBeTypeOf('string');
            expect(feedback.length).toBeGreaterThan(0);
        });
    });
}); 