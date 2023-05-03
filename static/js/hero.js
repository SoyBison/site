import { STLLoader } from
'three/addons/loaders/STLLoader.js';
import { OBJLoader } from
'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from
'three/addons/loaders/MTLLoader.js';

$(document).ready(function() {
  let BEANS = 48;

  let container = document.getElementById('featured-dataviz');
  let renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);
  let scene = new THREE.Scene();
  let camera = new THREE.PerspectiveCamera(90, container.clientWidth / container.clientHeight, 0.1, 1000);

  scene.add(camera);
  let loader = new STLLoader();
  let beanObjs = new Array();
  let beans = new Array();
  loader.load("models/bean.stl", function(geom) {
    for (let i = 1; i < BEANS+1; i++) {
      let bean = new THREE.Object3D();
      let mesh = new THREE.Mesh(geom, new THREE.MeshPhysicalMaterial(
        {color: 0x180C02, roughness: 0.5, flatShading: true, metalness: 0.1}
      ));
      bean.add(mesh.clone());
      bean.position.set(17, 0, 0);
      bean.scale.set(0.5, 0.5, 0.5);
      let beanObj = new THREE.Object3D();
      beanObj.add(bean);
      //if(i % 2 == 0) {
        //beanObj.rotation.x = (i / 2) * Math.PI / BEANS;
      //} else {
        //beanObj.rotation.x = - (i / 2) * Math.PI / BEANS;
      //}
      beanObj.rotation.x = 2 * i * Math.PI / BEANS;
      beanObj.rotation.y = 2 * i * Math.PI / BEANS;
      scene.add(beanObj);
      beans.push(bean);
      beanObjs.push(beanObj);
      scene.add(beanObj);
    }
  });
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
  globe.position.set(0, -10, -10);
  globe.rotation.x = Math.PI / 6;
  globe.reflectivity = 1;


  scene.add(globe);
  let coloredIntensity = 7;

  let ambi = new THREE.AmbientLight(0xffffff, 2)
  scene.add(ambi);
  let rlight = new THREE.DirectionalLight(0xDAA520, coloredIntensity);
  rlight.position.set(5, 5, 5);
  scene.add(rlight);
  rlight.target = globe;

  camera.position.z = 25;
  camera.position.x = 0;
  camera.position.y = -10;
  camera.lookAt(0, 0, 0);

  function animate() {
    requestAnimationFrame(animate);
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    beanObjs.forEach(function(bean) {
      bean.rotation.y += 0.01;
    })
    beans.forEach(function(bean) {
      bean.rotation.y += 0.01;
      bean.rotation.x += 0.01;
      bean.rotation.z += 0.01;
    })
    globe.rotation.y += 0.0075;
    renderer.render(scene, camera);
  }
  animate();

});
