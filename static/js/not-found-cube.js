import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";

/* kmscube.c vertices, colors, normals, and draw() rotation. */
const V = [
  -1, -1, +1, +1, -1, +1, -1, +1, +1, +1, +1, +1,
  +1, -1, -1, -1, -1, -1, +1, +1, -1, -1, +1, -1,
  +1, -1, +1, +1, -1, -1, +1, +1, +1, +1, +1, -1,
  -1, -1, -1, -1, -1, +1, -1, +1, -1, -1, +1, +1,
  -1, +1, +1, +1, +1, +1, -1, +1, -1, +1, +1, -1,
  -1, -1, -1, +1, -1, -1, -1, -1, +1, +1, -1, +1,
];
const C = [
  0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1,
  1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0,
  1, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0,
  0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1,
  0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0,
  0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1,
];
const N = [
  0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
  0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
  1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
  -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
  0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
  0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
];
const UV4 = [0, 0, 1, 0, 0, 1, 1, 1];

function paintFace(ctx, size, faceImg) {
  ctx.clearRect(0, 0, size, size);
  /* Cube sits on kmscube gray. Do not follow site light/dark tokens. */
  const text = "#ffffff";
  const shadow = "#121212";
  if (faceImg && faceImg.width) {
    const maxW = size * 0.86;
    const maxH = size * 0.58;
    const scale = Math.min(maxW / faceImg.width, maxH / faceImg.height);
    const w = faceImg.width * scale;
    const h = faceImg.height * scale;
    ctx.drawImage(faceImg, (size - w) / 2, size * 0.06, w, h);
  }
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `700 ${Math.floor(size * 0.11)}px Inter, system-ui, sans-serif`;
  ctx.fillStyle = shadow;
  ctx.fillText("404", size / 2 + 2, size * 0.78 + 2);
  ctx.fillStyle = text;
  ctx.fillText("404", size / 2, size * 0.78);
  ctx.font = `600 ${Math.floor(size * 0.065)}px Inter, system-ui, sans-serif`;
  ctx.fillStyle = shadow;
  ctx.fillText("Page not found", size / 2 + 2, size * 0.9 + 2);
  ctx.fillStyle = text;
  ctx.fillText("Page not found", size / 2, size * 0.9);
}

function makeTexture(faceImg) {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  paintFace(canvas.getContext("2d"), size, faceImg);
  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.generateMipmaps = true;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function loadFaceImage() {
  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = "/images/404/face.webp";
  });
}

