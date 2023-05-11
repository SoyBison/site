import { STLLoader } from
'three/addons/loaders/STLLoader.js';
import { OBJLoader } from
'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from
'three/addons/loaders/MTLLoader.js';

$(document).ready(function() {
  let BEANS = 256;

  let container = document.getElementById('featured-dataviz');
  let renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);
  let scene = new THREE.Scene();
  let camera = new THREE.PerspectiveCamera(90, container.clientWidth / container.clientHeight, 0.1, 1000);
  scene.add(camera);

  // Globe
  let globe_loader = new MTLLoader();
  let globe = new THREE.Object3D();
  globe_loader.load("models/lpEarth.mtl", function(mat) {
    mat.preload();
    let objloader = new OBJLoader();
    objloader.setMaterials(mat);
    objloader.load("models/lpEarth.obj", function(object) {
      globe.add(object);
    })
  })
  globe.scale.set(.24, .24, .24);
  globe.position.set(0, -12, -10);
  globe.rotation.x = Math.PI / 6;
  globe.reflectivity = 1;
  scene.add(globe);
  // Beans
  let loader = new STLLoader();
  let beans = new Array();
  let plane = new THREE.Plane();
  let point = new THREE.Vector3();
  loader.load("models/bean.stl", function(geom) {
    for (let i = 1; i < BEANS+1; i++) {
      let bean = new THREE.Object3D();
      let mesh = new THREE.Mesh(geom, new THREE.MeshPhysicalMaterial(
        {color: 0x180C02, roughness: 0.7, flatShading: true, metalness: 0.0}
      ));
      bean.add(mesh.clone());
      bean.scale.set(0.2, 0.2, 0.2);
      bean.angle = new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize();
      bean.orbitSpeed = (Math.random() * 0.05) + 0.01;
      bean.rotspeed = (Math.random() * 0.05) + 0.1;
      bean.rotvec = new THREE.Vector3(Math.random() < 0.5 ? 1 : -1, Math.random() < 0.5 ? 1 : -1, Math.random() < 0.5 ? 1 : -1);
      if (Math.random() > 0.5) bean.orbitSpeed *= -1;
      if (Math.random() > 0.5) bean.angle = bean.angle.cross(new THREE.Vector3(0, 1, 0));
      plane.normal.copy(bean.angle);
      point.set(Math.random(), Math.random(), Math.random());
      plane.projectPoint(point, bean.position);
      bean.position.setLength(Math.floor(Math.random() * 5) + 15);
      bean.position.applyAxisAngle(bean.angle, Math.random() / 10);
      scene.add(bean);
      beans.push(bean);
    }
  });
  let coloredIntensity = 7;

  let ambi = new THREE.AmbientLight(0xffffff, 2)
  scene.add(ambi);
  let rlight = new THREE.DirectionalLight(0xDAA520, coloredIntensity);
  rlight.position.set(5, 5, 5);
  scene.add(rlight);
  rlight.target = globe;

  camera.position.z = 25;
  camera.position.x = 0;
  camera.position.y = -20;
  camera.lookAt(0, 0, 0);
  function updateBeans(){
    let obj = null;
    for(let i = 1; i < BEANS; i++){
      obj = beans[i];
      if (obj != undefined && obj.position != undefined && obj.position != null) {
        obj.position.applyAxisAngle(obj.angle, obj.orbitSpeed);
      }
    }
  };

  function animate() {
    requestAnimationFrame(animate);
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    updateBeans();
    beans.forEach(function(bean) {
      bean.rotation.x += bean.rotspeed * bean.rotvec.x;
      bean.rotation.y += bean.rotspeed * bean.rotvec.y;
      bean.rotation.z += bean.rotspeed * bean.rotvec.z;
    })
    globe.rotation.y += 0.0075;
    renderer.render(scene, camera);
  }
  animate();

});
