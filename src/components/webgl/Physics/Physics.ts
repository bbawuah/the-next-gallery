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
  private fenceOne: CANNON.Body;
  private fenceTwo: CANNON.Body;
  private fenceThree: CANNON.Body;

  public physicsWorld: CANNON.World;
  public sphereBody: CANNON.Body;
  public isUpstairs: boolean;
  public cannonDebugRenderer: CannonDebugRenderer;
  public gui: dat.GUI;

  constructor(scene: THREE.Scene) {
    this.physicsWorld = new CANNON.World({
      gravity: new CANNON.Vec3(0, -9.82, 0)
    });
    this.physicsWorld.broadphase = new CANNON.SAPBroadphase(this.physicsWorld);

    (this.physicsWorld.solver as CANNON.GSSolver).iterations = 10;

    this.sphereBody = new CANNON.Body({
      mass: 1,
      type: CANNON.Body.DYNAMIC,
      position: new CANNON.Vec3(0, 2, -5),
      shape: new CANNON.Sphere(0.9)
    });

    this.planeBody = new CANNON.Body({
      position: new CANNON.Vec3(0, 0.5, 0),
      shape: new CANNON.Plane()
    });
    this.planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);

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

    this.fenceOne = new CANNON.Body({
      shape: new CANNON.Box(new CANNON.Vec3(8, 0.5, 0.2)),
      position: new CANNON.Vec3(-8, 9.3, 9.3)
    });

    this.fenceTwo = new CANNON.Body({
      shape: new CANNON.Box(new CANNON.Vec3(0.2, 0.5, 5.3)),
      position: new CANNON.Vec3(-0.2, 9.3, 14.7)
    });

    this.fenceThree = new CANNON.Body({
      shape: new CANNON.Box(new CANNON.Vec3(6, 0.5, 0.2)),
      position: new CANNON.Vec3(9.2, 9.3, 20)
    });

    this.gui = new dat.GUI({width: 340});
    this.gui.add(this.fenceThree.position, 'x').step(0.1).name('position x');
    this.gui.add(this.fenceThree.position, 'y').step(0.1).name('position y');
    this.gui.add(this.fenceThree.position, 'z').step(0.1).name('position z');

    this.physicsWorld.addBody(this.sphereBody);
    this.physicsWorld.addBody(this.planeBody);
    this.physicsWorld.addBody(this.leftWall);
    this.physicsWorld.addBody(this.rightWall);
    this.physicsWorld.addBody(this.frontWall);
    this.physicsWorld.addBody(this.backwall);
    this.physicsWorld.addBody(this.firstFloorPartOne);
    this.physicsWorld.addBody(this.firstFloorPartTwo);
    this.physicsWorld.addBody(this.fenceOne);
    this.physicsWorld.addBody(this.fenceTwo);
    this.physicsWorld.addBody(this.fenceThree);

    this.cannonDebugRenderer = new CannonDebugRenderer(scene, this.physicsWorld);
  }

  public createPhysics(mesh: THREE.Mesh): void {
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
