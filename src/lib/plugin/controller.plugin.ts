import { PluginLib } from "./plugin.lib";
import { PluginRegistry } from "./plugin.types";
import InputPlugin = Phaser.Input.InputPlugin;
import Key = Phaser.Input.Keyboard.Key;

export class ControllerPlugin extends PluginLib {
  public name: string = "ControllerPlugin";
  public id: number = PluginRegistry.ControllerPlugin;
  public input?: InputPlugin;
  public controlKeys?: Map<string, Key>;

  public create() {
    this.input = this.entity.scene.input;
    this.input.mouse.disableContextMenu();

    this.controlKeys = new Map([
      ["W", this.input.keyboard.addKey("W")],
      ["S", this.input.keyboard.addKey("S")],
      ["A", this.input.keyboard.addKey("A")],
      ["D", this.input.keyboard.addKey("D")],
    ]);
  }

  public update = () => {
    const update: Record<string, number> = {};

    if (this.controlKeys?.get("W")?.isDown) {
      update.y = -1;
    }
    if (this.controlKeys?.get("S")?.isDown) {
      update.y = 1;
    }
    if (this.controlKeys?.get("A")?.isDown) {
      update.x = -1;
    }
    if (this.controlKeys?.get("D")?.isDown) {
      update.x = 1;
    }
    if (Object.keys(update).length > 0) {
      this.apply(this.encode(update));
    }
  };

  public encode = ({
    x = 0,
    y = 0,
  }: {
    x?: number;
    y?: number;
  }): ArrayBuffer => {
    return new Uint8Array([x, y]);
  };
}
