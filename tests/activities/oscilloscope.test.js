import { describe, it, expect, beforeEach } from 'vitest';
import Oscilloscope from '@/models/oscilloscope.js';
import FunctionGenerator from '@/models/function-generator.js';

describe('Oscilloscope Activity', () => {
    let oscilloscope;
    let functionGenerator;

    beforeEach(() => {
        oscilloscope = new Oscilloscope();
        functionGenerator = new FunctionGenerator();
    });

    describe('Signal Generation', () => {
        it('should generate correct waveform', () => {
            functionGenerator.setFrequency(1000);
            functionGenerator.setAmplitude(5);
            functionGenerator.setWaveform('sine');

            const signal = functionGenerator.generateSignal();
            expect(signal).toBeInstanceOf(Float32Array);
            expect(signal.length).toBeGreaterThan(0);
        });

        it('should update oscilloscope display', () => {
            functionGenerator.setFrequency(1000);
            functionGenerator.start();

            // Allow some time for signal generation
            const data = oscilloscope.getData('ch1');
            expect(data.length).toBeGreaterThan(0);
        });
    });

    describe('Student Measurements', () => {
        it('should measure frequency correctly', () => {
            functionGenerator.setFrequency(1000);
            functionGenerator.start();

            const measurements = oscilloscope.getMeasurements('ch1');
            expect(measurements.frequency).toBeCloseTo(1000, 1);
        });

        it('should measure amplitude correctly', () => {
            functionGenerator.setAmplitude(5);
            functionGenerator.start();

            const measurements = oscilloscope.getMeasurements('ch1');
            expect(measurements.amplitude).toBeCloseTo(5, 0.1);
        });
    });

    describe('Activity Completion', () => {
        it('should validate student measurements', () => {
            const studentMeasurements = {
                frequency: '1000',
                amplitude: '5',
                period: '0.001'
            };

            expect(oscilloscope.validateMeasurements(studentMeasurements)).toBe(true);
        });

        it('should track measurement accuracy', () => {
            const accuracy = oscilloscope.getMeasurementAccuracy();
            expect(accuracy).toBeGreaterThanOrEqual(0);
            expect(accuracy).toBeLessThanOrEqual(100);
        });
    });

    describe('User Interface', () => {
        it('should handle timebase changes', () => {
            oscilloscope.setTimePerDiv(0.1);
            expect(oscilloscope.getSettings().timePerDiv).toBe(0.1);
        });

        it('should handle trigger adjustments', () => {
            oscilloscope.setTriggerLevel(2.5);
            expect(oscilloscope.getSettings().triggerLevel).toBe(2.5);
        });
    });
}); 