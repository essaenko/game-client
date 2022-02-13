import { PluginLib } from "../plugin/plugin.lib";
import { PositionPlugin } from "../plugin/position.plugin";
import { SocketUpdate } from "../socket.types";
import { SocketLib } from "../socket.lib";
import { PluginRegistry } from "../plugin/plugin.types";
import { BaseScene } from "../scene.lib";
import { SizePlugin } from "../plugin/size.plugin";
import GameObject = Phaser.GameObjects.GameObject;
import Shape = Phaser.GameObjects.Shape;

export class Entity {
  private plugins: Map<number, PluginLib> = new Map([
    [PluginRegistry.PositionPlugin, new PositionPlugin(this)],
  ]);
  public client: SocketLib;
  public id: string;
  public scene: BaseScene;

  constructor(scene: BaseScene, client: SocketLib, id: string) {
    this.client = client;
    this.id = id;
    this.scene = scene;
  }

  public usePlugin(plugin: PluginLib) {
    if (!this.plugins.has(plugin.id)) {
      this.plugins.set(plugin.id, plugin);
    }
  }

  public getPlugin<T extends PluginLib>(plugin: number): T | void {
    return this.plugins.get(plugin) as unknown as T;
  }

  public create(): void {}

  public update() {
    this.plugins.forEach((plugin) => {
      plugin.update();
    });
  }

  public sync(update: SocketUpdate<any>) {
    const plugin: PluginLib | void = this.plugins.get(update.plugin);

    if (plugin) {
      plugin.sync(update);
    }
  }
}

export class BaseEntity extends Entity {
  public object?: Shape;

  public update() {
    super.update();

    const position = this.getPlugin<PositionPlugin>(
      PluginRegistry.PositionPlugin
    );
    const size = this.getPlugin<SizePlugin>(PluginRegistry.SizePlugin);

    if (position && size && this.object) {
      this.object.setPosition(position.x, position.y);
      this.object.width = size.width;
      this.object.height = size.height;
    }
  }

  public remove() {
    this.object?.destroy();
  }
}
