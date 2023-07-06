
const Renderer2D = ((container)=>{
    let arena,list;
    let robots = {};
    let robotCount = 0;
    let W,H;
    const bombs = [];
    const init = function({width,height}){
        arena = document.createElement('div');
        arena.className = 'arena';
        container.appendChild(arena);
        list = document.createElement('ol');
        list.className = 'robot-list';
        container.appendChild(list);
        W=width;
        H=height;
        arena.style.width = W+'px';
        arena.style.height = H+'px';
    }

    const createRobotElement = function(name) {
        const el = document.createElement('div');
        el.className = 'robot';
        arena.appendChild(el);
        return el;
    }

    const createBombElement = function() {
        const el = document.createElement('div');
        el.className = 'bomb';
        arena.appendChild(el);
        return el;
    }

    const refreshRobots = function(rs) {
        for(let key in robots) {
            let r = robots[key];
            arena.removeChild(r);
        }

        robots = {}
        list.innerHTML = '';
        for(const robot of rs) {
            let r = document.createElement('li');
            r.innerHTML = robot.name;
            list.appendChild(r);
        }

        for(let i=0; i<rs.length; i++) {
            robots[rs[i].name] = (createRobotElement(rs[i].name));
        }
        robotCount = rs.length;
    }

    const updatePosition = function(el,p) {
        el.style.left = p.x/W*100+'%';
        el.style.top = p.y/H*100+'%';
    }

    let render = function(data) {
        if(data.robots.length != robotCount) {
            refreshRobots(data.robots);
        }
        
        for(const robot of data.robots) {
            if(!robots[robot.name]) {
                refreshRobots(data.robots);
                return render(data)
            }
            let rel = robots[robot.name];
            rel.innerHTML = robot.health.toFixed(1)
            updatePosition(rel,robot.position);
        }

        while(data.bombs.length>bombs.length) {
            bombs.push(createBombElement());
        }
        while(data.bombs.length<bombs.length) {
            arena.removeChild(bombs.pop())
        }

        for(let i=0; i<data.bombs.length; i++) {
            updatePosition(bombs[i],data.bombs[i].position);
        }
    }

    return {
        render,
        init
    }
})

export { Renderer2D } 