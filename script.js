document.getElementById("year").textContent = new Date().getFullYear();
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Nav con fondo al hacer scroll
const nav = document.getElementById("nav");
const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 40);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Texto tipeado en el banner
const roles = ["Full-Stack Developer", "Laravel + Vue", "Python & bots", "Java de escritorio"];
const typed = document.getElementById("typed");
if (!reduceMotion) {
  let i = 0, pos = roles[0].length, deleting = true;
  const tick = () => {
    const word = roles[i];
    pos += deleting ? -1 : 1;
    typed.textContent = word.slice(0, pos);
    let delay = deleting ? 40 : 85;
    if (!deleting && pos === word.length) { deleting = true; delay = 2200; }
    else if (deleting && pos === 0) { deleting = false; i = (i + 1) % roles.length; delay = 300; }
    setTimeout(tick, delay);
  };
  setTimeout(tick, 2500);
}

// Copiar el mail al portapapeles. Si el navegador no lo permite, se deja actuar al mailto.
document.querySelectorAll("[data-copy]").forEach(el => {
  // La etiqueta puede estar dentro del enlace o en el hint que le sigue
  const label = el.querySelector("[data-copy-label]") || el.nextElementSibling?.querySelector("[data-copy-label]");
  const original = label?.textContent;
  let timer;
  el.addEventListener("click", e => {
    if (!navigator.clipboard) return;
    e.preventDefault();
    navigator.clipboard.writeText(el.dataset.copy).then(() => {
      if (!label) return;
      label.textContent = "¡Mail copiado!";
      el.classList.add("copied");
      clearTimeout(timer);
      timer = setTimeout(() => { label.textContent = original; el.classList.remove("copied"); }, 2200);
    }).catch(() => { window.location.href = el.href; });
  });
});

