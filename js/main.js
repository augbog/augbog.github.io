(function() {
  var container;
  var camera, scene, renderer;

  var raycaster;
  var mouse;
  var objects = [];
  var rotationSpeed = [(Math.random() * 0.4)/100, (Math.random() * 0.4)/100, (Math.random() * 0.4)/100];
  var radius = 300;
  var theta = 0;
  var size = 50;
  var materials;
  var mesh;

  init();
  animate();

  function init() {
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.y = 300;
    camera.position.z = 500;

    scene = new THREE.Scene();

    // var texture = new THREE.TextureLoader().load( 'svg/codepen.svg' );
    // var geometry = new THREE.BoxGeometry( 16, 16, 16 );
    var texture = new THREE.TextureLoader().load( 'svg/grunt.png' );
    var geometry = new THREE.BoxGeometry( 100, 100, 100 );

    var material = new THREE.MeshBasicMaterial( { map: texture, transparent: true, opacity: 0.5 } );
    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );
    // for ( var i = 0; i < 20; i ++ ) {

    //   objects[i] = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff, opacity: Math.random() * 0.6 + 0.1 } ) );
    //   objects[i].position.x = Math.random() * 800 - 400;
    //   objects[i].position.y = Math.random() * 800 - 400;
    //   objects[i].position.z = Math.random() * 800 - 400;
    //   // object.scale.x = Math.random() * 2 + 1;
    //   // object.scale.y = Math.random() * 2 + 1;
    //   // object.scale.z = Math.random() * 2 + 1;
    //   objects[i].rotation.x = Math.random() * 2 * Math.PI;
    //   objects[i].rotation.y = Math.random() * 2 * Math.PI;
    //   //object.rotation.z = Math.random() * 2 * Math.PI;
    //   scene.add( objects[i] );
    //   var egh = new THREE.EdgesHelper( objects[i], 0xffffff );
    //   egh.material.linewidth = 1.5;
    //   scene.add( egh );
    // }

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor("white");
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild(renderer.domElement);

    document.addEventListener( 'mousedown', onDocumentMouseDown, false );
    document.addEventListener( 'touchstart', onDocumentTouchStart, false );

    if (window.DeviceOrientationEvent) {
      window.addEventListener( 'deviceorientation', onDeviceOrientation, false );
    }
    window.addEventListener( 'resize', onWindowResize, false );

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
    camera.position.x = radius * Math.sin( THREE.Math.degToRad( event.gamma ) );
    camera.position.y = radius * Math.sin( THREE.Math.degToRad( event.beta ) );
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
      theta += 0.05;

      camera.position.x = radius * Math.sin( THREE.Math.degToRad( theta ) );
      camera.position.y = radius * Math.sin( THREE.Math.degToRad( theta ) );
      camera.position.z = radius * Math.cos( THREE.Math.degToRad( theta ) );
      camera.lookAt( scene.position );
    }

    mesh.rotation.x += rotationSpeed[0];
    mesh.rotation.y += rotationSpeed[1];
    mesh.rotation.z += rotationSpeed[2];
    // rotate every other cube a little
    // for (var i=0; i<objects.length; i+=2) {
    //   objects[i].rotation.x += rotationSpeed[0];
    //   objects[i].rotation.y += rotationSpeed[1];
    //   objects[i].rotation.z += rotationSpeed[2];
    // }
    raycaster.setFromCamera( mouse, camera );
    renderer.render( scene, camera );
  }
})();