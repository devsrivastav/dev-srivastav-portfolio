// ─── THREE.JS BACKGROUND ───────────────────────────────────────────────────
const canvas = document.getElementById('bg-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 50;

// Particles
const particleCount = 1200;
const geo = new THREE.BufferGeometry();
const pos = new Float32Array(particleCount * 3);
const sizes = new Float32Array(particleCount);

for (let i = 0; i < particleCount; i++) {
  pos[i * 3] = (Math.random() - 0.5) * 200;
  pos[i * 3 + 1] = (Math.random() - 0.5) * 200;
  pos[i * 3 + 2] = (Math.random() - 0.5) * 100;
  sizes[i] = Math.random() * 2 + 0.5;
}
geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

const mat = new THREE.PointsMaterial({
  color: 0x00f5ff, size: 0.35, transparent: true, opacity: 0.6, sizeAttenuation: true
});
const particles = new THREE.Points(geo, mat);
scene.add(particles);

// Floating wireframe geometry (icosahedra)
const shapes = [];
for (let i = 0; i < 6; i++) {
  const g = new THREE.IcosahedronGeometry(Math.random() * 3 + 1.5, 0);
  const m = new THREE.MeshBasicMaterial({
    color: i % 2 === 0 ? 0x00f5ff : 0x0066ff,
    wireframe: true, transparent: true, opacity: 0.12
  });
  const mesh = new THREE.Mesh(g, m);
  mesh.position.set(
    (Math.random() - 0.5) * 120,
    (Math.random() - 0.5) * 80,
    (Math.random() - 0.5) * 40 - 20
  );
  mesh.userData = {
    rx: (Math.random() - 0.5) * 0.008,
    ry: (Math.random() - 0.5) * 0.008
  };
  scene.add(mesh);
  shapes.push(mesh);
}

// Grid lines
const gridHelper = new THREE.GridHelper(200, 40, 0x001a3a, 0x001a3a);
gridHelper.position.y = -30;
gridHelper.material.opacity = 0.3;
gridHelper.material.transparent = true;
scene.add(gridHelper);

let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

let t = 0;
function animate() {
  requestAnimationFrame(animate);
  t += 0.005;
  particles.rotation.y = t * 0.05 + mouseX * 0.02;
  particles.rotation.x = mouseY * 0.02;
  shapes.forEach(s => {
    s.rotation.x += s.userData.rx;
    s.rotation.y += s.userData.ry;
  });
  camera.position.x += (mouseX * 3 - camera.position.x) * 0.02;
  camera.position.y += (mouseY * 2 - camera.position.y) * 0.02;
  gridHelper.rotation.y = t * 0.02;
  renderer.render(scene, camera);
}
animate();

// ─── CURSOR ─────────────────────────────────────────────────────────────────
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let cx = 0, cy = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => { cx = e.clientX; cy = e.clientY; });

function animateCursor() {
  requestAnimationFrame(animateCursor);
  rx += (cx - rx) * 0.12;
  ry += (cy - ry) * 0.12;
  cursor.style.left = cx + 'px'; cursor.style.top = cy + 'px';
  cursorRing.style.left = rx + 'px'; cursorRing.style.top = ry + 'px';
}
animateCursor();

document.querySelectorAll('a, button, .skill-card, .project-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width = '20px'; cursor.style.height = '20px';
    cursorRing.style.width = '60px'; cursorRing.style.height = '60px';
    cursor.style.background = 'var(--accent)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width = '12px'; cursor.style.height = '12px';
    cursorRing.style.width = '40px'; cursorRing.style.height = '40px';
    cursor.style.background = 'var(--cyan)';
  });
});

// ─── SCROLL REVEAL ───────────────────────────────────────────────────────────
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ─── TABS ────────────────────────────────────────────────────────────────────
function switchTab(id) {
  document.querySelectorAll('.tab-btn').forEach((b, i) => {
    b.classList.remove('active');
    if (['java','dotnet','qa','tools'][i] === id) b.classList.add('active');
  });
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('tab-' + id).classList.add('active');
  // re-animate bars
  document.querySelectorAll('#tab-' + id + ' .skill-bar').forEach(bar => {
    bar.style.width = '0'; void bar.offsetWidth;
    bar.style.width = '';
  });
}