// ---------- Árbol de skills ----------
// x/y en un lienzo de 800x560. cat: front | back | data | lang | core | locked
// Dónde usé cada skill: repos públicos de GitHub + CV
const IES = "Sistema Académico IES", VAPORA = "Vapora", FERRE = "Sistema Ferretería";
const EVENTOS = "Sistema de Gestión de Eventos", HOSP = "Sistema de Gestión Hospitalaria";
const EXC = "Excelencia Digital (sistemas clínicos en producción)";
const skills = [
  { id: "core", x: 400, y: 285, cat: "core", label: "RA", name: "Ramón Areyuna", desc: "Full-Stack Developer con experiencia en sistemas de gestión para salud, educación y eventos. Elegí una skill del árbol para ver dónde la usé.", used: [] },

  { id: "vue", from: "core", x: 285, y: 200, cat: "front", icon: "devicon-vuejs-plain", name: "Vue 3", desc: "Composition API con <script setup>, Inertia y componentes accesibles con Headless UI.", used: [IES] },
  { id: "js", from: "vue", x: 175, y: 150, cat: "front", icon: "devicon-javascript-plain", name: "JavaScript", desc: "La base de todo el frontend, y también del backend con Node.", used: [IES, EVENTOS, "este portfolio"] },
  { id: "react", from: "js", x: 185, y: 262, cat: "front", icon: "devicon-react-original", name: "React", desc: "Componentes y hooks para interfaces reactivas.", used: [] },
  { id: "html", from: "js", x: 72, y: 215, cat: "front", icon: "devicon-html5-plain", name: "HTML & CSS", desc: "Maquetación semántica y CSS escrito a mano, sin frameworks.", used: ["este portfolio"] },
  { id: "wp", from: "js", x: 80, y: 90, cat: "front", icon: "devicon-wordpress-plain", name: "WordPress", desc: "Sitios administrables y personalización de temas.", used: [] },
  { id: "tw", from: "vue", x: 300, y: 92, cat: "front", icon: "devicon-tailwindcss-original", name: "Tailwind CSS", desc: "Estilos utility-first y formularios con @tailwindcss/forms.", used: [IES] },
  { id: "bs", from: "tw", x: 190, y: 45, cat: "front", icon: "devicon-bootstrap-plain", name: "Bootstrap", desc: "Maquetado rápido con grilla y componentes listos.", used: [HOSP] },

  { id: "git", from: "core", x: 400, y: 165, cat: "lang", icon: "devicon-git-plain", name: "Git & GitHub", desc: "Control de versiones en todos mis proyectos y en el trabajo en equipo.", used: [EXC, IES, VAPORA, FERRE] },
  { id: "figma", from: "git", x: 415, y: 52, cat: "lang", icon: "devicon-figma-plain", name: "Figma", desc: "Diseño y prototipado de interfaces antes de escribir código.", used: [] },

  { id: "laravel", from: "core", x: 520, y: 200, cat: "back", icon: "devicon-laravel-original", name: "Laravel 12", desc: "Roles y permisos, Sanctum, generación de PDFs con DomPDF e importación de Excel.", used: [IES] },
  { id: "ddd", from: "laravel", x: 660, y: 250, cat: "back", label: "DDD", name: "DDD & SOLID", desc: "Arquitectura orientada al dominio y principios SOLID para código mantenible.", used: [] },
  { id: "php", from: "laravel", x: 628, y: 140, cat: "back", icon: "devicon-php-plain", name: "PHP 8", desc: "Mi lenguaje principal de backend web.", used: [IES, EVENTOS, HOSP] },
  { id: "node", from: "laravel", x: 540, y: 88, cat: "back", icon: "devicon-nodejs-plain", name: "Node.js", desc: "APIs y scripts del lado del servidor.", used: [] },
  { id: "express", from: "node", x: 655, y: 42, cat: "back", icon: "devicon-express-original", name: "Express", desc: "APIs REST livianas sobre Node.", used: [] },
  { id: "dotnet", from: "php", x: 740, y: 205, cat: "back", icon: "devicon-dot-net-plain", name: ".NET", desc: "Nuevas funcionalidades, corrección de errores y mantenimiento de sistemas clínicos en producción.", used: [EXC] },
  { id: "csharp", from: "dotnet", x: 745, y: 108, cat: "back", icon: "devicon-csharp-plain", name: "C#", desc: "El lenguaje con el que trabajo día a día sobre .NET.", used: [EXC] },

  { id: "mysql", from: "core", x: 520, y: 380, cat: "data", icon: "devicon-mysql-original", name: "MySQL / MariaDB", desc: "Modelado relacional, migraciones y seeders.", used: [IES, EVENTOS, HOSP] },
  { id: "sqlserver", from: "mysql", x: 650, y: 345, cat: "data", icon: "devicon-microsoftsqlserver-plain", name: "SQL Server", desc: "Consultas y procedimientos sobre bases de datos en entornos productivos.", used: [EXC] },
  { id: "mongo", from: "sqlserver", x: 738, y: 420, cat: "data", icon: "devicon-mongodb-plain", name: "MongoDB", desc: "Bases de datos documentales.", used: [] },
  { id: "sqlite", from: "mysql", x: 598, y: 488, cat: "data", icon: "devicon-sqlite-plain", name: "SQLite", desc: "Base embebida para apps de escritorio, sin servidor.", used: [FERRE] },

  { id: "python", from: "core", x: 285, y: 375, cat: "lang", icon: "devicon-python-plain", name: "Python", desc: "Bots, chatbots, consumo de APIs y tests con pytest.", used: [VAPORA, EVENTOS + " (chatbot)"], certs: ["Fundamentos de Python 1 — Cisco, jun 2025"] },
  { id: "java", from: "python", x: 175, y: 425, cat: "lang", icon: "devicon-java-plain", name: "Java 17", desc: "JavaFX con MVC y DAOs, empaquetado con Maven y jpackage.", used: [FERRE] },
  { id: "c", from: "java", x: 72, y: 340, cat: "lang", icon: "devicon-c-plain", name: "C", desc: "Fundamentos: memoria, punteros y algoritmos.", used: [] },
  { id: "cpp", from: "c", x: 62, y: 470, cat: "lang", icon: "devicon-cplusplus-plain", name: "C++", desc: "Estructuras de datos y programación orientada a objetos.", used: [] },

  { id: "ia", from: "python", x: 300, y: 500, cat: "locked", label: "IA", name: "Inteligencia Artificial", desc: "Lo que estoy entrenando ahora.", used: [], certs: ["Introducción a la IA Moderna — Cisco, may 2025", "Fundamentos de IA con IBM SkillsBuild — jul 2025"] },
  { id: "ds", from: "python", x: 420, y: 480, cat: "locked", label: "DS", name: "Data Science", desc: "Análisis de datos con Python.", used: [], certs: ["Introducción a la Ciencia de Datos — Cisco, jun 2025", "Fundamentos de Análisis de Datos — Cisco, jul 2025"] },
  { id: "mobile", from: "java", x: 185, y: 530, cat: "locked", label: "APP", name: "Apps mobile", desc: "El próximo territorio a explorar.", used: [] },
];

const CAT = {
  core: "Sobre mí", front: "Frontend", back: "Backend", data: "Datos", lang: "Lenguajes y herramientas", locked: "Bloqueada",
};
const COLOR = { front: "var(--yellow)", back: "var(--pink)", data: "var(--teal)", lang: "var(--cream)", core: "var(--ink)", locked: "rgba(244,232,193,.5)" };

const tree = document.getElementById("tree");
const svg = document.getElementById("tree-paths");
const byId = Object.fromEntries(skills.map(s => [s.id, s]));
const NS = "http://www.w3.org/2000/svg";

