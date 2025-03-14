import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import Workbench from '@/models/workbench.js';
import WorkbenchView from '@/views/workbench-view.js';

describe('Workbench Integration', () => {
    let container;
    let workbench;
    let view;

    beforeEach(() => {
        container = document.createElement('div');
        workbench = new Workbench();
        view = new WorkbenchView(container, workbench);
    });

    afterEach(() => {
        // Clean up
        container.remove();
    });

    it('should handle component addition through view', () => {
        const component = { type: 'resistor', value: '100' };
        view.emit('componentAdded', component);
        expect(workbench.components).toContainEqual(component);
    });

    it('should handle multiple component additions', () => {
        const components = [
            { type: 'resistor', value: '100' },
            { type: 'capacitor', value: '10uF' },
            { type: 'inductor', value: '1mH' }
        ];

        components.forEach(component => {
            view.emit('componentAdded', component);
        });

        expect(workbench.components).toHaveLength(3);
        components.forEach(component => {
            expect(workbench.components).toContainEqual(component);
        });
    });

    it('should handle component removal', () => {
        const component = { type: 'resistor', value: '100' };
        view.emit('componentAdded', component);
        view.emit('componentRemoved', component);
        expect(workbench.components).toHaveLength(0);
    });

    it('should update view when workbench model changes', () => {
        const component = { type: 'resistor', value: '100' };
        let viewUpdated = false;
        
        view.on('update', () => {
            viewUpdated = true;
        });

        workbench.addComponent(component);
        expect(viewUpdated).toBe(true);
    });

    it('should handle component connections', () => {
        const resistor = { type: 'resistor', value: '100', id: '1' };
        const capacitor = { type: 'capacitor', value: '10uF', id: '2' };
        
        view.emit('componentAdded', resistor);
        view.emit('componentAdded', capacitor);
        view.emit('connectionMade', { from: resistor.id, to: capacitor.id });

        expect(workbench.connections).toContainEqual({
            from: resistor.id,
            to: capacitor.id
        });
    });

    it('should validate component values', () => {
        const invalidComponent = { type: 'resistor', value: 'invalid' };
        
        expect(() => {
            view.emit('componentAdded', invalidComponent);
        }).toThrow();
    });

    it('should maintain component positions', () => {
        const component = { 
            type: 'resistor', 
            value: '100',
            position: { x: 100, y: 100 }
        };

        view.emit('componentAdded', component);
        view.emit('componentMoved', {
            id: component.id,
            position: { x: 150, y: 150 }
        });

        const updatedComponent = workbench.components.find(c => c.id === component.id);
        expect(updatedComponent.position).toEqual({ x: 150, y: 150 });
    });

    it('should handle component value changes', () => {
        const component = { 
            type: 'resistor', 
            value: '100',
            id: '1'
        };

        view.emit('componentAdded', component);
        view.emit('componentValueChanged', {
            id: component.id,
            value: '200'
        });

        const updatedComponent = workbench.components.find(c => c.id === component.id);
        expect(updatedComponent.value).toBe('200');
    });

    describe('Event propagation', () => {
        it('should propagate model changes to view', () => {
            let updateCount = 0;
            view.on('update', () => updateCount++);

            workbench.addComponent({ type: 'resistor', value: '100' });
            workbench.addComponent({ type: 'capacitor', value: '10uF' });

            expect(updateCount).toBe(2);
        });

        it('should handle rapid component additions', () => {
            const components = Array.from({ length: 100 }, (_, i) => ({
                type: 'resistor',
                value: `${i}`,
                id: `r${i}`
            }));

            components.forEach(component => {
                view.emit('componentAdded', component);
            });

            expect(workbench.components).toHaveLength(100);
        });
    });
}); 