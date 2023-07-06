
const BestRobot = function() {

    const nextAngle = function() {
        return lastAngle+=0.05;
    }
    const randomAngle = function() {
        return Math.random()*2*Math.PI-Math.PI;
    }

    let lastAngle = randomAngle();
    let lastGoodAngle = null;
    let lastGoodDistance = null;
    let dir = 0;

    return function({scan,fire}) {
        let a = nextAngle();
        let dist = scan(a,0.5);
        if(dist>0) {
            lastGoodAngle = a;
            lastGoodDistance = dist;
        }
        if(lastGoodAngle !== null) fire(lastGoodAngle,lastGoodDistance)
        if(Math.random()<0.005) dir+=Math.PI
        return {angle:dir+=Math.random()*0.2-0.1}
    }
}

export { BestRobot }