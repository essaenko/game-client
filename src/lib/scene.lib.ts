import { Scene } from "phaser";
import { BaseEntity, Entity } from "./entity/entity.lib";

export class BaseScene extends Scene {
  public entities: Map<string, BaseEntity> = new Map();
  public static readonly key: string = "BaseScene";

  constructor(key: string) {
    super(key);
  }

  public releaseEntity(id: string) {
    if (this.entities.has(id)) {
      const entity = this.entities.get(id);
      entity?.remove();

      this.entities.delete(id);
    }
  }

  public useEntity(entity: BaseEntity) {
    if (!this.entities.has(entity.id)) {
      this.entities.set(entity.id, entity);
      entity.create();
    }
  }

  public update() {
    this.entities.forEach((entity) => {
      entity.update();
    });
  }
}
