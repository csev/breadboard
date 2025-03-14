import { extend } from '../helpers/util.js';
import Resistor from './resistor.js';

class VariableResistor extends Resistor {
    constructor(props, breadboardController) {
        super(props, breadboardController);
        this.init(props.UID);
        this.resistance = this.minimumResistance;
    }

    getMinResistance() {
        return this.minimumResistance;
    }

    getMaxResistance() {
        return this.maximumResistance;
    }

    scaleResistance(value) {
        let perc = value / 10;       // values are 0-10
        let range = this.maximumResistance - this.minimumResistance;
        let newValue = this.minimumResistance + (range * perc);
        this.resistance = newValue;
    }
}

export default VariableResistor;
