import { BaseEntity } from "./entity.lib";
import { SocketLib } from "../socket.lib";
import { ControllerPlugin } from "../plugin/controller.plugin";
import { SizePlugin } from "../plugin/size.plugin";
import { BaseScene } from "../scene.lib";
import Rectangle = Phaser.GameObjects.Rectangle;
import { PositionPlugin } from "../plugin/position.plugin";
import { PluginRegistry } from "../plugin/plugin.types";

export class Player extends BaseEntity {
  constructor(scene: BaseScene, client: SocketLib) {
    super(scene, client, client.id!);

    this.usePlugin(new ControllerPlugin(this));
    this.usePlugin(new SizePlugin(this));
  }

  public create() {
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