// Camino ondulado entre dos puntos
function wavy(a, b, k) {
  const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy);
  const nx = -dy / len, ny = dx / len, w = len * 0.22 * k;
  const c1 = { x: a.x + dx * 0.33 + nx * w, y: a.y + dy * 0.33 + ny * w };
  const c2 = { x: a.x + dx * 0.66 - nx * w, y: a.y + dy * 0.66 - ny * w };
  return `M${a.x} ${a.y} C${c1.x} ${c1.y} ${c2.x} ${c2.y} ${b.x} ${b.y}`;
}
function addPath(d, cls) {
  const p = document.createElementNS(NS, "path");
  p.setAttribute("d", d);
  p.setAttribute("class", cls);
  svg.appendChild(p);
  return p;
}

// Caminos decorativos de fondo, como senderos del mapa
[
  "M20 300 C120 260 90 540 260 545", "M780 520 C700 560 520 530 470 555", "M560 10 C620 60 760 20 790 60",
  "M10 20 C60 60 140 10 150 110", "M780 300 C740 260 800 200 770 170",
].forEach(d => addPath(d, "deco"));

const links = {};
skills.forEach((s, i) => {
  if (!s.from) return;
  links[s.id] = addPath(wavy(byId[s.from], s, i % 2 ? 1 : -1), "link" + (s.cat === "locked" ? " locked" : ""));
});

const nodes = {};
skills.forEach(s => {
  const b = document.createElement("button");
  b.type = "button";
  b.className = `node ${s.cat}${s.icon ? "" : " text"}`;
  b.style.left = (s.x / 800 * 100) + "%";
  b.style.top = (s.y / 560 * 100) + "%";
  b.setAttribute("aria-label", s.name);
  b.title = s.name;
  b.innerHTML = s.icon ? `<i class="${s.icon}" aria-hidden="true"></i>` : s.label;
  b.addEventListener("click", () => select(s.id));
  b.addEventListener("mouseenter", () => select(s.id));
  b.addEventListener("focus", () => select(s.id));
  tree.appendChild(b);
  nodes[s.id] = b;
});

const unlocked = skills.filter(s => s.cat !== "core" && s.cat !== "locked").length;
document.getElementById("skill-count").textContent = unlocked;

const card = document.getElementById("skill-card");
const sc = {
  icon: document.getElementById("sc-icon"), cat: document.getElementById("sc-cat"), name: document.getElementById("sc-name"),
  desc: document.getElementById("sc-desc"), used: document.getElementById("sc-used"), state: document.getElementById("sc-state"),
};
let current = null;

function select(id) {
  if (id === current) return;
  current = id;
  const s = byId[id];

  Object.values(nodes).forEach(n => n.classList.remove("selected"));
  nodes[id].classList.add("selected");

  // Resaltar el camino desde el centro hasta la skill
  Object.values(links).forEach(l => l.classList.remove("active"));
  for (let n = s; n && n.from; n = byId[n.from]) links[n.id].classList.add("active");

  sc.icon.style.setProperty("--c", COLOR[s.cat]);
  sc.icon.style.background = s.cat === "core" ? "var(--cream)" : "";
  sc.icon.innerHTML = s.icon ? `<i class="${s.icon}"></i>` : s.label;
  sc.cat.textContent = CAT[s.cat];
  sc.name.textContent = s.name;
  sc.desc.textContent = s.desc;
  sc.used.innerHTML =
    (s.used.length ? `Usada en:<ul>${s.used.map(u => `<li>${u}</li>`).join("")}</ul>` : "") +
    (s.certs ? `Certificaciones:<ul>${s.certs.map(c => `<li>${c}</li>`).join("")}</ul>` : "");
  sc.state.textContent = s.cat === "locked" ? "🔒 Aprendiendo" : s.cat === "core" ? `${unlocked} skills desbloqueadas` : "✓ Desbloqueada";

  card.classList.remove("swap");
  void card.offsetWidth;
  card.classList.add("swap");
}

// Moverse por el árbol con las flechas, como en un menú de juego
const DIRS = { ArrowRight: [1, 0], ArrowLeft: [-1, 0], ArrowDown: [0, 1], ArrowUp: [0, -1] };
tree.addEventListener("keydown", e => {
  const dir = DIRS[e.key];
  if (!dir || !current) return;
  e.preventDefault();
  const a = byId[current];
  let best = null, bestScore = Infinity;
  skills.forEach(s => {
    if (s.id === a.id) return;
    const dx = s.x - a.x, dy = s.y - a.y;
    const along = dx * dir[0] + dy * dir[1];
    if (along <= 0) return;
    const across = Math.abs(dx * dir[1] - dy * dir[0]);
    const score = along + across * 2;
    if (score < bestScore) { bestScore = score; best = s; }
  });
  if (best) nodes[best.id].focus();
});

select("core");

// Aparición al hacer scroll
const targets = document.querySelectorAll(".screen-head, .character, .project, .skills-layout, .contact > :not(.screen-head)");
targets.forEach(el => el.classList.add("reveal"));
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
  });
}, { threshold: 0.1 });
targets.forEach(el => io.observe(el));
