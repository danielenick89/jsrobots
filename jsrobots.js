import { Simulator } from "./Simulator.js";
import { Renderer2D } from "./Renderer2D.js";

import { TestRobot } from "./TestRobot.js";
import { BestRobot } from "./BestRobot.js";

let sim = Simulator({TIME_TO_RECHARGE_FIRE: 20});
let renderer = Renderer2D(document.getElementById('container'));
sim.attachRenderer(renderer);

const randomPosition = function() {
    return {
        x:Math.random()*1000,
        y:Math.random()*1000,
    }
}


sim.addRobot('TestRobot',TestRobot(),{x:300,y:300});
[1,2,3,4].forEach((e)=>sim.addRobot('BestRobot'+e,BestRobot(),randomPosition()));
[1,2,3,4].forEach((e)=>sim.addRobot('TestRobot'+e,TestRobot(),randomPosition()))


const tid = setInterval(()=>{
    if(!sim.simulate()) clearInterval(tid);
},100);