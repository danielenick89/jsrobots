
const BestRobot2 = function() {
    const INC = 0.2;
    const nextAngle = function(inc) {
        return lastAngle+=inc;
    }
    const randomAngle = function() {
        return Math.random()*2*Math.PI-Math.PI;
    }

    let lastAngle = randomAngle();
    let lastGoodAngle = null;
    let lastGoodDistance = null;
    let dir = 0;

    let i = 0;
    let lastI;

    return function({scan,fire}) {
        i++;
        let a = nextAngle(INC);
        let dist = scan(a,INC);
        
        if(dist!==null) {
            if(dist>=0) {
                lastI=i;
                lastGoodAngle = a;
                lastGoodDistance = dist;
            }
        }else {
            nextAngle(-INC)
        }
        if(lastGoodAngle !== null && lastGoodDistance > 20) fire(lastGoodAngle,lastGoodDistance)
        if(Math.random()<0.005) dir+=Math.PI
        return {angle: i-lastI<(8*Math.PI/INC) ? lastGoodAngle : dir+=Math.random()*0.2-0.1}
    }
}

export { BestRobot2 }