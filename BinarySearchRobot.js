
const BinaryRobot = function(team,id) {

    const FIRE_WIDTH = 0.1;
    const THRESH = 20;
    let w = Math.PI;
    let a=Math.random()*2*Math.PI;
    let time = 0;

    let destQ = [
        {x:50,y:50},
        {x:750,y:50},
        {x:750,y:750},
        {x:50,y:750},
    ]

    
    let currDest = id%4;
    let dest = destQ[currDest];

    let queue = [];
    let next = {a,w}
    return function({scan,fire,state}) {
        time++;
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
        /*if(state.position.x < THRESH) dir = 0;
        if(state.position.x > state.arena.width - THRESH) dir = Math.PI;
        if(state.position.y < THRESH) dir = Math.PI/2;
        if(state.position.y > state.arena.height - THRESH) dir = 3/2*Math.PI;*/
        

        let dx = state.position.x-dest.x;
        let dy = state.position.y-dest.y;
        if(Math.sqrt(dx**2+dy**2)<THRESH) {
            currDest++;
            currDest%=4;
            dest = destQ[currDest];
        }
        
        let dir = Math.PI+Math.atan2(dy,dx)
        return {angle: dir}//dir+= Math.random()*0.2-0.1 }
    }
}

export { BinaryRobot }