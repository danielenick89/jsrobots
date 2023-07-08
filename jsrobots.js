import { Simulator } from "./Simulator.js";
import { Renderer2D } from "./Renderer2D.js";

import { TestRobot } from "./TestRobot.js";
import { BestRobot } from "./BestRobot.js";
import { BestRobot2 } from "./BestRobot2.js";
import { BinaryRobot } from "./BinarySearchRobot.js";

let sim = Simulator({TIME_TO_RECHARGE_FIRE: 10});
let renderer = Renderer2D(document.getElementById('container'));
sim.attachRenderer(renderer);

const randomPosition = function() {
    return {
        x:Math.random()*1000,
        y:Math.random()*1000,
    }
}

function runSimulation(robot,N=1,cb) {
    // for(let i=0; i<N; i++) {
    //     sim.addRobot('TestRobot._'+i,TestRobot(),randomPosition())
    // }
    // for(let i=0; i<N; i++) {
    //     sim.addRobot('BestRobot_'+i,BestRobot(),randomPosition())
    // }
    for(let i=0; i<N; i++) {
        sim.addRobot('You_'+i,robot,randomPosition())
    }
    for(let i=0; i<N; i++) {
        sim.addRobot('BinaryRobot_'+i,BinaryRobot(0.1),randomPosition())
     }
    
    
    const tid = setInterval(()=>{
        if(!sim.simulate()) {
            clearInterval(tid);
            cb(sim.getRobots()[0]?.name.split('_')[0]);
        }
    },0);    
}

const stats = {total:0}
let runNext = (i,cb) => {
    if(i==1) {
        cb(stats) 
        return
    }
    stats.total++
    runSimulation((winner)=>{
        if(!stats[winner]) stats[winner] = 0
        stats[winner]++;
        runNext(i+1,cb);
    });
}

// runNext(0,function(stats) {
//     let ranking = [];
//     for(let key in stats) {
//         if(key === "total") continue
//         ranking.push({name: key, wins: stats[key]/stats.total})
//     }
    
//     ranking.sort((a,b)=>b.wins-a.wins)
//     console.log(JSON.stringify(ranking))
// })

const go = function() {

    let code = document.getElementById('code').value
    let robot = eval('('+code+')')();
    runSimulation(robot,1,function(winner) {
        console.log(winner)
    })
}


document.getElementById('goButton').addEventListener('click',go);



