import { OBJLoader } from
'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from
'three/addons/loaders/MTLLoader.js';
import { OrbitControls } from
'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { SMAAPass } from 'three/addons/postprocessing/SMAAPass.js';

$(document).ready(function() {

  let container = document.getElementById('featured-dataviz');
  let renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);
  let scene = new THREE.Scene();
  let camera = new THREE.PerspectiveCamera(90, container.clientWidth / container.clientHeight, 0.1, 1000);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.update()
  //scene.add(camera);
  //const axesHelper = new THREE.AxesHelper(100);
  //scene.add(axesHelper);
  const renderPass = new RenderPass(scene, camera);
  const bloomPass = new UnrealBloomPass(new THREE.Vector2(container.clientWidth, container.clientHeight), 1.5, 0.4, 0.85);
  bloomPass.threshold = 0.5;
  bloomPass.strength = 1;
  bloomPass.radius = 0;

  const smaaPass = new SMAAPass( window.innerWidth * renderer.getPixelRatio(), window.innerHeight * renderer.getPixelRatio() );

  const composer = new EffectComposer(renderer);
  composer.addPass(renderPass);
  composer.addPass(bloomPass);
  composer.addPass(smaaPass);
  scene.background = new THREE.Color(0x1e1e2e);


  // Globe
  let globe_loader = new MTLLoader();
  let globe = new THREE.Object3D();
  globe_loader.load("models/lpEarth.mtl", function(mat) {
    mat.preload();
    let objloader = new OBJLoader();
    objloader.setMaterials(mat);
    objloader.load("models/lpEarth.obj", function(object) {
      object.scale.set(0.25, 0.25, 0.25);
      globe.add(object);
    })
  })
  globe.translateX(-0.25);
  globe.translateZ(0);
  globe.translateY(-14.5);
  //globe.rotation.x = Math.PI / 6;
  //globe.reflectivity = 1;
  let center_geom = new THREE.SphereGeometry(15, 32, 32);
  let center_mat = new THREE.MeshPhysicalMaterial({color: 0xffffff, transparent: true, opacity: 0.5});
  let center_mesh = new THREE.Mesh(center_geom, center_mat);
  center_mesh.position.set(0, 0, 0);
  //scene.add(center_mesh);

  // Data Points
  let data_point = function(lat, lon, color=0xffffff, size=2) {
    let globe_r = 13;
    let geometry = new THREE.CylinderGeometry(.1, 0, size * 2, 32);
    //let geometry = new THREE.SphereGeometry(1, 32, 32);
    //geometry.translate(0, 5, 0);
    //geometry.rotateX(Math.PI / 2);
    let material = new THREE.MeshLambertMaterial({color: color, emmissive: 0xffffff});
    let mesh = new THREE.Mesh(geometry, material);
    let rad_lat = (lat + 90) * Math.PI / 180;
    let rad_lon = (lon) * Math.PI / 180;
    mesh.position.z = (globe_r + size) * Math.sin(rad_lat) * Math.cos(rad_lon);
    mesh.position.x = (globe_r + size) * Math.sin(rad_lat) * Math.sin(rad_lon);
    mesh.position.y = (globe_r + size) * Math.cos(rad_lat);
    //mesh.position.add(center_mesh.position);
    mesh.lookAt(0, 0, 0);
    mesh.rotateX(Math.PI / 2);
    //mesh.rotation.y += Math.PI / 2;
    //mesh.setRotationFromAxisAngle(mesh.position.clone().normalize(), Math.PI / 2 );
    return mesh;
  }
  let COLORS = {
    "Alibaba Cloud": 0xffffff,
    "Amazon Web Services": 0xffaa00,
    "Google Cloud": 0xe37b98,
    "Huawei Cloud": 0xdc2222,
    "IBM Cloud": 0x001d6c,
    "Microsoft Azure": 0x33ff33,
    "Oracle Cloud": 0xff00ff,
    "Tencent Cloud": 0x00bfff
  }
  d3.csv("data/cloud_regions.csv").then(function(data) {

    data.forEach(function(d) {
      let xjit = (Math.random() - .5) * 5;
      let yjit = (Math.random() - .5) * 5;
      scene.add(data_point(-d.lat + xjit, +d.lon + yjit, COLORS[d.provider]));
    })
  })
  //d3.csv("data/local_zones.csv").then(function(data) {
    //data.forEach(function(d) {
      //scene.add(data_point(-d.lat, d.lon, 0x00ff00));
    //})
  //})

  scene.add(globe);
  let coloredIntensity = 2;

  let ambi = new THREE.AmbientLight(0xcba6f7, 1.5)
  scene.add(ambi);
  let rlight = new THREE.DirectionalLight(0xcba6f7, coloredIntensity);
  rlight.position.set(10, 0, 10);
  scene.add(rlight);
  rlight.target = globe;

  camera.position.z = 25;
  camera.position.x = 0;
  camera.position.y = 10;
  camera.lookAt(0, 0, 0);

  function animate() {
    requestAnimationFrame(animate);
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    controls.update();
    //rlight.position.set(camera.position.clone());
    scene.rotation.y += 0.003;
    composer.render(scene, camera);
  }
  animate();

});
