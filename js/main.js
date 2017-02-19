(function() {
  var camera, scene, renderer;

  var raycaster;
  var mouse;
  var objects = [];
  var rotationSpeed = [(Math.random() * 0.4)/100, (Math.random() * 0.4)/100, (Math.random() * 0.4)/100];
  var CAMERA_SPEED = 0.02;
  var RADIUS = 300;
  var theta = 0;
  var CUBE_SIZE = window.innerWidth >= 600 ? 10 : 15;
  var NUM_OF_CUBES = window.innerWidth >= 600 ? 100 : 20;
  var filterCoordinates = [];

  init();
  animate();

  function init() {
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.y = 300;
    camera.position.z = 500;

    scene = new THREE.Scene();

    var geometry = new THREE.BoxGeometry( CUBE_SIZE, CUBE_SIZE, CUBE_SIZE );

    for (var i = 0; i < NUM_OF_CUBES; i++) {

      // generate random coordinates that are not already occupied yet
      var coordinates = generateRandomCoords(filterCoordinates);
      objects[i] = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff, opacity: 0.4, transparent: true, depthWrite: false } ) );
      objects[i].position = Object.assign(objects[i].position, coordinates);

      // add to filter so we do not generate conflicting coordinates again
      filterCoordinates.push(coordinates);

      // modify rotation
      objects[i].rotation.x = Math.random() * 2 * Math.PI;
      objects[i].rotation.y = Math.random() * 2 * Math.PI;

      scene.add( objects[i] );

      // add edges to cubes
      var egh = new THREE.EdgesHelper( objects[i], 0xffffff );
      egh.material.linewidth = 1.5;
      scene.add( egh );
    }

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor("white");
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.getElementById('hero').appendChild(renderer.domElement);

    //document.addEventListener( 'mousedown', onDocumentMouseDown, false );
    //document.addEventListener( 'touchstart', onDocumentTouchStart, false );

    if (window.DeviceOrientationEvent) {
      window.addEventListener( 'deviceorientation', onDeviceOrientation, false );
    }
    window.addEventListener( 'resize', onWindowResize, false );


    if (window.innerWidth > 600 || !window.DeviceOrientationEvent) {
      // set time shift
      setInterval(function() {
        CAMERA_SPEED = 0.2;
        setTimeout(function() {
          CAMERA_SPEED = 0.02;
        }, 750)
      }, 12000);
    }
  }

  function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

  }

  function onDocumentTouchStart( event ) {

    event.preventDefault();

    event.clientX = event.touches[0].clientX;
    event.clientY = event.touches[0].clientY;
    onDocumentMouseDown( event );

  }

  function onDocumentMouseDown( event ) {

    event.preventDefault();
    mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;

    raycaster.setFromCamera( mouse, camera );

    var intersects = raycaster.intersectObjects( scene.children );

    if ( intersects.length > 0 ) {

      new TWEEN.Tween( intersects[ 0 ].object.position ).to( {
        x: Math.random() * 800 - 400,
        y: Math.random() * 800 - 400,
        z: Math.random() * 800 - 400 }, 2000 )
      .easing( TWEEN.Easing.Elastic.Out).start();

      new TWEEN.Tween( intersects[ 0 ].object.rotation ).to( {
        x: Math.random() * 2 * Math.PI,
        y: Math.random() * 2 * Math.PI,
        z: Math.random() * 2 * Math.PI }, 2000 )
      .easing( TWEEN.Easing.Elastic.Out).start();

    }
  }

  function onDeviceOrientation( event ) {
    // set camera to change its view based on accelerometer
    camera.position.x = RADIUS * Math.sin( THREE.Math.degToRad( event.gamma ) );
    camera.position.y = RADIUS * Math.sin( THREE.Math.degToRad( event.beta ) );
    camera.lookAt( scene.position );

    raycaster.setFromCamera( mouse, camera );
    renderer.render( scene, camera );
  }

  function animate() {
    requestAnimationFrame( animate );
    render();
  }

  function render() {
    // rotate camera
    if (window.innerWidth > 600 || !window.DeviceOrientationEvent) {

      theta += CAMERA_SPEED;

      camera.position.x = RADIUS * Math.sin( THREE.Math.degToRad( theta ) );
      camera.position.y = RADIUS * Math.sin( THREE.Math.degToRad( theta ) );
      camera.position.z = RADIUS * Math.cos( THREE.Math.degToRad( theta ) );
      camera.lookAt( scene.position );
    }
    // rotate every other cube a little
    for (var i=0; i<objects.length; i+=2) {
      objects[i].rotation.x += rotationSpeed[0];
      objects[i].rotation.y += rotationSpeed[1];
      objects[i].rotation.z += rotationSpeed[2];
    }
    raycaster.setFromCamera( mouse, camera );
    renderer.render( scene, camera );
  }

  // generate random coordinates based on page and size of cubes
  function generateRandomCoords() {
    var coords = {
      x: (Math.random() * 800 - 400),
      y: (Math.random() * 800 - 400),
      z: (Math.random() * 800 - 400)
    };

    return coords;
  }
})();