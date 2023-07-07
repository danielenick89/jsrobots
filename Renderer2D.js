
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

    const convertCoordinates = function(p) {
        return {
            x:p.x/W*100,
            y:p.y/H*100,
        }
    }

    const updatePosition = function(el,p) {
        let cp = convertCoordinates(p);
        el.style.left = cp.x+'%';
        el.style.top = cp.y+'%';
    }

    const updateColor = function(el,r) {
        el.style.backgroundColor = 'rgb('+Math.floor((1-r)*255)+',0,'+Math.floor((r)*255)+')';
    }

    const renderExplosions = function(exs) {
        let els = document.querySelectorAll('.explosion')
        for(let i=0; i<els.length; i++) {
            arena.removeChild(els[i])
        }
        exs.forEach(renderExplosion);
    }

    const renderExplosion = function(ex) {
        const el = document.createElement('div');
        el.className = "explosion";
        arena.appendChild(el);
        updatePosition(el,ex.position);
        let {x:rangecp} = convertCoordinates({x:ex.radius,y:0});
        el.style.width = el.style.height = 2*rangecp+'%';
        el.style.marginLeft = el.style.marginTop = -rangecp+'%';
    }

    const renderScans = function(scans) {
        let els = document.querySelectorAll('.scan')
        for(let i=0; i<els.length; i++) {
            arena.removeChild(els[i])
        }
        scans.forEach(renderScan);
    }

    const distance = function(a,b) {
        return Math.sqrt((a.x-b.x)**2 + (a.y-b.y)**2);
    }

    const getScanHeight = function(scan) {
        let angle1 = scan.angle-scan.width/2;
        let angle2 = scan.angle+scan.width/2;
        let p1 = {x:scan.position.x+Math.cos(angle1)*scan.length,y:scan.position.y+Math.sin(angle1)*scan.length}
        let p2 = {x:scan.position.x+Math.cos(angle2)*scan.length,y:scan.position.y+Math.sin(angle2)*scan.length}
        let d = distance(p1,p2);

        let {x:l} = convertCoordinates({x:d,y:0});

        return l/100*arena.clientWidth;
    }

    const renderScan = function(scan) {
        const el = document.createElement('div');
        el.className = "scan";
        arena.appendChild(el);
        updatePosition(el,scan.position)

        let {x:l} = convertCoordinates({x:scan.length,y:0});
        el.style.width = el.style.height = l*2+'%';
        el.style.marginTop = el.style.marginLeft = -l+'%';
        el.style.transform = 'rotate('+(scan.angle-scan.width/2+Math.PI/2)+'rad)'
        let limit = Math.round(scan.width/2/Math.PI*100);
        el.style.backgroundImage = 'conic-gradient(yellow 0% '+limit+'%, rgba(0,0,0,0.0) '+limit+'% 100%)';
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
            updatePosition(rel,robot.position);
            updateColor(rel,robot.health);
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

        renderExplosions(data.explosions);
        renderScans(data.scans);
    }

    return {
        render,
        init
    }
})

export { Renderer2D } 