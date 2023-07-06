
const Simulator = ((options)=>{

    const TIME_TO_RECHARGE_FIRE = options?.TIME_TO_RECHARGE_FIRE || 15;
    const TIME_TO_RECHARGE_SCAN = options?.TIME_TO_RECHARGE_SCAN || 3;
    const SCAN_RANGE = options?.SCAN_RANGE || 500;
    const MAX_BOMB_RANGE = options?.MAX_BOMB_RANGE || 700;
    const ROBOTS_SPEED = options?.ROBOTS_SPEED || 1;
    const BOMBS_SPEED = options?.BOMBS_SPEED || 10;
    const WIDTH = options?.WIDTH || 1000;
    const HEIGHT = options?.HEIGHT || 1000;
    const BOMB_DAMAGE_RANGE = options?.BOMB_DAMAGE_RANGE || 30;
    const BOMB_DAMAGE_RATIO = options?.BOMB_DAMAGE_RATIO || 1;

    let time = 0;
    const renderers = []
    const robots = []
    const bombs = []


    const attachRenderer = function(renderer) {
        renderers.push(renderer)
        renderer.init({width:WIDTH,height:HEIGHT})
    }

    const addRobot = function(name,brain,position) {
        robots.push({brain,name,state: { 
            position:position || {x:WIDTH/2,y:HEIGHT/2}, 
            health: 1,
            timeToRechargeFire: 0,
            timeToRechargeScan: 0,
        }})
    }

    const simulateStep = function() {
        robots.forEach(updateRobot)
        bombs.forEach((b,i)=>{
            if(updateBomb(b)) {
                bombs.splice(i,1);
            }
        })
        time++;
        renderers.forEach(updateRenderer)
        if(robots.length <= 1) return false;
        return true;
    }

    const isAngleInRange = function(angle, centerAngle, width) {
        // Normalize the angle to be between 0 and 2*pi
        angle = ((angle % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI);
        
        // Normalize the center angle to be between 0 and 2*pi
        centerAngle = ((centerAngle % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI);
      
        // Calculate the start and end angles of the range
        const startAngle = ((centerAngle - width / 2) + (2 * Math.PI)) % (2 * Math.PI);
        const endAngle = ((centerAngle + width / 2) + (2 * Math.PI)) % (2 * Math.PI);
      
        // Check if the angle is within the range
        if (startAngle <= endAngle) {
          return angle >= startAngle && angle <= endAngle;
        } else {
          return angle >= startAngle || angle <= endAngle;
        }
      }

    const updateRobot = function(robot) {
        let scanLock = robot.state.timeToRechargeScan > 0;
        let fireLock = robot.state.timeToRechargeFire > 0;
        if(robot.state.timeToRechargeFire) robot.state.timeToRechargeFire--;
        if(robot.state.timeToRechargeScan) robot.state.timeToRechargeScan--;

        const scan = function(angle,angleWidth) {
            if(scanLock) return null;
            scanLock = true;
            robot.state.timeToRechargeScan = TIME_TO_RECHARGE_SCAN
            
            const robotsInRange = robots.filter(r=>distance(r.state.position,robot.state.position)<=SCAN_RANGE).filter(e=>e!=robot).filter(r=>{
                let a = Math.PI + getAngle(robot.state.position,r.state.position)
                return isAngleInRange(a,angle,angleWidth);
            });

            if(robotsInRange.length) {

                return robotsInRange.reduce((c,e)=>Math.min(c,distance(robot.state.position,e.state.position)),distance(robot.state.position,robotsInRange[0].state.position));
            }
            return -1
        }
        const fire = function(angle,distance) {
            if(fireLock) return null;
            fireLock = true
            robot.state.timeToRechargeFire = TIME_TO_RECHARGE_FIRE

            if(distance>MAX_BOMB_RANGE) distance = MAX_BOMB_RANGE;

            bombs.push({
                state: {
                    position: {...robot.state.position},
                    destination: {
                        x:robot.state.position.x+Math.cos(angle)*distance,
                        y:robot.state.position.y+Math.sin(angle)*distance,
                    }
                }
            })
        }

        const {angle} = robot.brain({scan,fire});
        if(angle !== undefined) {
            robot.state.position.x += Math.cos(angle)*ROBOTS_SPEED;
            robot.state.position.y += Math.sin(angle)*ROBOTS_SPEED;
            if(robot.state.position.x<0) robot.state.position.x = 0;
            if(robot.state.position.x>WIDTH) robot.state.position.x = WIDTH;
            if(robot.state.position.y<0) robot.state.position.y = 0;
            if(robot.state.position.y>HEIGHT) robot.state.position.y = HEIGHT;
        }
    }

    const distance = function(a,b) {
        return Math.sqrt((a.x-b.x)**2 + (a.y-b.y)**2);
    }

    const getAngle = function(p1,p2) {
        const dy = p1.y - p2.y;
        const dx = p1.x - p2.x;
        const theta = Math.atan2(dy, dx); 
        return theta;
    }

    const updateBomb = function(bomb) {

        let d = distance(bomb.state.position,bomb.state.destination);
        if(BOMBS_SPEED>=d) {
            explode(bomb.state.destination);
            return true;
        } else {
            let ratio = BOMBS_SPEED/d;
            bomb.state.position.x = (ratio)*bomb.state.destination.x+(1-ratio)*bomb.state.position.x
            bomb.state.position.y = (ratio)*bomb.state.destination.y+(1-ratio)*bomb.state.position.y
            return false;
        }
    }

    const explode = function(point) {
        log(`bomb exploding at (${point.x},${point.y})`)
        robots.forEach((r,i)=>{
            const d =  distance(point,r.state.position);
            if(d < BOMB_DAMAGE_RANGE) {
                const damage = (1-d/BOMB_DAMAGE_RANGE)*BOMB_DAMAGE_RATIO;
                if(r.state.health<=damage) {
                    robots.splice(i,1)
                    log(`robot '${r.name}' died`)
                } else {
                    r.state.health-=damage;
                }
            }
        })
    }

    const simulate = function(steps=1) {
        for(let i=0; i<steps; i++) {
            if(!simulateStep()) return false;
        }
        return true;
    }

    const updateRenderer = function(renderer) {
        renderer.render({
            robots: robots.map(e=>({position:e.state.position,name:e.name,health:e.state.health})),
            bombs:bombs.map(e=>({position:e.state.position,destination:e.state.destination}))
        })
    }

    const log = function(msg) {
        //console.log(msg)
    }

    return {
        addRobot,
        attachRenderer,
        simulate
    }
});

export { Simulator } 