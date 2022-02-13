import { BaseEntity } from "./entity.lib";
import { SocketLib } from "../socket.lib";
import { SizePlugin } from "../plugin/size.plugin";
import { BaseScene } from "../scene.lib";
import { PositionPlugin } from "../plugin/position.plugin";
import { PluginRegistry } from "../plugin/plugin.types";

export class Character extends BaseEntity {
  constructor(scene: BaseScene, client: SocketLib, id: string) {
    super(scene, client, id);

    this.usePlugin(new SizePlugin(this));
  }

  public create() {
    console.log("Creating player instance");
    const position = this.getPlugin<PositionPlugin>(
      PluginRegistry.PositionPlugin
    );
    const size = this.getPlugin<SizePlugin>(PluginRegistry.SizePlugin);
    if (position && size) {
      this.object = this.scene.add.rectangle(
        position.x,
        position.y,
        size.width,
        size.height,
        0xffffff
      );
    }
  }
}
