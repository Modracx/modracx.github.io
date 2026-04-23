(function () {
  const reduceMotion =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  class Scene3D {
    constructor(containerId, mode = "nodes") {
      this.container = document.getElementById(containerId);
      if (!this.container || typeof window.THREE === "undefined" || reduceMotion) return;
      this.mode = mode;
      this.mouse = new THREE.Vector2();
      this.clock = new THREE.Clock();
      this.init();
      this.buildScene();
      this.bindEvents();
      this.animate();
    }

    init() {
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
      this.renderer.setClearColor(0x000000, 0);
      this.container.appendChild(this.renderer.domElement);

      this.camera = new THREE.PerspectiveCamera(
        50,
        this.container.offsetWidth / this.container.offsetHeight,
        0.1,
        1000
      );
      this.camera.position.set(0, 0, 5);
      this.scene = new THREE.Scene();
      this.scene.fog = new THREE.FogExp2(0x050810, 0.08);

      const ambient = new THREE.AmbientLight(0x0a1a2a, 2);
      const point1 = new THREE.PointLight(0x00d4ff, 3, 15);
      point1.position.set(3, 3, 3);
      const point2 = new THREE.PointLight(0x7b2fff, 2, 15);
      point2.position.set(-3, -2, 2);
      this.scene.add(ambient, point1, point2);
      this.lights = [point1, point2];
    }

    buildScene() {
      if (this.mode === "torus") this.buildTorus();
      else if (this.mode === "sphere") this.buildSphere();
      else if (this.mode === "grid") this.buildGrid();
      else this.buildNodes();
    }

    buildNodes() {
      this.nodeMeshes = [];
      const geometry = new THREE.SphereGeometry(0.06, 8, 8);
      for (let index = 0; index < 40; index += 1) {
        const mesh = new THREE.Mesh(
          geometry,
          new THREE.MeshStandardMaterial({
            color: 0x00d4ff,
            emissive: 0x003344,
            roughness: 0.3,
            metalness: 0.7,
          })
        );
        mesh.position.set(
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 4
        );
        mesh.userData.velocity = new THREE.Vector3(
          (Math.random() - 0.5) * 0.003,
          (Math.random() - 0.5) * 0.003,
          (Math.random() - 0.5) * 0.002
        );
        this.scene.add(mesh);
        this.nodeMeshes.push(mesh);
      }
      this.updateLines();
    }

    updateLines() {
      if (this.lineObject) this.scene.remove(this.lineObject);
      const points = [];
      for (let i = 0; i < this.nodeMeshes.length; i += 1) {
        for (let j = i + 1; j < this.nodeMeshes.length; j += 1) {
          if (this.nodeMeshes[i].position.distanceTo(this.nodeMeshes[j].position) < 2.5) {
            points.push(this.nodeMeshes[i].position.clone(), this.nodeMeshes[j].position.clone());
          }
        }
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: 0x004466,
        transparent: true,
        opacity: 0.4,
      });
      this.lineObject = new THREE.LineSegments(geometry, material);
      this.scene.add(this.lineObject);
    }

    buildTorus() {
      const geometry = new THREE.TorusKnotGeometry(1.8, 0.5, 128, 16, 2, 3);
      this.torusMesh = new THREE.Mesh(
        geometry,
        new THREE.MeshStandardMaterial({
          color: 0x00d4ff,
          emissive: 0x001a33,
          roughness: 0.2,
          metalness: 0.9,
        })
      );
      this.torusWire = new THREE.Mesh(
        geometry,
        new THREE.MeshBasicMaterial({
          color: 0x7b2fff,
          wireframe: true,
          transparent: true,
          opacity: 0.2,
        })
      );
      this.scene.add(this.torusMesh, this.torusWire);
    }

    buildSphere() {
      const count = 2000;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      for (let index = 0; index < count; index += 1) {
        const phi = Math.acos(2 * Math.random() - 1);
        const theta = Math.random() * Math.PI * 2;
        const radius = 2.5 + (Math.random() - 0.5) * 0.3;
        positions[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[index * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[index * 3 + 2] = radius * Math.cos(phi);
      }
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      this.particleSphere = new THREE.Points(
        geometry,
        new THREE.PointsMaterial({ color: 0x00d4ff, size: 0.03, transparent: true, opacity: 0.8 })
      );
      this.scene.add(this.particleSphere);
    }

    buildGrid() {
      const grid = new THREE.GridHelper(20, 40, 0x00d4ff, 0x001a2a);
      grid.position.y = -1.5;
      grid.material.transparent = true;
      grid.material.opacity = 0.4;
      this.scene.add(grid);

      this.diamond = new THREE.Mesh(
        new THREE.OctahedronGeometry(1.2, 0),
        new THREE.MeshStandardMaterial({
          color: 0x00d4ff,
          emissive: 0x002233,
          roughness: 0.1,
          metalness: 0.95,
        })
      );
      this.diamond.position.y = 0.5;
      this.diamondWire = new THREE.Mesh(
        new THREE.OctahedronGeometry(1.25, 0),
        new THREE.MeshBasicMaterial({
          color: 0x7b2fff,
          wireframe: true,
          transparent: true,
          opacity: 0.3,
        })
      );
      this.diamondWire.position.y = 0.5;
      this.scene.add(this.diamond, this.diamondWire);
    }

    bindEvents() {
      this.container.addEventListener("mousemove", (event) => {
        const rect = this.container.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      });
      window.addEventListener("resize", () => {
        this.camera.aspect = this.container.offsetWidth / this.container.offsetHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
      });
    }

    animate() {
      const tick = () => {
        window.requestAnimationFrame(tick);
        const time = this.clock.getElapsedTime();

        this.camera.position.x += (this.mouse.x * 1.5 - this.camera.position.x) * 0.03;
        this.camera.position.y += (this.mouse.y * 1 - this.camera.position.y) * 0.03;
        this.camera.lookAt(0, 0, 0);

        if (this.mode === "nodes" && this.nodeMeshes) {
          this.nodeMeshes.forEach((mesh) => {
            mesh.position.add(mesh.userData.velocity);
            ["x", "y", "z"].forEach((axis) => {
              if (Math.abs(mesh.position[axis]) > 4) mesh.userData.velocity[axis] *= -1;
            });
          });
          if (Math.floor(time * 10) % 5 === 0) this.updateLines();
        }

        if (this.mode === "torus" && this.torusMesh) {
          this.torusMesh.rotation.x = time * 0.3;
          this.torusMesh.rotation.y = time * 0.2;
          this.torusWire.rotation.x = time * 0.3;
          this.torusWire.rotation.y = time * 0.2;
        }

        if (this.mode === "sphere" && this.particleSphere) {
          this.particleSphere.rotation.y = time * 0.1;
          this.particleSphere.rotation.x = time * 0.05;
        }

        if (this.mode === "grid" && this.diamond) {
          this.diamond.rotation.y = time * 0.5;
          this.diamond.position.y = 0.5 + Math.sin(time * 0.8) * 0.2;
          this.diamondWire.rotation.y = -time * 0.3;
          this.diamondWire.position.y = this.diamond.position.y;
        }

        this.lights[0].position.x = Math.sin(time * 0.5) * 5;
        this.lights[0].position.z = Math.cos(time * 0.5) * 5;
        this.lights[1].position.x = Math.cos(time * 0.4) * 5;
        this.lights[1].position.z = Math.sin(time * 0.4) * 5;

        this.renderer.render(this.scene, this.camera);
      };
      tick();
    }
  }

  window.Scene3D = Scene3D;
})();