function kmscubeGeometry() {
  const pos = [];
  const col = [];
  const nor = [];
  const uv = [];
  for (let face = 0; face < 6; face++) {
    const base = face * 4;
    const tris = [0, 1, 2, 2, 1, 3];
    for (let t = 0; t < 6; t++) {
      const i = base + tris[t];
      pos.push(V[i * 3], V[i * 3 + 1], V[i * 3 + 2]);
      col.push(C[i * 3], C[i * 3 + 1], C[i * 3 + 2]);
      nor.push(N[i * 3], N[i * 3 + 1], N[i * 3 + 2]);
      uv.push(UV4[tris[t] * 2], UV4[tris[t] * 2 + 1]);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
  g.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  return g;
}

const vert = /* glsl */ `
uniform mat4 modelviewMatrix;
uniform mat4 modelviewprojectionMatrix;
uniform mat3 kmscubeNormalMatrix;
in vec3 position;
in vec3 normal;
in vec3 color;
in vec2 uv;
out vec3 vColor;
out vec2 vUv;
out float vDiff;
void main() {
  gl_Position = modelviewprojectionMatrix * vec4(position, 1.0);
  vec3 vEyeNormal = kmscubeNormalMatrix * normal;
  vec4 vPosition4 = modelviewMatrix * vec4(position, 1.0);
  vec3 vPosition3 = vPosition4.xyz / vPosition4.w;
  vec3 vLightDir = normalize(vec3(2.0, 2.0, 20.0) - vPosition3);
  vDiff = max(0.0, dot(vEyeNormal, vLightDir));
  vColor = color;
  vUv = uv;
}
`;

const frag = /* glsl */ `
precision mediump float;
uniform sampler2D map;
in vec3 vColor;
in vec2 vUv;
in float vDiff;
out vec4 outColor;
void main() {
  vec4 tex = texture(map, vUv);
  vec3 base = mix(vColor, tex.rgb, tex.a);
  outColor = vec4(vDiff * base, 1.0);
}
`;

function init(root, faceImg) {
  const canvas = root.querySelector("canvas");
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: false,
    antialias: true,
  });
  /* kmscube.c draw(): glClearColor(0.5, 0.5, 0.5, 1.0) */
  renderer.setClearColor(0x808080, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.Camera();
  camera.matrixAutoUpdate = false;

  let texture = makeTexture(faceImg);
  const uniforms = {
    modelviewMatrix: { value: new THREE.Matrix4() },
    modelviewprojectionMatrix: { value: new THREE.Matrix4() },
    kmscubeNormalMatrix: { value: new THREE.Matrix3() },
    map: { value: texture },
  };
  const material = new THREE.RawShaderMaterial({
    glslVersion: THREE.GLSL3,
    vertexShader: vert,
    fragmentShader: frag,
    uniforms,
    side: THREE.FrontSide,
  });
  const cube = new THREE.Mesh(kmscubeGeometry(), material);
  cube.frustumCulled = false;
  cube.matrixAutoUpdate = false;
  scene.add(cube);

  const rx = new THREE.Matrix4();
  const ry = new THREE.Matrix4();
  const rz = new THREE.Matrix4();
  const rot = new THREE.Matrix4();
  const view = new THREE.Matrix4().makeTranslation(0, 0, -8);
  const proj = new THREE.Matrix4();
  const mv = uniforms.modelviewMatrix.value;
  const mvp = uniforms.modelviewprojectionMatrix.value;
  const nrm = uniforms.kmscubeNormalMatrix.value;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let frame = 0;

  function setFrustum(width, height) {
    const aspect = height / Math.max(width, 1);
    proj.makePerspective(-2.8, 2.8, 2.8 * aspect, -2.8 * aspect, 6, 10);
  }

  function sizeToCanvas() {
    const w = canvas.clientWidth || 480;
    const h = canvas.clientHeight || 480;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, false);
    setFrustum(w, h);
  }

  function pose(i) {
    rx.makeRotationX(THREE.MathUtils.degToRad(45 + 0.25 * i));
    ry.makeRotationY(THREE.MathUtils.degToRad(45 - 0.5 * i));
    rz.makeRotationZ(THREE.MathUtils.degToRad(10 + 0.15 * i));
    rot.multiplyMatrices(rx, ry).multiply(rz);
    cube.matrix.copy(rot);
    cube.matrixWorld.copy(rot);
    mv.multiplyMatrices(view, rot);
    mvp.multiplyMatrices(proj, mv);
    nrm.setFromMatrix4(mv);
  }

  function tick(now) {
    frame = requestAnimationFrame(tick);
    const i = reduceMotion ? 0 : (now / 1000) * 60;
    pose(i);
    renderer.render(scene, camera);
  }

  window.addEventListener("resize", sizeToCanvas);

  sizeToCanvas();
  pose(0);
  frame = requestAnimationFrame(tick);

  root._notFoundTeardown = function () {
    cancelAnimationFrame(frame);
    window.removeEventListener("resize", sizeToCanvas);
    material.dispose();
    texture.dispose();
    cube.geometry.dispose();
    renderer.dispose();
  };
}

const root = document.querySelector(".not-found-header");
if (root) {
  loadFaceImage()
    .then((img) => init(root, img))
    .catch((err) => {
      console.error("404 cube failed", err);
      const fallback = root.querySelector("[data-not-found-fallback]");
      if (fallback) fallback.hidden = false;
    });
}
