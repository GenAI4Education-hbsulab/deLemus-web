import { Schema, MapSchema, Context, type } from "@colyseus/schema";

export class Player extends Schema {
  @type("string") id: string;
  @type("number") posX: number = 0;
  @type("number") posY: number = 0;
  @type("number") posZ: number = 0;
  @type("number") rotX: number = 0;
  @type("number") rotY: number = 0;
  @type("number") rotZ: number = 0;

  setPosition(x: number, y: number, z: number) {
    this.posX = x;
    this.posY = y;
    this.posZ = z;
  }

  setRotation(x: number, y: number, z: number) {
    this.rotX = x;
    this.rotY = y;
    this.rotZ = z;
  }

  getPosition(): [number, number, number] {
    return [this.posX, this.posY, this.posZ]
  }

  getRotation(): [number, number, number] {
    return [this.rotX, this.rotY, this.rotZ]
  }
}

export class MyRoomState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();

}
