import { Game, AUTO } from "phaser";
import { SocketLib } from "../lib/socket.lib";

export class MyGame {
  private readonly game: Game;
  private socket: SocketLib;

  constructor(domNode: string) {
    this.game = new Game({
      width: window.innerWidth,
      height: window.innerHeight,
      type: AUTO,
      parent: domNode,
    });

    this.socket = new SocketLib(this.game);
  }
}
