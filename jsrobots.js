import { Simulator } from "./Simulator.js";
import { Renderer2D } from "./Renderer2D.js";

import { TestRobot } from "./TestRobot.js";
import { BestRobot } from "./BestRobot.js";
import { BestRobot2 } from "./BestRobot2.js";
import { BinaryRobot } from "./BinarySearchRobot.js";

let sim = Simulator({TIME_TO_RECHARGE_FIRE: 20});
let renderer = Renderer2D(document.getElementById('container'));
sim.attachRenderer(renderer);

const randomPosition = function() {
    return {
        x:Math.random()*1000,
        y:Math.random()*1000,
    }
}
let N = 3;
for(let i=0; i<N; i++) {
    sim.addRobot('TestRobot._'+i,TestRobot(),randomPosition())
}
for(let i=0; i<N; i++) {
    sim.addRobot('BestRobot_'+i,BestRobot(),randomPosition())
}
for(let i=0; i<N; i++) {
    sim.addRobot('BestRobot2_'+i,BestRobot2(Math.PI/32),randomPosition())
}
for(let i=0; i<N; i++) {
    sim.addRobot('BinaryRobot_'+i,BinaryRobot(0.05),randomPosition())
}


const tid = setInterval(()=>{
    if(!sim.simulate()) clearInterval(tid);
},10);