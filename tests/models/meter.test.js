import { describe, it, expect } from 'vitest';
import Meter from '@/models/meter.js';

describe('Meter', () => {
    it('should initialize with default values', () => {
        const meter = new Meter();
        expect(meter.voltage).toBe(0);
        expect(meter.current).toBe(0);
        expect(meter.resistance).toBe(0);
        expect(meter.mode).toBe('voltage');
    });

    it('should emit change event when values are updated', () => {
        const meter = new Meter();
        let changed = false;
        meter.on('change', () => changed = true);
        
        meter.setVoltage(5);
        expect(changed).toBe(true);
        expect(meter.voltage).toBe(5);
    });
}); 