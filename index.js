let cloth;
let cursorRadius = 50;

function setup() {
    let h = 1000;
    let w = 1000;
    let xCount = 40;
    let yCount = 30;
    createCanvas(w, h);
    cloth = new Cloth(w, h, xCount, yCount);
    console.log(cloth);
}

function draw() {
    background(220);
    cloth.update(deltaTime / 100);

    for (let i = 0; i < cloth.particles.length; i++) {
        const p = cloth.particles[i];
        if (mouseX > p.x - cursorRadius && mouseX < p.x + cursorRadius && mouseY > p.y - cursorRadius && mouseY < p.y + cursorRadius)
            fill(color(255, 0, 0));
        else
            fill(color(100, 100, 100));
        circle(p.x, p.y, p.mass * 10);
    }

    for (let i = 0; i < cloth.sticks.length; i++) {
        const s = cloth.sticks[i];
        line(s.p1.x, s.p1.y, s.p2.x, s.p2.y);
    }
}

function mouseWheel(e) {
    cursorRadius -= e.delta / 10;
    cursorRadius = constrain(cursorRadius, 10, 100);
}

function mouseDragged() {
    let points = [];
    for (let i = 0; i < cloth.particles.length; i++) {
        const p = cloth.particles[i];
        if (mouseX > p.x - cursorRadius && mouseX < p.x + cursorRadius && mouseY > p.y - cursorRadius && mouseY < p.y + cursorRadius)
            points.push(p);
    }
    let sticks = [];
    for (let i = 0; i < cloth.sticks.length; i++) {
        if (points.includes(cloth.sticks[i].p1) || points.includes(cloth.sticks[i].p2))
            sticks.push(cloth.sticks[i]);
    }
    //remove points from cloth
    for (let i = 0; i < points.length; i++) {
        const p = points[i];
        cloth.particles.splice(cloth.particles.indexOf(p), 1);
    }
    //remove sticks from cloth
    for (let i = 0; i < sticks.length; i++) {
        const s = sticks[i];
        cloth.sticks.splice(cloth.sticks.indexOf(s), 1);
    }
}