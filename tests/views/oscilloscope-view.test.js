import { describe, it, expect, vi } from 'vitest';
import OscilloscopeView from '@/views/oscilloscope-view.js';
import Oscilloscope from '@/models/oscilloscope.js';

describe('OscilloscopeView', () => {
    it('should render with initial model state', () => {
        const container = document.createElement('div');
        const model = new Oscilloscope();
        const view = new OscilloscopeView(container, model);
        
        expect(container.querySelector('svg')).toBeTruthy();
        expect(container.querySelector('.oscilloscope-controls')).toBeTruthy();
    });

    it('should update when model changes', () => {
        const container = document.createElement('div');
        const model = new Oscilloscope();
        const view = new OscilloscopeView(container, model);
        const updateSpy = vi.spyOn(view, 'update');
        
        model.setTimePerDiv(2);
        expect(updateSpy).toHaveBeenCalled();
    });
}); 