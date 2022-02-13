import { PluginLib } from "./plugin.lib";
import { PositionPlugin } from "./position.plugin";
import { PluginRegistry } from "./plugin.types";
import InputPlugin = Phaser.Input.InputPlugin;
import { SizePlugin } from "./size.plugin";

type Coordinates = {
  x: number;
  y: number;
};

class Vector2 {
  public x: number;
  public y: number;

  constructor(pointer: Coordinates, position: Coordinates) {
    const vectorX =
      pointer.x > position.x
        ? pointer.x - position.x
        : pointer.x < position.x
        ? position.x - pointer.x
        : 0;
    const vectorY =
      pointer.y > position.y
        ? pointer.y - position.y
        : pointer.y < position.y
        ? position.y - pointer.y
        : 0;

    if (vectorY === 0 || vectorX === 0) {
      this.x = vectorX === 0 ? 0 : 1;
      this.y = vectorY === 0 ? 0 : 1;
    }

    if (vectorX > vectorY) {
      this.x = 100;
      this.y = Math.round((vectorY / vectorX) * 100);
    } else {
      this.x = Math.round((vectorX / vectorY) * 100);
      this.y = 1;
    }
  }
}

export class ControllerPlugin extends PluginLib {
  public name: string = "ControllerPlugin";
  public id: number = PluginRegistry.ControllerPlugin;
  public input?: InputPlugin;

  public create() {
    this.input = this.entity.scene.input;
    this.input.mouse.disableContextMenu();
  }

  public update = () => {
    const update: Record<string, number> = {};
    const position = this.entity.getPlugin<PositionPlugin>(
      PluginRegistry.PositionPlugin
    );
    const size = this.entity.getPlugin<SizePlugin>(PluginRegistry.SizePlugin);
    const pointer = this.input?.mousePointer;

    if (pointer?.isDown && position && size) {
      const pointerX = pointer.x - Math.ceil(size.width / 2);
      const pointerY = pointer.y - Math.ceil(size.height / 2);
      const vector = new Vector2(
        {
          x: pointerX,
          y: pointerY,
        },
        position
      );

      if (pointerX !== position.x) {
        update.x = pointerX > position.x ? vector.x : -vector.x;
      }

      if (pointerY !== position.y) {
        update.y = pointerY > position.y ? vector.y : -vector.y;
      }
    }

    if (Object.keys(update).length > 0) {
      console.log(update, this.encode(update));
      this.apply(this.encode(update));
      // this.entity
      //   .getPlugin<PositionPlugin>(PluginRegistry.PositionPlugin)
      //   ?.apply(this.encode(update));
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
