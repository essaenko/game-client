import { PluginLib } from "./plugin.lib";
import { PluginRegistry } from "./plugin.types";
import { SocketUpdate } from "../socket.types";
import { BytesToInt } from "../binary.lib";

export class SizePlugin extends PluginLib {
  public name: string = "SizePlugin";
  public id: number = PluginRegistry.SizePlugin;

  public width: number = 0;
  public height: number = 0;

  public sync = (update: SocketUpdate<Uint8Array>) => {
    const data = this.decode(update.data);

    this.width = data.width;
    this.height = data.height;
  };

  public decode = (buffer: Uint8Array): { width: number; height: number } => {
    return {
      width: BytesToInt(buffer.slice(0, 2), 2),
      height: BytesToInt(buffer.slice(2), 2),
    };
  };
}
