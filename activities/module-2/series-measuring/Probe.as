package {
    
    import flash.display.MovieClip;
    import flash.events.MouseEvent;
    import flash.geom.Point;
    
    import org.concord.sparks.JavaScript;
    import org.concord.sparks.util.Display;

    public class Probe extends MovieClip {

        private var circuit:Circuit;
        private var connection:Object = null;
        private var id:String;

        private var _dragging:Boolean = false;
        private var _down:Boolean = false;
    
        public function Probe() {
            //trace('ENTER Probe#Probe');
            super();
            id = this.name;
            trace('Probe id=' + id);
            
            this.addEventListener(MouseEvent.MOUSE_DOWN, onMouseDown);
            this.addEventListener(MouseEvent.MOUSE_UP, onMouseUp);
            this.addEventListener(MouseEvent.MOUSE_MOVE, onMouseMove);
        }
        
        public function getId() {
            return id;
        }
        
        public function getConnection():Object {
            return connection;
        }
        
        public function setConnection(connection:Object):void {
            this.connection = connection;
        }

        public function setCircuit(circuit:Circuit) {
            //trace('ENTER Probe#setCircuit');
            this.circuit = circuit;
        }

        public function getTipPos():Point {
            return Display.localToStage(this.parent, new Point(this.x, this.y));
        }
        
        public function onMouseDown(event:MouseEvent):void {
            _down = true;
        }
        
        public function onMouseUp(event:MouseEvent):void {
            //trace('ENTER Probe#onMouseUp');
            this.stopDrag();
            _down = false;
            if (_dragging) {
                _dragging = false;
                circuit.updateProbeConnection(this);
            }
        }
        
        public function onMouseMove(event:MouseEvent):void {
            //trace('ENTER Probe#onMouseMove');
            if (! _down) {
                return;
            }
            if (! _dragging) {
                _dragging = true;
                this.startDrag();
                if (connection) {
                    disConnect();
                }
            }
        }
        
        private function disConnect():void {
            JavaScript.instance().sendEvent('disconnect', getId(), connection.getId());
            connection = null;
        }
    }
}