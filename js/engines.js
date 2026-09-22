import { makeNoise, mulberry32 } from "./noise.js";

export function flowField(ctx, w, h, p) {
  const noise = makeNoise(p.seed);
  const rand = mulberry32(p.seed + 9);
  ctx.fillStyle = p.bg;
  ctx.fillRect(0, 0, w, h);
  const n = p.count;
  const scale = p.scale;
  ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < n; i++) {
    let x = rand() * w;
    let y = rand() * h;
    ctx.beginPath();
    ctx.moveTo(x, y);
    const hue = p.hue + rand() * p.spread;
    ctx.strokeStyle = `hsla(${hue}, 70%, ${p.light}%, ${p.alpha})`;
    ctx.lineWidth = p.width;
    for (let s = 0; s < p.steps; s++) {
      const a = noise(x * scale, y * scale) * Math.PI * 4 * p.twist + p.seed * 0.0001;
      x += Math.cos(a) * p.step;
      y += Math.sin(a) * p.step;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.globalCompositeOperation = "source-over";
}

export function orbits(ctx, w, h, p) {
  ctx.fillStyle = p.bg;
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = "lighter";
  const cx = w / 2;
  const cy = h / 2;
  const rand = mulberry32(p.seed);
  for (let k = 0; k < p.bodies; k++) {
    const a1 = 1 + (rand() * p.harm | 0);
    const a2 = 1 + (rand() * p.harm | 0);
    const ph = rand() * Math.PI * 2;
    const r1 = Math.min(w, h) * (0.12 + rand() * 0.32);
    const r2 = r1 * (0.2 + rand() * 0.7);
    ctx.beginPath();
    const hue = p.hue + k * (p.spread / p.bodies);
    ctx.strokeStyle = `hsla(${hue}, 75%, 62%, ${p.alpha})`;
    ctx.lineWidth = p.width;
    const steps = p.steps;
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * Math.PI * 2 * p.turns;
      const x = cx + Math.cos(a1 * t) * r1 + Math.cos(a2 * t + ph) * r2;
      const y = cy + Math.sin(a1 * t * p.ySkew) * r1 + Math.sin(a2 * t + ph) * r2 * 0.65;
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.stroke();
  }
  ctx.globalCompositeOperation = "source-over";
}

function expandL(axiom, rules, depth) {
  let s = axiom;
  for (let i = 0; i < depth; i++) {
    let n = "";
    for (const ch of s) n += rules[ch] || ch;
    s = n;
    if (s.length > 120000) break;
  }
  return s;
}

export function grove(ctx, w, h, p) {
  ctx.fillStyle = p.bg;
  ctx.fillRect(0, 0, w, h);
  const rand = mulberry32(p.seed);
  const rules = { F: p.rule };
  const str = expandL(p.axiom, rules, p.depth);
  ctx.strokeStyle = `hsla(${p.hue}, 55%, 62%, 0.72)`;
  ctx.lineCap = "round";
  const turtle = [];
  let x = w / 2;
  let y = h * 0.92;
  let a = -Math.PI / 2;
  const step = p.step;
  const ang = (p.angle * Math.PI) / 180;
  ctx.beginPath();
  ctx.moveTo(x, y);
  for (const ch of str) {
    if (ch === "F") {
      const nx = x + Math.cos(a) * step;
      const ny = y + Math.sin(a) * step;
      ctx.moveTo(x, y);
      ctx.lineTo(nx, ny);
      x = nx;
      y = ny;
    } else if (ch === "+") a += ang + (rand() - 0.5) * p.jitter;
    else if (ch === "-") a -= ang + (rand() - 0.5) * p.jitter;
    else if (ch === "[") turtle.push([x, y, a]);
    else if (ch === "]" && turtle.length) {
      [x, y, a] = turtle.pop();
      ctx.moveTo(x, y);
    }
  }
  ctx.lineWidth = p.width;
  ctx.stroke();
}

export function lorenz(ctx, w, h, p) {
  ctx.fillStyle = p.bg;
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = "lighter";
  let x = 0.1;
  let y = 0;
  let z = 0;
  const dt = p.dt;
  const sigma = 10;
  const rho = 28;
  const beta = 8 / 3;
  ctx.beginPath();
  const hue0 = p.hue;
  for (let i = 0; i < p.steps; i++) {
    const dx = sigma * (y - x) * dt;
    const dy = (x * (rho - z) - y) * dt;
    const dz = (x * y - beta * z) * dt;
    x += dx;
    y += dy;
    z += dz;
    const px = w / 2 + x * p.zoom;
    const py = h / 2 + (y + z * 0.35) * p.zoom * 0.55;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
    if (i % 800 === 799) {
      ctx.strokeStyle = `hsla(${hue0 + (z / 40) * p.spread}, 80%, 60%, ${p.alpha})`;
      ctx.lineWidth = p.width;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(px, py);
    }
  }
  ctx.strokeStyle = `hsla(${hue0}, 80%, 60%, ${p.alpha})`;
  ctx.stroke();
  ctx.globalCompositeOperation = "source-over";
}

export function superformula(ctx, w, h, p) {
  ctx.fillStyle = p.bg;
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = "lighter";
  const cx = w / 2;
  const cy = h / 2;
  const { m, n1, n2, n3, a, b } = p;
  const layers = p.layers;
  for (let L = 0; L < layers; L++) {
    const scale = p.scale * (1 - L / (layers + 0.5));
    ctx.beginPath();
    const steps = p.steps;
    for (let i = 0; i <= steps; i++) {
      const phi = (i / steps) * Math.PI * 2;
      const t1 = Math.abs(Math.cos((m * phi) / 4) / a) ** n2;
      const t2 = Math.abs(Math.sin((m * phi) / 4) / b) ** n3;
      const r = (t1 + t2) ** (-1 / n1);
      const x = cx + r * Math.cos(phi) * scale;
      const y = cy + r * Math.sin(phi) * scale;
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = `hsla(${p.hue + L * 8}, 70%, 62%, ${p.alpha})`;
    ctx.lineWidth = p.width;
    ctx.stroke();
  }
  ctx.globalCompositeOperation = "source-over";
}
