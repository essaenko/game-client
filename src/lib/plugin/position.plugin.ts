import { PluginLib } from "./plugin.lib";
import { SocketUpdate } from "../socket.types";
import { PluginRegistry } from "./plugin.types";
import { BytesToFloat } from "../binary.lib";

export class PositionPlugin extends PluginLib {
  public name: string = "PositionPlugin";
  public id: number = PluginRegistry.PositionPlugin;

  public x: number = 0;
  public y: number = 0;

  public sync = (update: SocketUpdate<ArrayBuffer>) => {
    const data = this.decode(new Float64Array(update.data));

    if (data.x) {
      this.x = data.x;
    }

    if (data.y) {
      this.y = data.y;
    }
  };

  public decode = (buffer: Float64Array): { x?: number; y?: number } => {
    return {
      x: BytesToFloat(buffer.slice(0, 4)),
      y: BytesToFloat(buffer.slice(4)),
    };
  };
}
