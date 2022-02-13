import { PluginLib } from "./plugin.lib";
import { SocketUpdate } from "../socket.types";
import { PluginRegistry } from "./plugin.types";
import { BytesToInt } from "../binary.lib";

export class PositionPlugin extends PluginLib {
  public name: string = "PositionPlugin";
  public id: number = PluginRegistry.PositionPlugin;

  public x: number = 0;
  public y: number = 0;

  public sync = (update: SocketUpdate<Uint8Array>) => {
    const data = this.decode(update.data);

    if (data.x) {
      this.x = data.x;
    }

    if (data.y) {
      this.y = data.y;
    }
  };

  public decode = (buffer: Uint8Array): { x?: number; y?: number } => {
    return {
      x: BytesToInt(buffer.slice(0, 2), 2),
      y: BytesToInt(buffer.slice(2), 2),
    };
  };
}
