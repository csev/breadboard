import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EditComponentsView } from '@/views/edit-components-view.js';
import { LogEvent } from '@/models/log.js';
import { logController } from '@/controllers/log-controller.js';

describe('EditComponentsView', () => {
    let view;
    let mockWorkbenchController;
    let mockBreadboardController;
    let mockComponent;

    beforeEach(() => {
        // Setup mocks
        mockComponent = {
            UID: 'test-uid',
            componentTypeName: 'Resistor',
            isEditable: true,
            editableProperty: {
                name: 'resistance',
                units: 'Ω'
            },
            resistance: 100,
            getEditablePropertyValues: () => [50, 100, 150],
            changeEditableValue: vi.fn()
        };

        mockBreadboardController = {
            getComponents: () => ({ 'test-uid': mockComponent }),
            removeComponent: vi.fn()
        };

        mockWorkbenchController = {
            breadboardView: {
                setRightClickFunction: vi.fn(),
                useSelectInPropertyEditor: false,
                showTooltip: vi.fn()
            },
            workbench: {
                showComponentDrawer: true,
                meter: {
                    update: vi.fn()
                }
            }
        };

        // Create view instance
        view = new EditComponentsView(mockWorkbenchController, mockBreadboardController);
    });

    it('should initialize with correct controllers', () => {
        expect(view.workbenchController).toBe(mockWorkbenchController);
        expect(view.breadboardController).toBe(mockBreadboardController);
        expect(mockWorkbenchController.breadboardView.setRightClickFunction)
            .toHaveBeenCalledWith(view, 'showEditor');
    });

    it('should create editor with slider for editable component', () => {
        view.showEditor('test-uid');

        expect(mockWorkbenchController.breadboardView.showTooltip)
            .toHaveBeenCalledWith('test-uid', expect.any(HTMLElement));
    });

    it('should create editor with select for editable component when useSelectInPropertyEditor is true', () => {
        mockWorkbenchController.breadboardView.useSelectInPropertyEditor = true;
        view.showEditor('test-uid');

        expect(mockWorkbenchController.breadboardView.showTooltip)
            .toHaveBeenCalledWith('test-uid', expect.any(HTMLElement));
    });

    it('should handle component removal', () => {
        view.showEditor('test-uid');
        
        // Find and click the remove button
        const editor = mockWorkbenchController.breadboardView.showTooltip.mock.calls[0][1];
        const removeButton = editor.querySelector('button');
        removeButton.click();

        expect(mockBreadboardController.removeComponent).toHaveBeenCalledWith(mockComponent);
        expect(mockWorkbenchController.workbench.meter.update).toHaveBeenCalled();
    });

    it('should log value changes', () => {
        const mockLogEvent = vi.spyOn(logController, 'addEvent');
        view.showEditor('test-uid');

        // Simulate value change
        const event = { originalEvent: { type: 'change' } };
        view.showEditor('test-uid');
        const editor = mockWorkbenchController.breadboardView.showTooltip.mock.calls[0][1];
        const select = editor.querySelector('select');
        
        if (select) {
            select.value = '150';
            select.dispatchEvent(new Event('change'));
        }

        expect(mockLogEvent).toHaveBeenCalledWith(
            LogEvent.CHANGED_CIRCUIT,
            expect.objectContaining({
                type: 'changed component value',
                UID: 'test-uid'
            })
        );
    });
}); 