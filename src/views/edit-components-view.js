import { LogEvent } from '../models/log.js';
import { logController } from '../controllers/log-controller.js';
import { toEngineering } from '../helpers/unit.js';

export class EditComponentsView {
    constructor(workbenchController, breadboardController) {
        this.workbenchController = workbenchController;
        this.breadboardController = breadboardController;

        if (workbenchController.breadboardView) {
            workbenchController.breadboardView.setRightClickFunction(this, "showEditor");
        } else {  // queue it up
            workbenchController.workbench.view.setRightClickFunction(this, "showEditor");
        }
    }

    showEditor(uid) {
        const comp = this.breadboardController.getComponents()[uid];
        const section = this.workbenchController.workbench;
        let $propertyEditor = null;
        const possibleValues = comp.getEditablePropertyValues();

        const updateValue = (evt, val) => {
            const eng = toEngineering(val, comp.editableProperty.units);
            document.querySelector(`.prop_value_${uid}`).textContent = eng.value + eng.units;
            comp.changeEditableValue(val);
            logController.addEvent(LogEvent.CHANGED_CIRCUIT, {
                "type": "changed component value",
                "UID": comp.UID,
                "value": val,
                "via": evt.originalEvent ? evt.originalEvent.type || 'n/a' : 'n/a'
            });
            section.meter.update();
        };

        const sliderChange = (evt, ui) => {
            updateValue(evt, possibleValues[ui.value]);
        };

        const selectChange = function(evt) {
            updateValue(evt, this.value);
            // remove focus from the select
            this.blur();
        };

        const componentValueFinished = (evt, ui) => {
            if (evt.originalEvent?.type === 'mouseup') {
                logController.addEvent(LogEvent.CHANGED_CIRCUIT, {
                    "type": "changed component value",
                    "UID": comp.UID,
                    "value": possibleValues[ui.value],
                    "via": evt.originalEvent.type
                });
            }
        };

        if (comp.isEditable) {
            const propertyName = comp.editableProperty.name.charAt(0).toUpperCase() + 
                               comp.editableProperty.name.slice(1);
            const initialValue = comp[comp.editableProperty.name];
            const initialValueEng = toEngineering(initialValue, comp.editableProperty.units);
            const initialValueText = initialValueEng.value + initialValueEng.units;

            if (this.workbenchController.breadboardView.useSelectInPropertyEditor) {
                const options = possibleValues.map(value => {
                    const eng = toEngineering(value, comp.editableProperty.units);
                    return `<option value='${value}'${value === initialValue ? " selected" : ""}>${eng.value}${eng.units}</option>`;
                });
                $propertyEditor = this.createSelectEditor(options, selectChange);
            } else {
                $propertyEditor = this.createSliderEditor({
                    possibleValues,
                    initialValue,
                    propertyName,
                    initialValueText,
                    uid,
                    sliderChange,
                    componentValueFinished
                });
            }
        }

        const $editor = this.createEditorContainer(comp, $propertyEditor, uid, section);
        this.workbenchController.breadboardView.showTooltip(uid, $editor);
    }

    createSelectEditor(options, onChange) {
        const select = document.createElement('select');
        select.innerHTML = options.join('\n');
        select.addEventListener('change', onChange);

        const container = document.createElement('div');
        const wrapper = document.createElement('div');
        wrapper.appendChild(select);
        container.appendChild(wrapper);
        return container;
    }

    createSliderEditor({ possibleValues, initialValue, propertyName, initialValueText, uid, sliderChange, componentValueFinished }) {
        const container = document.createElement('div');
        
        const slider = document.createElement('div');
        $(slider).slider({
            max: possibleValues.length - 1,
            slide: sliderChange,
            stop: componentValueFinished,
            value: possibleValues.indexOf(initialValue)
        });

        const valueDisplay = document.createElement('div');
        valueDisplay.innerHTML = `${propertyName}: <span class='prop_value_${uid}'>${initialValueText}</span>`;

        container.appendChild(slider);
        container.appendChild(valueDisplay);
        return container;
    }

    createEditorContainer(comp, $propertyEditor, uid, section) {
        const container = document.createElement('div');
        container.className = 'editor';
        container.style.width = '130px';
        container.style.textAlign = 'right';

        const title = document.createElement('h3');
        title.textContent = `Edit ${comp.componentTypeName}`;
        container.appendChild(title);

        if ($propertyEditor) {
            container.appendChild($propertyEditor);
        }

        // Add remove button if components can be added back
        if (this.workbenchController.workbench.showComponentDrawer) {
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.addEventListener('click', () => {
                this.breadboardController.removeComponent(comp);
                section.meter.update();
                document.querySelector('.speech-bubble').dispatchEvent(new Event('mouseleave'));
            });
            container.appendChild(removeButton);
        }

        // Add visual feedback
        const feedback = document.createElement('div');
        feedback.className = 'feedback';
        feedback.style.marginTop = '10px';
        feedback.style.color = 'green';
        container.appendChild(feedback);

        // Update feedback on value changes
        const showFeedback = (message) => {
            feedback.textContent = message;
            setTimeout(() => feedback.textContent = '', 2000);
        };

        // Add to your event listeners
        container.addEventListener('change', () => showFeedback('Value updated!'));
        
        return container;
    }
}
