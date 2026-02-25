import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import konamiKomando from 'konami-komando';
import { THEMES } from '../constants/themes';

export function useThreeScene(canvasRef, onScoreUpdate) {
  const objectsRef = useRef([]);

  // Exposed to parent via ThreeScene's imperative handle.
  // Uses a ref internally so it always reads the latest objects array.
  const setTheme = useCallback((palette) => {
    const objects = objectsRef.current;
    if (!palette) {
      for (let i = 0; i < objects.length; i++) {
        objects[i].material.color.set(new THREE.Color(Math.random() * 0xffffff));
      }
    } else {
      for (let i = 0; i < objects.length; i++) {
        const raw = palette[i % palette.length].replace('#', '0x');
        const hexColor = parseInt(raw, 16);
        objects[i].material.color.set(new THREE.Color(hexColor));
      }
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isMobile = window.innerWidth < 600;
    const CUBE_SIZE = isMobile ? 10 : 5;
    const NUM_OF_CUBES = isMobile ? 250 : 1000;
    const RADIUS = 300;

    // Mutable state kept in closures (no re-renders needed)
    let multiplier = 1;
    let theta = 0;
    let pivotSpeed = 0.02;
    let themeIndex = 0;
    let score = 0;
    let animationId = null;
    let pivotInterval = null;
    let pivotTimeout = null;
    const mouse = new THREE.Vector2();
    const intersected = {};

    // ── Dark mode ─────────────────────────────────────────────────────────
    const darkModeMedia = window.matchMedia('(prefers-color-scheme: dark)');
    const isDarkMode = darkModeMedia.matches;

    // ── Line material (shared across cubes) ───────────────────────────────
    const lineMaterial = new THREE.LineBasicMaterial({
      color: isDarkMode ? 0x000000 : 0xffffff,
      linewidth: 2,
    });

    // ── Scene ─────────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    const pivot = new THREE.Group();
    scene.add(pivot);

    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.y = 300;
    camera.position.z = isMobile ? 200 : 500;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
    renderer.setClearColor(isDarkMode ? 'black' : 'white');
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    const raycaster = new THREE.Raycaster();

    // ── Cubes ─────────────────────────────────────────────────────────────
    const geometry = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);
    const edgesGeometry = new THREE.EdgesGeometry(geometry);
    const objects = [];

    for (let i = 0; i < NUM_OF_CUBES; i++) {
      const mesh = new THREE.Mesh(
        geometry,
        new THREE.MeshBasicMaterial({
          color: new THREE.Color(Math.random() * 0xffffff),
          opacity: 0.6,
          transparent: true,
          depthWrite: false,
        })
      );
      mesh.position.set(
        Math.random() * 800 - 200,
        Math.random() * 800 - 200,
        Math.random() * 800 - 200
      );
      mesh.rotation.x = Math.random() * 2 * Math.PI;
      mesh.rotation.y = Math.random() * 2 * Math.PI;
      mesh.add(new THREE.LineSegments(edgesGeometry, lineMaterial));
      pivot.add(mesh);
      objects.push(mesh);
    }
    objectsRef.current = objects;

    // ── Helpers ───────────────────────────────────────────────────────────
    function getBaseLog(x, y) {
      return Math.log(y) / Math.log(x);
    }

    function flickerCubes() {
      let index = 0;
      for (let i = 0; i < THEMES.length; i++) {
        const theme = THEMES[i];
        setTimeout(() => setTheme(theme), index++ * 200);
      }
      setTimeout(() => setTheme(null), index * 200);
    }

    function incrementScore() {
      score++;
      if (score % 100 === 0) flickerCubes();
      onScoreUpdate(score);
    }

    function blowUpCubes() {
      const halfLen = Math.max(2, Math.floor(objects.length / 2));
      const restoreDelay = Math.floor(getBaseLog(2, halfLen) * 200);

      for (let i = 0; i < objects.length; i += 2) {
        const obj = objects[i];
        const delay = i === 0 ? 0 : Math.floor(getBaseLog(2, i) * 200);

        const shrinkTween = new TWEEN.Tween(obj.scale)
          .delay(restoreDelay)
          .to({ x: 1, y: 1, z: 1 }, 500)
          .easing(TWEEN.Easing.Elastic.Out);

        new TWEEN.Tween(obj.scale)
          .delay(delay)
          .to({ x: 3, y: 3, z: 3 }, 500)
          .easing(TWEEN.Easing.Elastic.Out)
          .onComplete(() => shrinkTween.start())
          .start();

        new TWEEN.Tween(obj.rotation)
          .delay(delay)
          .to({ x: Math.random(), y: Math.random(), z: Math.random() }, 500)
          .easing(TWEEN.Easing.Elastic.Out)
          .start();
      }
    }

    // ── Animation loop ────────────────────────────────────────────────────
    function render() {
      if (multiplier > 0 && theta >= 100) multiplier = -1;
      else if (multiplier < 0 && theta <= 0) multiplier = 1;
      theta += pivotSpeed * multiplier;

      const s = Math.sin(THREE.MathUtils.degToRad(theta));
      pivot.rotation.set(s, s, s);

      raycaster.setFromCamera(mouse, camera);
      renderer.render(scene, camera);
    }

    function animate() {
      animationId = requestAnimationFrame(animate);
      TWEEN.update();
      render();
    }
    animate();

    // ── Pivot pulse (desktop / no-gyro) ───────────────────────────────────
    if (!isMobile || !window.DeviceOrientationEvent) {
      pivotInterval = setInterval(() => {
        pivotSpeed = 0.2;
        pivotTimeout = setTimeout(() => { pivotSpeed = 0.02; }, 750);
      }, 12000);
    }

    // ── Color scheme ──────────────────────────────────────────────────────
    function setColorScheme({ darkMode, shouldTransition }) {
      const toColor = new THREE.Color(darkMode ? 'black' : 'white');
      if (shouldTransition) {
        const fromColor = new THREE.Color(darkMode ? 'white' : 'black');
        new TWEEN.Tween(fromColor)
          .to(toColor, 500)
          .onUpdate(() => renderer.setClearColor(fromColor))
          .start();
      } else {
        renderer.setClearColor(toColor);
      }
      lineMaterial.color.set(darkMode ? 0x000000 : 0xffffff);
      renderer.render(scene, camera);
    }

    if (isDarkMode) {
      setColorScheme({ darkMode: true, shouldTransition: false });
    }

    // ── Event handlers ────────────────────────────────────────────────────
    function onDarkModeChange(e) {
      setColorScheme({ darkMode: e.matches, shouldTransition: true });
    }

    function onMouseMove(event) {
      event.preventDefault();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(objects);

      if (intersects.length > 0) {
        const obj = intersects[0].object;
        if (!intersected[obj.uuid]) {
          intersected[obj.uuid] = obj;

          const shrinkTween = new TWEEN.Tween(obj.scale)
            .to({ x: 1, y: 1, z: 1 }, 500)
            .delay(1000)
            .easing(TWEEN.Easing.Elastic.Out)
            .onComplete(() => { delete intersected[obj.uuid]; });

          new TWEEN.Tween(obj.scale)
            .to({ x: 3, y: 3, z: 3 }, 500)
            .easing(TWEEN.Easing.Elastic.Out)
            .chain(shrinkTween)
            .start();

          new TWEEN.Tween(obj.rotation)
            .to({ x: Math.random(), y: Math.random(), z: Math.random() }, 500)
            .easing(TWEEN.Easing.Elastic.Out)
            .start();

          incrementScore();
        }
      }
    }

    function onKeyUp(e) {
      if (e.key.includes('Arrow')) {
        themeIndex = (themeIndex + 1) % THEMES.length;
        setTheme(THEMES[themeIndex]);
      }
    }

    function onDeviceOrientation(event) {
      const vectorAngle = new THREE.Vector3(
        RADIUS * Math.sin(THREE.MathUtils.degToRad(event.alpha)) * -1,
        RADIUS * Math.sin(THREE.MathUtils.degToRad(event.beta + 100)) * -1,
        scene.position.z
      );
      camera.lookAt(vectorAngle);
      raycaster.setFromCamera(mouse, camera);
      renderer.render(scene, camera);
    }

    function onWindowResize() {
      clearInterval(pivotInterval);
      clearTimeout(pivotTimeout);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.render(scene, camera);
    }

    // ── Attach listeners ──────────────────────────────────────────────────
    darkModeMedia.addEventListener('change', onDarkModeChange);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('keyup', onKeyUp);
    window.addEventListener('resize', onWindowResize);
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', onDeviceOrientation);
    }

    // ── Konami code ───────────────────────────────────────────────────────
    try {
      konamiKomando({ once: true, useCapture: true, callback: blowUpCubes });
    } catch (_) {
      // not critical if package is unavailable
    }

    // ── Cleanup ───────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animationId);
      clearInterval(pivotInterval);
      clearTimeout(pivotTimeout);

      darkModeMedia.removeEventListener('change', onDarkModeChange);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('resize', onWindowResize);
      if (window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', onDeviceOrientation);
      }

      geometry.dispose();
      edgesGeometry.dispose();
      lineMaterial.dispose();
      objects.forEach((obj) => obj.material.dispose());
      renderer.dispose();
      objectsRef.current = [];
    };
  // setTheme is stable (useCallback []); onScoreUpdate is stable (setScore from useState)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { setTheme };
}
