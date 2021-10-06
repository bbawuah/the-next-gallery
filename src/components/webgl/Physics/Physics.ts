import * as CANNON from 'cannon-es';

export class PhysicsWorld {
  // Physics
  public physicsWorld: CANNON.World;
  public sphereBody: CANNON.Body;
  public planeBody: CANNON.Body;
  public planeShape: CANNON.Shape;

  constructor() {
    this.physicsWorld = new CANNON.World();
    this.physicsWorld.broadphase = new CANNON.SAPBroadphase(this.physicsWorld);
    this.physicsWorld.gravity = new CANNON.Vec3(0, -30, 0);

    this.sphereBody = new CANNON.Body({
      mass: 1,
      type: CANNON.Body.DYNAMIC,
      position: new CANNON.Vec3(0, 2, -5),
      shape: new CANNON.Sphere(1)
    });

    this.planeBody = new CANNON.Body({
      position: new CANNON.Vec3(0, 0.5, 0),
      shape: new CANNON.Plane()
    });

    this.planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);

    this.physicsWorld.addBody(this.sphereBody);
    this.physicsWorld.addBody(this.planeBody);
  }
}
