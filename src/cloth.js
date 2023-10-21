//create a class for the particles
class Particle {
    constructor(x, y, mass, isPinned = false) {
        this.initX = x;
        this.initY = y;
        this.prevX = x;
        this.prevY = y;
        this.x = x;
        this.y = y;
        this.mass = mass;
        this.isPinned = isPinned;
    }
}

class Stick {
    constructor(p1, p2, length) {
        this.p1 = p1;
        this.p2 = p2;
        this.length = length;
    }
}

class Cloth {
    constructor(w, h, x, y) {
        this.width = w;
        this.height = h;

        let xDiff = w / (x + 2);
        let yDiff = h / (y + 2);

        this.particles = [];
        for (let i = 1; i <= y; i++) {
            for (let j = 1; j <= x; j++) {
                this.particles.push(new Particle(j * xDiff, i * yDiff, 1, i === 1));
            }
        }

        this.sticks = [];
        for (let i = 0; i < this.particles.length; i++) {
            const p1 = this.particles[i];
            if (i % x != x - 1) {
                const p2 = this.particles[i + 1];
                this.sticks.push(new Stick(p1, p2, xDiff));
            }
            if (i < this.particles.length - x) {
                const p2 = this.particles[i + x];
                this.sticks.push(new Stick(p1, p2, yDiff));
            }
        }
    }

    keepInViewport(p) {
        if (p.y > height) {
            p.y = height;
            p.prevY = height;
        }
        if (p.y > this.width) {
            p.y = this.width;
            p.prevY = this.width;
        }
        if (p.y < 0) {
            p.y = 0;
            p.prevY = 0;
        }
        if (p.x < 0) {
            p.x = 0;
            p.prevX = 0;
        }
    }

    update(dt) {
        // update positions
        let acc = { x: 0, y: 0.5 };
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            if (p.isPinned) {
                p.x = p.initX;
                p.y = p.initY;
                p.prevX = p.initX;
                p.prevY = p.initY;
                continue;
            }
            const vx = 2 * p.x - p.prevX + acc.x * dt * dt;
            const vy = 2 * p.y - p.prevY + acc.y * dt * dt;
            p.prevX = p.x;
            p.prevY = p.y;
            p.x = vx;
            p.y = vy;

            // this.keepInViewport(p);
        }

        // apply stick constraints
        for (let i = 0; i < this.sticks.length; i++) {
            const s = this.sticks[i];
            let diff = { x: s.p2.x - s.p1.x, y: s.p2.y - s.p1.y };
            let dist = Math.sqrt(diff.x * diff.x + diff.y * diff.y);
            let error = (s.length - dist) / dist / 2;
            s.p1.x -= diff.x * error;
            s.p1.y -= diff.y * error;
            s.p2.x += diff.x * error;
            s.p2.y += diff.y * error;

        }
    }

}