
const TestRobot = function() {


    const nextAngle = function() {
        return lastAngle+=0.05;
    }
    const randomAngle = function() {
        return Math.random()*2*Math.PI-Math.PI;
    }

    let lastAngle = 0 //&& randomAngle();


    return function({scan,fire}) {
        let a = nextAngle();
        let dist = scan(a,0.5);
        if(dist>0) fire(a,dist)
        return {angle:randomAngle()}
    }
}



export { TestRobot }