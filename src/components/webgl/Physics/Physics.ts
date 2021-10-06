import * as CANNON from 'cannon-es';
import CannonDebugRenderer from '../../../cannonDebugger/cannonDebuger';
import * as dat from 'dat.gui';
import CannonUtils from '../../../cannonDebugger/cannonUtils';
export class PhysicsWorld {
  private planeBody: CANNON.Body;
  private planeShape: CANNON.Shape;
  private leftWall: CANNON.Body;
  private rightWall: CANNON.Body;
  private frontWall: CANNON.Body;
  private backwall: CANNON.Body;
  private firstFloorPartOne: CANNON.Body;
  private firstFloorPartTwo: CANNON.Body;

  public physicsWorld: CANNON.World;
  public sphereBody: CANNON.Body;
  public cannonDebugRenderer: CannonDebugRenderer;
  public gui: dat.GUI;

  constructor(scene: THREE.Scene) {
    this.physicsWorld = new CANNON.World();
    this.physicsWorld.broadphase = new CANNON.SAPBroadphase(this.physicsWorld);
    this.physicsWorld.gravity = new CANNON.Vec3(0, -50, 0);

    this.sphereBody = new CANNON.Body({
      mass: 10000,
      type: CANNON.Body.DYNAMIC,
      position: new CANNON.Vec3(0, 2, -5),
      shape: new CANNON.Sphere(0.62)
    });

    this.planeBody = new CANNON.Body({
      position: new CANNON.Vec3(0, 0.5, 0),
      shape: new CANNON.Plane()
    });

    this.leftWall = new CANNON.Body({
      shape: new CANNON.Box(new CANNON.Vec3(0.2, 7, 30.5)),
      position: new CANNON.Vec3(-15.6, 7.6, 0)
    });

    this.rightWall = new CANNON.Body({
      shape: new CANNON.Box(new CANNON.Vec3(0.2, 7, 30.5)),
      position: new CANNON.Vec3(15.6, 7.6, 0)
    });

    this.frontWall = new CANNON.Body({
      shape: new CANNON.Box(new CANNON.Vec3(15.5, 7, 0.2)),
      position: new CANNON.Vec3(0, 7.6, -30.8)
    });

    this.backwall = new CANNON.Body({
      shape: new CANNON.Box(new CANNON.Vec3(15.5, 7, 0.2)),
      position: new CANNON.Vec3(0, 7.6, 30.8)
    });

    this.firstFloorPartOne = new CANNON.Body({
      shape: new CANNON.Box(new CANNON.Vec3(8, 0.2, 10.5)),
      position: new CANNON.Vec3(-8, 8.5, 20.5)
    });

    this.firstFloorPartTwo = new CANNON.Body({
      shape: new CANNON.Box(new CANNON.Vec3(8, 0.2, 5)),
      position: new CANNON.Vec3(8, 8.5, 25.6)
    });

    this.gui = new dat.GUI({width: 340});
    this.gui.add(this.firstFloorPartTwo.position, 'x').step(0.1).name('position x');
    this.gui.add(this.firstFloorPartTwo.position, 'y').step(0.1).name('position y');
    this.gui.add(this.firstFloorPartTwo.position, 'z').step(0.1).name('position z');
    this.planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);

    this.physicsWorld.addBody(this.sphereBody);
    this.physicsWorld.addBody(this.planeBody);
    this.physicsWorld.addBody(this.leftWall);
    this.physicsWorld.addBody(this.rightWall);
    this.physicsWorld.addBody(this.frontWall);
    this.physicsWorld.addBody(this.backwall);
    this.physicsWorld.addBody(this.firstFloorPartOne);
    this.physicsWorld.addBody(this.firstFloorPartTwo);

    this.cannonDebugRenderer = new CannonDebugRenderer(scene, this.physicsWorld);
  }

  createPhysics(mesh: THREE.Mesh): void {
    const shape = CannonUtils.CreateTrimesh(mesh.geometry);

    const physicsBody = new CANNON.Body({
      mass: 0,
      shape: shape
    });

    physicsBody.position.x = mesh.position.x;
    physicsBody.position.y = mesh.position.y;
    physicsBody.position.z = mesh.position.z;

    this.physicsWorld.addBody(physicsBody);
  }
}
