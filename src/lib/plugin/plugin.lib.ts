import { Entity } from "../entity/entity.lib";
import { SocketUpdate } from "../socket.types";

export class PluginLib {
  public name: string = "";
  public id: number = -1;
  public entity: Entity;

  constructor(entity: Entity) {
    this.entity = entity;

    this.create();
  }

  public create(): void {}

  public update(): void {}

  public sync = (update: SocketUpdate<any>) => {};

  public encode: ((payload?: any) => ArrayBuffer) | undefined;

  public apply = (data: SocketUpdate<ArrayBuffer>["data"]) => {
    this.entity.client.sendUpdate<ArrayBuffer>({
      plugin: this.id,
      entity: this.entity.id,
      data,
    });
  };
}
