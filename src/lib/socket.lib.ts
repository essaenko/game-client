import { Character } from "./entity/character.entity";
import { Player } from "./entity/player.entity";
import { ProtocolLib } from "./protocol.lib";
import { Game } from "phaser";
import {
  SocketConnectionState,
  SocketUpdate,
  Message,
  SocketEventList,
} from "./socket.types";
import { Scenes } from "../module/scenes";
import { BaseScene } from "./scene.lib";

export class SocketLib {
  private connection?: WebSocket;
  private game: Game;
  private network: ProtocolLib;
  private state: SocketConnectionState = SocketConnectionState.Disconnected;
  public id: string | null = null;

  constructor(game: any) {
    this.game = game;
    this.network = new ProtocolLib();
    this.connect();
  }

  private connect = () => {
    if (
      this.state !== SocketConnectionState.Error &&
      this.state !== SocketConnectionState.Connecting
    ) {
      this.connection = new WebSocket(`ws://${location.hostname}:9000/socket`);

      this.connection.onopen = this.onConnectionOpen;
      this.connection.onerror = this.onConnectionError;
      this.connection.onclose = this.onConnectionClose;
      this.connection.onmessage = this.onMessage;
    }
  };

  private onConnectionOpen = () => {
    this.state = SocketConnectionState.Connected;
  };

  private onConnectionError = () => {
    if (this.state === SocketConnectionState.Disconnected)
      this.state = SocketConnectionState.Error;
    alert("Network error");
  };

  private onConnectionClose = () => {
    if (this.state !== SocketConnectionState.Error)
      this.state = SocketConnectionState.Disconnected;
    this.connect();
  };

  private onMessage = async ({ data }: MessageEvent) => {
    try {
      const message = await this.network.decode(
        await (data as Blob).arrayBuffer()
      );

      if (message && this.typeCheckIncomingMessage(message)) {
        this.handleIncomingMessage(message);
      }
    } catch (e) {
      console.warn(`Unexpected data from server: `, e, data);
    }
  };

  private typeCheckIncomingMessage = (message: any): boolean => {
    return "event" in message;
  };

  private handleIncomingMessage = (message: Message) => {
    const { event, payload } = message;
    const { id, scenes, scene, update, player, npc } = payload ?? {};
    switch (event) {
      case SocketEventList.ClientId: {
        if (id) {
          this.id = id;
          this.loadScenes();
        }

        break;
      }
      case SocketEventList.SceneConfigs: {
        if (scenes) {
          scenes.forEach((scene) => {
            if (scene.name in Scenes) {
              this.game.scene.add(scene.name, Scenes[scene.name]);
            }
          });

          this.initCharacter("Game");
        }

        break;
      }
      case SocketEventList.InitCharacter: {
        this.game.scene.start("GameScene");
        const scene = this.game.scene.getScene("GameScene") as BaseScene;
        scene.useEntity(new Player(scene, this));

        break;
      }

      case SocketEventList.Update: {
        if (update?.entity) {
          const scene = this.game.scene.getScene("GameScene") as BaseScene;

          if (scene) {
            const entity = scene.entities.get(update.entity);

            if (entity) {
              entity.sync(update);
            }
          }
        }

        break;
      }

      case SocketEventList.NewPlayer: {
        if (player) {
          const scene = this.game.scene.getScene("GameScene") as BaseScene;

          if (scene) {
            scene.useEntity(new Character(scene, this, player));
          }
        }

        break;
      }

      case SocketEventList.NewNPCInit: {
        if (npc && scene) {
          const scene = this.game.scene.getScenes(true)[0] as BaseScene;

          if (scene) {
            scene.useEntity(new Character(scene, this, npc));
          }
        }

        break;
      }

      case SocketEventList.PlayerLeave: {
        if (player) {
          const scene = this.game.scene.getScenes(true)[0] as BaseScene;

          if (scene) {
            scene.releaseEntity(player);
          }
        }

        break;
      }
    }
  };

  private sendMessage = (message: Message) => {
    if (this.connection && this.state === SocketConnectionState.Connected) {
      this.connection.send(this.network.encode(message)!);
    }
  };

  public loadScenes = () => {
    this.sendMessage({
      event: SocketEventList.SceneConfigs,
    });
  };

  public initCharacter = (scene: string) => {
    this.sendMessage({
      event: SocketEventList.InitCharacter,
      payload: {
        scene,
      },
    });
  };

  public sendUpdate = <T>(update: SocketUpdate<T>) => {
    this.sendMessage({
      event: SocketEventList.Update,
      payload: {
        plugin: update.plugin,
        entity: update.entity,
        update: update,
      },
    });
  };
}
