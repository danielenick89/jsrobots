import { Simulator } from "./Simulator.js";
import { Renderer2D } from "./Renderer2D.js";

import { TestRobot } from "./TestRobot.js";
import { BestRobot } from "./BestRobot.js";
import { BestRobot2 } from "./BestRobot2.js";
import { BinaryRobot } from "./BinarySearchRobot.js";



const randomPosition = function() {
    return {
        x:Math.random()*1000,
        y:Math.random()*1000,
    }
}

const Robots = [
    TestRobot,
    BestRobot,
    BestRobot2,
    BinaryRobot
]
let tid;
let currentRobot = BinaryRobot;
function runSimulation(robot,{N=1,TIME_STEP=8,RUN_PER_STEP=1,RENDER=true},cb) {
    if(tid) clearInterval(tid);
    let sim = Simulator({TIME_TO_RECHARGE_FIRE: 100});
    
    if(RENDER)  {
        const renderer = Renderer2D(document.getElementById('container'));
        sim.attachRenderer(renderer);
    }
   
    const name = robot.name||'YourRobot';
    
    for(let i=0; i<N; i++) {
        let instanceName = name+'_'+i
        sim.addRobot(instanceName,robot(name,i),randomPosition(),name)
    }
    for(let i=0; i<N; i++) {
        let team = currentRobot.name;
        sim.addRobot(team+'_'+i,currentRobot(team,i),randomPosition(),team)
     }
    
    
    tid = setInterval(()=>{
        if(!sim.simulate(RUN_PER_STEP)) {
            clearInterval(tid);
            cb(sim.getRobots()[0]?.team==name);
            
        }
    },TIME_STEP);    
}

const stats = {total:0}
let runNext = (i,cb) => {
    if(i==1) {
        cb(stats) 
        return
    }
    stats.total++
    runBenchmark((winner)=>{
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
    currentRobot = selectedRobot;
    let code = window.editor.getValue()
    let robot = eval('('+code+')');

    let n = document.getElementById('robotCount').value*1;
    if(!n || n<0) n=1; 
    runSimulation(robot,{N:n},function(isWinner) {
        console.log(isWinner ? 'win' : 'loss')
    })
}

const reset = function() {
    localStorage.clear('code')
    location.reload()
}

const persistToLocalStorage = function(code) {
    localStorage.setItem('code',code)
}

const loadFromLocalStorage = function() {
    let s = localStorage.getItem('code') 
    if(s) {
        window.editor.setValue(s);
    }
}

const benchmark = function() {
    currentRobot = selectedRobot;
    let code = window.editor.getValue()
    let robot = eval('('+code+')');

    let n = document.getElementById('robotCount').value*1;
    if(!n || n<0) n=1; 

    let RUN_COUNT = 1000;
    let count=0,wins = 0;
    const once = function(cb) {
        if(count++ == RUN_COUNT) {
            cb();
            return
        }
        runSimulation(robot,{N:n,TIME_STEP:0,RUN_PER_STEP:1000,RENDER:false},function(isWinner) {
            if(isWinner) wins++;
            document.getElementById('benchmarkResults').innerHTML = 'Your robots wins ' +(wins/count*100).toFixed(1)+ '% of  times. (run '+count+ ' of '+RUN_COUNT+ ')'
            once(cb);
        })
    }

    once(()=>{
    });
}
let selectedRobot = BinaryRobot;

const getOption = (r,i) => {
    let o = document.createElement('option');
    o.value = i

    o.innerHTML = r.name;
    if(r == selectedRobot) o.selected = true;

    return o;
}

let options = document.querySelector('#robotSelect');

options.onchange = function() {
    selectedRobot = Robots[options.value*1]
}

for(let i=0; i<Robots.length; i++) {
    let r = Robots[i]
    options.appendChild(getOption(r,i));
}

document.getElementById('goButton').addEventListener('click',go);
document.getElementById('resetButton').addEventListener('click',reset);
document.getElementById('benchmarkButton').addEventListener('click',benchmark);
editor.getSession().on('change', function() {
    persistToLocalStorage(editor.getSession().getValue())
});

loadFromLocalStorage();


