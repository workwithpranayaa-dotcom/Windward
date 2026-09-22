import { flowField, orbits, grove, lorenz, superformula } from "./engines.js";

const canvas = document.getElementById("art");
const ctx = canvas.getContext("2d");

const palettes = {
  night: { bg: "#0b0e12", hue: 28, light: 62 },
  glacier: { bg: "#07131a", hue: 186, light: 64 },
  ember: { bg: "#140c0a", hue: 18, light: 58 },
  paper: { bg: "#efe6d8", hue: 30, light: 28 },
};

const state = {
  engine: "flow",
  seed: 88421,
  palette: "night",
};

const fields = document.getElementById("fields");

const specs = {
  flow: [
    ["count", 900, 80, 2500, 10],
    ["steps", 50, 8, 140, 1],
    ["scale", 0.0028, 0.0004, 0.012, 0.0001],
    ["step", 2.2, 0.4, 6, 0.1],
    ["twist", 1, 0.2, 2.4, 0.05],
    ["width", 0.7, 0.2, 2.4, 0.1],
    ["alpha", 0.12, 0.03, 0.4, 0.01],
    ["spread", 40, 0, 120, 1],
  ],
  orbits: [
    ["bodies", 14, 2, 40, 1],
    ["harm", 7, 2, 16, 1],
    ["turns", 8, 1, 24, 1],
    ["steps", 1400, 200, 4000, 50],
    ["width", 0.8, 0.3, 3, 0.1],
    ["alpha", 0.22, 0.05, 0.6, 0.01],
    ["ySkew", 1, 0.4, 1.8, 0.05],
    ["spread", 70, 0, 160, 1],
  ],
  grove: [
    ["depth", 5, 2, 7, 1],
    ["angle", 22, 8, 45, 1],
    ["step", 9, 3, 18, 1],
    ["width", 0.9, 0.3, 2.5, 0.1],
    ["jitter", 0.08, 0, 0.4, 0.01],
  ],
  lorenz: [
    ["steps", 18000, 2000, 40000, 500],
    ["dt", 0.004, 0.001, 0.012, 0.0005],
    ["zoom", 14, 6, 28, 0.5],
    ["width", 0.7, 0.3, 2, 0.1],
    ["alpha", 0.18, 0.04, 0.5, 0.01],
    ["spread", 50, 0, 140, 1],
  ],
  super: [
    ["m", 6, 1, 16, 1],
    ["n1", 0.3, 0.1, 8, 0.1],
    ["n2", 1.7, 0.1, 8, 0.1],
    ["n3", 1.7, 0.1, 8, 0.1],
    ["a", 1, 0.4, 2, 0.05],
    ["b", 1, 0.4, 2, 0.05],
    ["scale", 220, 40, 420, 5],
    ["layers", 7, 1, 18, 1],
    ["steps", 720, 120, 1600, 10],
    ["width", 0.9, 0.3, 3, 0.1],
    ["alpha", 0.35, 0.05, 0.8, 0.01],
  ],
};

const params = {};
for (const [k, list] of Object.entries(specs)) {
  params[k] = Object.fromEntries(list.map(([n, v]) => [n, v]));
}
params.grove.axiom = "F";
params.grove.rule = "FF+[+F-F-F]-[-F+F+F]";

function rebuildFields() {
  fields.innerHTML = "";
  for (const [name, val, min, max, step] of specs[state.engine]) {
    const lab = document.createElement("label");
    lab.innerHTML = `<span>${name} <em id="v-${name}">${val}</em></span>`;
    const input = document.createElement("input");
    input.type = "range";
    input.min = min;
    input.max = max;
    input.step = step;
    input.value = params[state.engine][name];
    input.addEventListener("input", () => {
      params[state.engine][name] = Number(input.value);
      lab.querySelector("em").textContent = input.value;
      render();
    });
    lab.appendChild(input);
    fields.appendChild(lab);
  }
  if (state.engine === "grove") {
    const ax = document.createElement("label");
    ax.innerHTML = `<span>axiom</span>`;
    const i = document.createElement("input");
    i.type = "text";
    i.value = params.grove.axiom;
    i.addEventListener("change", () => {
      params.grove.axiom = i.value || "F";
      render();
    });
    ax.appendChild(i);
    fields.appendChild(ax);
    const ru = document.createElement("label");
    ru.innerHTML = `<span>rule F →</span>`;
    const r = document.createElement("input");
    r.type = "text";
    r.value = params.grove.rule;
    r.addEventListener("change", () => {
      params.grove.rule = r.value;
      render();
    });
    ru.appendChild(r);
    fields.appendChild(ru);
  }
}

function sizeCanvas() {
  const wrap = canvas.parentElement;
  const s = Math.min(wrap.clientWidth - 32, wrap.clientHeight - 32, 1100);
  const dpr = Math.min(2, devicePixelRatio || 1);
  canvas.width = Math.floor(s * dpr);
  canvas.height = Math.floor(s * dpr);
  canvas.style.width = `${s}px`;
  canvas.style.height = `${s}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return s;
}

function pack() {
  const pal = palettes[state.palette];
  return {
    ...params[state.engine],
    seed: state.seed,
    bg: pal.bg,
    hue: pal.hue,
    light: pal.light,
  };
}

function render() {
  const s = sizeCanvas();
  const p = pack();
  if (state.engine === "flow") flowField(ctx, s, s, p);
  if (state.engine === "orbits") orbits(ctx, s, s, p);
  if (state.engine === "grove") grove(ctx, s, s, p);
  if (state.engine === "lorenz") lorenz(ctx, s, s, p);
  if (state.engine === "super") superformula(ctx, s, s, p);
  document.getElementById("seed").value = String(state.seed);
}

document.querySelectorAll("[data-engine]").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("[data-engine]").forEach((b) => b.classList.remove("is-on"));
    btn.classList.add("is-on");
    state.engine = btn.dataset.engine;
    rebuildFields();
    render();
  });
});

document.getElementById("palette").addEventListener("change", (e) => {
  state.palette = e.target.value;
  render();
});
document.getElementById("reshuffle").addEventListener("click", () => {
  state.seed = (Math.random() * 1e9) | 0;
  render();
});
document.getElementById("seed").addEventListener("change", (e) => {
  state.seed = Number(e.target.value) >>> 0;
  render();
});
document.getElementById("export").addEventListener("click", () => {
  const a = document.createElement("a");
  a.download = `windward-${state.engine}-${state.seed}.png`;
  a.href = canvas.toDataURL("image/png");
  a.click();
});

window.addEventListener("keydown", (e) => {
  if (e.target.matches("input, select")) return;
  if (e.code === "Space") {
    e.preventDefault();
    state.seed = (Math.random() * 1e9) | 0;
    render();
  }
  if (e.key === "e" || e.key === "E") document.getElementById("export").click();
  const map = { 1: "flow", 2: "orbits", 3: "grove", 4: "lorenz", 5: "super" };
  if (map[e.key]) {
    state.engine = map[e.key];
    document.querySelectorAll("[data-engine]").forEach((b) => {
      b.classList.toggle("is-on", b.dataset.engine === state.engine);
    });
    rebuildFields();
    render();
  }
});

window.addEventListener("resize", render);
rebuildFields();
render();
