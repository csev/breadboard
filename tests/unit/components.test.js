import { 
    testUtils, 
    mockSparks, 
    helpers, 
    generators 
} from '../setup/test-utils.js';

describe('Component Tests', () => {
    let cleanup;
    
    beforeEach(() => {
        const env = setupTestEnvironment();
        cleanup = env.cleanup;
    });
    
    afterEach(() => {
        cleanup();
    });
    
    it('should handle flash interactions', () => {
        const flash = mockSparks.flash;
        const movie = flash.getFlashMovie('test');
        expect(typeof movie.sendMessageToFlash).toBe('function');
    });
    
    it('should convert object values to array', () => {
        const obj = { a: 1, b: 2, c: 3 };
        const values = testUtils.objectValues(obj);
        expect(values).toEqual([1, 2, 3]);
    });
    
    it('should create mock components', () => {
        const resistor = testUtils.createMockComponent('resistor', {
            value: '100Ω'
        });
        expect(resistor.type).toBe('resistor');
        expect(resistor.value).toBe('100Ω');
    });
    
    it('should handle events', async () => {
        const emitter = helpers.createMockEmitter();
        let called = false;
        
        emitter.on('test', () => called = true);
        emitter.emit('test');
        
        await helpers.nextTick();
        expect(called).toBe(true);
    });
    
    it('should generate test data', () => {
        const measurement = generators.createMockMeasurement(
            'voltage', 
            5.0
        );
        expect(measurement.type).toBe('voltage');
        expect(measurement.value).toBe(5.0);
    });
}); 