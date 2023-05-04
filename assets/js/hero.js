import { GLTFLoader } from
'three/addons/loaders/GLTFLoader.js';

console.log("owo")
$(document).ready(function() {
  let loader = new GLTFLoader();
  let model = null;
  loader.load("assets/gltf/bean.gltf", function(gltf) {
    model = gltf.scene;
  });
  console.log(model);

  let container = document.getElementById('featured-dataviz');
  let renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  const edgeParams = {
    color: 0x000000,
    reflectivity: 0,
    roughness: 1,
  }

  let scene = new THREE.Scene();
  let camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
  scene.add(camera);
  scene.add(model);
  camera.lookAt(model);

  let geometry = new THREE.IcosahedronGeometry(10, 1);
  let material = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    thickness: 1,
    clearcoat: 1,
    specularIntensity: 0,
    clearcoatRoughness: 1,
    roughness: 0.2,
    ior: 2.33,
    transmission: 0.6});
  let shape = new THREE.Mesh(geometry, material);
  let edge_geo = new THREE.EdgesGeometry(geometry);
  //let edge_mat = new THREE.LineBasicMaterial({color: 0xffffff, linewidth: 1, linecap: 'butt', linejoin: 'miter'});
  //let wireframe = new THREE.LineSegments(edge_geo, edge_mat);
  //shape.add(wireframe);

  let wirethickness = 0.12;
  for (let i = 0; i < edge_geo.attributes.position.count - 1; i+=2) {
    let startPoint = new THREE.Vector3(edge_geo.attributes.position.array[i * 3 + 0],
                                       edge_geo.attributes.position.array[i * 3 + 1],
                                       edge_geo.attributes.position.array[i * 3 + 2]);
    let endPoint = new THREE.Vector3(edge_geo.attributes.position.array[i * 3 + 3],
                                     edge_geo.attributes.position.array[i * 3 + 4],
                                     edge_geo.attributes.position.array[i * 3 + 5]);
    let cylLength = new THREE.Vector3().subVectors(endPoint, startPoint).length();
    let cylGeo = new THREE.CylinderGeometry(wirethickness, wirethickness, cylLength, 16);
    cylGeo.translate(0, cylLength / 2, 0);
    cylGeo.rotateX(Math.PI / 2);
    let cylMesh = new THREE.Mesh(cylGeo, new THREE.MeshPhysicalMaterial(edgeParams));
    cylMesh.position.copy(startPoint);
    cylMesh.lookAt(endPoint);
    shape.add(cylMesh);
  }

  scene.add(shape);
  let coloredIntensity = 1

  let ambi = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambi);
  let rlight = new THREE.DirectionalLight(0xff0000, coloredIntensity);
  rlight.position.set(0, 15, 20);
  scene.add(rlight);
  let glight = new THREE.DirectionalLight(0x00ff00, coloredIntensity);
  glight.position.set(-10, -15, 10);
  scene.add(glight);
  let blight = new THREE.DirectionalLight(0x0000ff, coloredIntensity);
  blight.position.set(10, -15, 10);
  scene.add(blight);
  rlight.target = shape;
  glight.target = shape;
  blight.target = shape;

  camera.position.z = 25;
  camera.position.x = 0;
  camera.position.y = -10;
  camera.lookAt(0, 0, 0);

  function animate() {
    requestAnimationFrame(animate);
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();

    shape.rotation.x += 0.0010;
    shape.rotation.y += 0.0075;
    renderer.render(scene, camera);
  }
  animate();

});
