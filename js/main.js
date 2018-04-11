(function() {
  require('./quote.js');
  require("konami-komando")({
    once: true,
    useCapture: true,
    callback: function() {
      console.log("Shh! Coming soon! Don't tell anyone 🤐");
    }
  });
  var TWEEN = require("@tweenjs/tween.js");
  window.TWEEN = TWEEN;

  var camera, scene, renderer;

  var raycaster;
  var mouse = new THREE.Vector2(), INTERSECTED = [];
  var objects = [];
  var rotationSpeed = [(Math.random() * 0.4)/100, (Math.random() * 0.4)/100, (Math.random() * 0.4)/100];
  var PIVOT_SPEED = 0.02;
  var RADIUS = 300;
  var theta = 0;
  var CUBE_SIZE = window.innerWidth >= 600 ? 10 : 15;
  var NUM_OF_CUBES = window.innerWidth >= 600 ? 100 : 35;
  var filterCoordinates = [];
  var pivot = new THREE.Group();

  var pivotInterval;

  // new THREE.Color(theme[i % theme.length])
  var socialThemes = {
    "twitter": ["#1DA1F2", "#14171A", "#657786", "#AAB8C2"],
    "github": ["#333", "#6e5494", "#c6e48b", "#7bc96f", "#239a3b", "#196127"],
    "evernote": ['#dedede', '#5EBB6A', '#2DBD60'],
    "stackoverflow": ["#f48024", "#222426", "#bcbbbb"],
    "linkedin": ["#0077B5", "#00A0DC", "#313335", "#86888A"]
  }

  var themes = [
    ["#042A2B", "#5EB1BF", "#CDEDF6", "#EF7B45", "#D84727"],
    ["#E3E7D3", "#BDC2BF", "#989C94", "#25291C", "#E6E49F"],
    ["#EAF2E3", "#61E8E1", "#F25757", "F2E863", "F2CD60"],
    ['#E28413', '#F56416', '#DD4B1A', '#EF271B', '#EA1744'],
    ['#86583E', '#AF2A42', '#61643F', '#AFBE96', '#F0EEE1'],
    ['#D44A98', '#60B9CB', '#FFFB53'], //cmyk
  ];

  init();
  animate();
  document.getElementById("hero").appendChild(renderer.domElement);
  var icons = document.getElementsByClassName('js-theme-hover');
  for (var i=0; i < icons.length; i++) {
    icons[i].addEventListener("mouseenter", function(e) {
      themifyCubes(socialThemes[e.target.getAttribute('data-brand')]);
    });
  }

  function init() {
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.y = 300;
    camera.position.z = window.innerWidth >= 600 ? 500 : 200;

    scene = new THREE.Scene();
    scene.add(pivot);

    var geometry = new THREE.BoxGeometry( CUBE_SIZE, CUBE_SIZE, CUBE_SIZE );
    geometry.colorsNeedUpdate = true;

    var randomTheme = Math.floor(Math.random() * themes.length);

    for (var i = 0; i < NUM_OF_CUBES; i++) {
      var randomColor = Math.random() * 0xffffff;
      // generate random coordinates that are not already occupied yet
      var coordinates = generateRandomCoords(filterCoordinates);
      objects[i] = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: new THREE.Color(randomColor), opacity: 0.4, transparent: true, depthWrite: false } ) );
      objects[i].position = Object.assign(objects[i].position, coordinates);

      // add to filter so we do not generate conflicting coordinates again
      filterCoordinates.push(coordinates);

      // modify rotation
      objects[i].rotation.x = Math.random() * 2 * Math.PI;
      objects[i].rotation.y = Math.random() * 2 * Math.PI;
      pivot.add( objects[i] );

      // add edges to cubes
      var edges = new THREE.EdgesGeometry( geometry );
      var line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial(
          { color: 0xffffff, linewidth: 2 }
        ));
      objects[i].add(line);
    }

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor("white");
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    document.addEventListener( 'keyup', onKeyUp, false );
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    
    if (window.DeviceOrientationEvent) {
      window.addEventListener( 'deviceorientation', onDeviceOrientation, false );
    }
    window.addEventListener( 'resize', onWindowResize, false );


    if (window.innerWidth > 600 || !window.DeviceOrientationEvent) {
      if (pivotInterval) {
        clearInterval(pivotInterval);
      }
      // set time shift
      pivotInterval = setInterval(function() {
        PIVOT_SPEED = 0.2;
        setTimeout(function() {
          PIVOT_SPEED = 0.02;
        }, 750)
      }, 12000);
    }
  }

  function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

  }

  function onKeyUp(e) {
    if (e.key.includes('Arrow')) {
      var randomTheme = themes[Math.floor(Math.random() * themes.length + 1)];
      themifyCubes(randomTheme);
    }
  }

  function onDeviceOrientation( event ) {
    // set camera to change its view based on gyroscope
    // NOTE: adding 100 to beta starts the phone as if it were vertical
    var vectorAngle = new THREE.Vector3(
      RADIUS * Math.sin(THREE.Math.degToRad( event.alpha ))*-1,
      RADIUS * Math.sin(THREE.Math.degToRad( event.beta + 100 ))*-1,
      scene.position.z
    )
    camera.lookAt(vectorAngle);

    raycaster.setFromCamera( mouse, camera );
    renderer.render( scene, camera );
  }

  function onDocumentMouseMove(event) {
    event.preventDefault();
    mouse.x = event.clientX / window.innerWidth * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // if user hovers over specific cube, TWEEN scale to make it pop
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(objects);
    if (intersects.length > 0) {
      new TWEEN.Tween(intersects[0].object.scale)
        .to({ x: 3, y: 3, z: 3 }, 500)
        .easing(TWEEN.Easing.Elastic.Out)
        .start();
      new TWEEN.Tween(intersects[0].object.rotation)
        .to({ x: Math.random(), y: Math.random(), z: Math.random() }, 500)
        .easing(TWEEN.Easing.Elastic.Out)
        .start();
      INTERSECTED.push(intersects[0].object);
    } else {
      if (INTERSECTED.length > 0) {
        var length = INTERSECTED.length;
        for (var i=0; i < length; i++) {
          new TWEEN.Tween(INTERSECTED[i].scale)
            .to({ x: 1, y: 1, z: 1 }, 500)
            .delay(500)
            .easing(TWEEN.Easing.Elastic.Out)
            .start();
          INTERSECTED.splice(i, 1);
        }
      }
    }
  }

  function animate() {
    requestAnimationFrame( animate );
    TWEEN.update();
    render();
  }

  function render() {
    theta += PIVOT_SPEED;

    pivot.rotation.x = Math.sin( THREE.Math.degToRad( theta ) );
    pivot.rotation.y = Math.sin( THREE.Math.degToRad( theta ) );
    pivot.rotation.z = Math.cos( THREE.Math.degToRad( theta ) );

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
  // TODO: handle filtering of coordinates
  function generateRandomCoords(filterCoordinates) {
    var coords = {
      x: (Math.random() * 800 - 200),
      y: (Math.random() * 800 - 200),
      z: (Math.random() * 800 - 200)
    };

    return coords;
  }

  // takes in an array of hex colors and applies the theme equally to the cubes
  function themifyCubes(theme) {
    if (!theme) {
      for (var i = 0; i < objects.length; i++) {
        var randomColor = Math.random() * 0xffffff;
        objects[i].material.color.set(new THREE.Color(randomColor));
      }
    } else {
      for (var i = 0; i < objects.length; i++) {
        var hexColor = parseInt(theme[i % theme.length].replace("#", "0x"), 16);
        objects[i].material.color.set(new THREE.Color(hexColor));
      }
    }
  }
})();