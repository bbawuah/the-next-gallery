import * as CANNON from 'cannon-es';
import * as THREE from 'three';
import CannonDebugRenderer from '../cannonDebugger/cannonDebuger';
import {portraitNames} from '../../../utils/metaData';
import {store} from '../../../store/store';

interface RenderProps {
  camera: THREE.PerspectiveCamera;
  elapsedTime: number;
  userDirection: THREE.Vector3;
}

interface SceneProps {
  scene: THREE.Scene;
}

export class PhysicsWorld {
  private planeBody: CANNON.Body;
  private firstFloorPartOne: CANNON.Body;
  private firstFloorPartTwo: CANNON.Body;
  private firstFloorPartThree: CANNON.Body;
  private collissions: CANNON.Body[];

  public physicsWorld: CANNON.World;
  public sphereBody: CANNON.Body;
  public cannonDebugRenderer: CannonDebugRenderer;

  constructor(props: SceneProps) {
    this.physicsWorld = new CANNON.World({
      gravity: new CANNON.Vec3(0, -9.82, 0)
    });
    this.physicsWorld.broadphase = new CANNON.SAPBroadphase(this.physicsWorld);

    (this.physicsWorld.solver as CANNON.GSSolver).iterations = 10;

    this.sphereBody = new CANNON.Body({
      mass: 1,
      type: CANNON.Body.DYNAMIC,
      position: new CANNON.Vec3(0, 1, -5),
      shape: new CANNON.Sphere(0.7)
    });

    this.planeBody = new CANNON.Body({
      position: new CANNON.Vec3(0, 0, 0),
      shape: new CANNON.Plane()
    });
    this.planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);

    this.firstFloorPartOne = new CANNON.Body({
      shape: new CANNON.Box(new CANNON.Vec3(7.6, 0.2, 16)),
      position: new CANNON.Vec3(-8.2, 5.6, 0)
    });

    this.firstFloorPartTwo = new CANNON.Body({
      shape: new CANNON.Box(new CANNON.Vec3(5.2, 0.2, 8)),
      position: new CANNON.Vec3(5.1, 5.6, 12)
    });

    this.firstFloorPartThree = new CANNON.Body({
      shape: new CANNON.Box(new CANNON.Vec3(5.2, 0.2, 8)),
      position: new CANNON.Vec3(5, 5.6, -11)
    });

    const wallOne = new CANNON.Body({
      shape: new CANNON.Box(new CANNON.Vec3(5.2, 1.72, 25)),
      position: new CANNON.Vec3(29.3, 1.7, 2)
    });

    const wallTwo = new CANNON.Body({
      shape: new CANNON.Box(new CANNON.Vec3(5.2, 1.72, 25)),
      position: new CANNON.Vec3(-29.3, 1.7, 2)
    });

    const wallThree = new CANNON.Body({
      shape: new CANNON.Box(new CANNON.Vec3(28.1, 1.7, 5)),
      position: new CANNON.Vec3(-0.5, 1.7, -27)
    });

    const wallFour = new CANNON.Body({
      shape: new CANNON.Box(new CANNON.Vec3(28.1, 1.7, 5)),
      position: new CANNON.Vec3(-0.5, 1.7, 32)
    });

    this.collissions = [];

    portraitNames.forEach((creative, index) => {
      const shape = new CANNON.Box(new CANNON.Vec3(0.75, 0.075, 0.75));
      const position = new CANNON.Vec3(creative.coordinates.x, creative.coordinates.y, creative.coordinates.z);

      const body = new CANNON.Body({
        shape,
        position,
        isTrigger: true
      });

      body.addEventListener('collide', () => {
        store.creativeIndex.update(() => index);
      });

      this.collissions.push(body);

      this.physicsWorld.addBody(body);
    });

    this.physicsWorld.addEventListener('endContact', event => {
      if (
        (event.bodyA === this.sphereBody && this.collissions.includes(event.bodyB)) ||
        (event.bodyB === this.sphereBody && this.collissions.includes(event.bodya))
      ) {
        store.creativeIndex.update(() => null);
      }
    });

    this.physicsWorld.addBody(this.sphereBody);
    this.physicsWorld.addBody(this.planeBody);
    this.physicsWorld.addBody(this.firstFloorPartOne);
    this.physicsWorld.addBody(this.firstFloorPartTwo);
    this.physicsWorld.addBody(this.firstFloorPartThree);
    this.physicsWorld.addBody(wallOne);
    this.physicsWorld.addBody(wallTwo);
    this.physicsWorld.addBody(wallThree);
    this.physicsWorld.addBody(wallFour);

    this.cannonDebugRenderer = new CannonDebugRenderer(props.scene, this.physicsWorld);
  }

  public createPhysics(mesh: THREE.Mesh): void {
    const shape = this.createTrimesh(mesh.geometry);

    const body = new CANNON.Body({
      mass: 0,
      shape: shape
    });

    body.position.x = mesh.position.x;
    body.position.y = mesh.position.y;
    body.position.z = mesh.position.z;

    this.physicsWorld.addBody(body);
  }

  public createTrimesh(geometry: THREE.BufferGeometry): CANNON.Trimesh {
    const vertices = this.getVertices(geometry);

    if (!vertices.length) return null;

    const indices = Object.keys(vertices).map(Number);
    return new CANNON.Trimesh(vertices as unknown as number[], indices);
  }

  getVertices(geometry: THREE.BufferGeometry): Float32Array {
    const position = geometry.attributes.position;
    const vertices = new Float32Array(position.count * 3);
    for (let i = 0; i < position.count; i += 3) {
      vertices[i] = position.getX(i);
      vertices[i + 1] = position.getY(i);
      vertices[i + 2] = position.getZ(i);
    }
    return vertices;
  }

  public handlePhysics(props: RenderProps): void {
    const {camera, userDirection, elapsedTime} = props;

    let oldElapsedTime = 0;
    const deltaTime = elapsedTime - oldElapsedTime;
    oldElapsedTime = elapsedTime;

    const position = new THREE.Vector3(
      this.sphereBody.position.x,
      this.sphereBody.position.y,
      this.sphereBody.position.z
    );

    // this.cannonDebugRenderer.update();

    camera.position.copy(position);

    this.sphereBody.velocity.set(userDirection.x, this.sphereBody.velocity.y, userDirection.z);

    this.physicsWorld.step(1 / 60, deltaTime, 2);
  }
}
