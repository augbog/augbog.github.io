(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function() {
  require('./quote.js');
  require("konami-komando")({
    once: true,
    useCapture: true,
    callback: function() {
      console.log("Shh! Coming soon! Don't tell anyone 🤐");
    }
  });

  var camera, scene, renderer;

  var raycaster;
  var mouse;
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

    document.addEventListener( 'keyup', onKeyUp, false );
    
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

  function animate() {
    requestAnimationFrame( animate );
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
      x: (Math.random() * 800 - 400),
      y: (Math.random() * 800 - 400),
      z: (Math.random() * 800 - 400)
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
},{"./quote.js":2,"konami-komando":4}],2:[function(require,module,exports){
(function() {
  var quotes = require('../json/quotes.json');
  var quoteTrigger = document.getElementById('quotes');

  String.prototype.typeout = function(targetElem) {
    var timer;
    var str = this.split('');
    var strCopy = str.slice(0);
    clearTimeout(timer);
    var ll = '';
    (function shuffle(start){
      // This code is run options.fps times per second
      // and updates the contents of the page element
      var i, len = strCopy.length;
      if(start>=len){
        return targetElem.innerHTML = str.join('').toString();// you can use your selectors
      }
      ll = ll + strCopy[start];
      targetElem.innerHTML = ll; // you can use your selectors
      timer = setTimeout(function(){
        shuffle(start+1);
      }, 50);
    })(0);
  }

  function triggerQuoteAnimation() {
    var heading = document.getElementsByClassName('heading')[0];
    var description = document.getElementsByClassName('description')[0];
    var jobTitle = document.getElementsByClassName("job-title")[0];
    heading.className = 'heading quote';
    description.className = 'description author';
    jobTitle.style.display = 'none';

    var oHeading = heading.innerText;
    var oDescription = description.innerText;
    for (var i=0; i<=quotes.length; i++) {
      (function(i) {
        if (i == quotes.length) {
          setTimeout(function(e) {
            heading.className = 'heading';
            description.className = 'description';
            description.innerHTML = '';
            oHeading.typeout(heading);
          }, 10000*i);
          setTimeout(function(e) {
            oDescription.typeout(description);
            jobTitle.style = '';
          }, 10000*i+2000);
          quoteTrigger.removeEventListener('click', triggerQuoteAnimation);
        } else {
          var quote = new String(quotes[i].quote);
          var author = new String(quotes[i].author);
          setTimeout(function(e) {
            var moddedQuote = '“' + quote + '”';
            moddedQuote.typeout(heading);
            description.innerHTML = '';
          }, 10000*i);
          setTimeout(function(e) {
            author.typeout(description);
          }, 10000*i+2000);
        }
      })(i);
    }
  }

  quoteTrigger.addEventListener('click', triggerQuoteAnimation);
})();
},{"../json/quotes.json":3}],3:[function(require,module,exports){
module.exports=[
  {
    "quote" : "Fairy tales are more than true — not because they tell us dragons exist, but because they tell us dragons can be beaten.",
    "author": "G. K. Chesterton"
  },
  {
    "quote" : "Don't go through life, grow through life.",
    "author": "Eric Butterworth"
  },
  {
    "quote" : "Wisdom is knowing what to do next, skill is knowing how to do it, and virtue is doing it.",
    "author": "David Starr Jordan"
  },
  {
    "quote": "Never doubt that a small group of thoughtful, committed, citizens can change the world. Indeed, it is the only thing that ever has.",
    "author": "Margaret Mead"
  },
  {
    "quote": "When we speak we are afraid our words will not be heard or welcomed. But when we are silent, we are still afraid. So it is better to speak.",
    "author": "Audre Lorde"
  }
]


},{}],4:[function(require,module,exports){
var konami = function(opts) {
  if (typeof opts.once === "undefined") {
    opts.once = true;
  }

  if (typeof opts.useCapture === "undefined") {
    opts.useCapture = true;
  }

  if (typeof opts.callback !== "function") {
    throw new Error("Konami: callback is not a function.");
    return;
  }

  var ran = false;
  var keypresses = [];
  var KONAMI_CODE = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

  document.addEventListener('keydown', function(e) {
    if (opts.once && ran) {
      return;
    }

    var key = (function(e) {
      var event = e || window.event;
      return (event.keyCode || event.which);
    })(e);

    // if first button isn't up, return
    if (keypresses.length == 0 && key != 38) {
      return;
    // if valid konami code character and keypresses available
    } else if (keypresses.length < 10 && /37|38|39|40|65|66/.test(key)) {
      keypresses.push(key);
      if (keypresses.length == 10
          && JSON.stringify(keypresses) == JSON.stringify(KONAMI_CODE)) {
        opts.callback();
        if (opts.once) {
          ran = true;
        }
      }
    } else {
      keypresses = [];
    }
  }, opts.useCapture);
};

module.exports = konami;

},{}]},{},[1])