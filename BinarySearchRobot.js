
const BinaryRobot = function(FIRE_WIDTH=0.1) {

    let dir = 0;
    let w = Math.PI;
    let a=Math.random()*2*Math.PI;
    const THRESH = 50;

    let queue = [];
    let next = {a,w}
    return function({scan,fire,state}) {
        let {a,w} = next;
        let s = scan(a,w);
        if(s!==null) {
            if(s>0 && w<=FIRE_WIDTH) {
                fire(a,s);
                return 
            } else {
                if(s>0) {
                    queue=[]
                    queue.push({w:w/2,a:a-w/4})
                    queue.push({w:w/2,a:a+w/4})
                } else {
                    if(w==Math.PI) a+=Math.PI
                    queue.push({w:Math.min(Math.PI,w*2),a})
                }
            }
            next = queue.shift();
        }
        if(state.position.x < THRESH) dir = 0;
        if(state.position.x > state.arena.width - THRESH) dir = Math.PI;
        if(state.position.y < THRESH) dir = Math.PI/2;
        if(state.position.y > state.arena.height - THRESH) dir = 3/2*Math.PI;
        return {angle: dir+=Math.random()*0.2-0.1}
    }
}

export { BinaryRobot }