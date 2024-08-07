import { Room, Client } from "@colyseus/core";
import { MyRoomState, Player } from "./schema/MyRoomState";

export class MyRoom extends Room<MyRoomState> {
  maxClients = 4;

  onCreate(options: any) {
    this.setState(new MyRoomState());

    this.onMessage("updatePosition", (client, message) => {
      const player = this.state.players.get(client.sessionId);
      if (player) {
        player.setPosition(message._x, message._y, message._z);
        // console.log("pos", message); 
        console.log("Pos", client.sessionId, player.getPosition());
      }
    });

    this.onMessage("updateRotation", (client, message) => {
      const player = this.state.players.get(client.sessionId);
      if (player) {
        player.setRotation(message._x, message._y, message._z);
        // console.log("rot", message);
        console.log("Rot", client.sessionId, player.getRotation());
      }
    });

    this.onMessage("*", (client, type, message) => {
      console.log(client.sessionId, "sent", type, message);
    });

  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined!");
    const newPlayer = new Player();
    newPlayer.id = client.sessionId;
    newPlayer.setPosition(0, 5, 0);
    newPlayer.setRotation(0, 0, 0);

    this.state.players.set(client.sessionId, newPlayer);
    const addedPlayer = this.state.players.get(client.sessionId);
    console.log("Player ID:", addedPlayer.id);
    console.log("Position:", addedPlayer.getPosition());
    console.log("Rotation:", addedPlayer.getRotation());

    console.log(addedPlayer.posX);

    console.log("Player List")
    this.state.players.forEach((i) => {
      console.log(i.id)
    });
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
    this.state.players.delete(client.sessionId);
    console.log("Player List")
    this.state.players.forEach((i) => {
      console.log(i.id)
    });

  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
