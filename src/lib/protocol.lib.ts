import { Message, SocketEventList } from "./socket.types";
import { Scenes } from "../module/scenes";

export class ProtocolLib {
  public decode = async (pkg: ArrayBuffer): Promise<Message | void> => {
    const array = new Uint8Array(pkg);

    switch (array[0]) {
      case SocketEventList.ClientId: {
        return {
          event: SocketEventList.ClientId,
          payload: {
            id: this.stringFromArray(Array.from(array.slice(1))),
          },
        };
      }
      case SocketEventList.SceneConfigs: {
        const scenesString: string = this.stringFromArray(
          Array.from(array.slice(1))
        );
        return {
          event: SocketEventList.SceneConfigs,
          payload: {
            scenes: scenesString
              .slice(1, scenesString.length - 1)
              .split(",")
              .map((name) => ({
                name: name as keyof typeof Scenes,
              })),
          },
        };
      }
      case SocketEventList.InitCharacter: {
        return {
          event: SocketEventList.InitCharacter,
        };
      }
      case SocketEventList.Update: {
        return {
          event: SocketEventList.Update,
          payload: {
            plugin: array[1],
            update: {
              plugin: array[1],
              entity: this.stringFromArray(Array.from(array.slice(2, 38))),
              data: array.slice(38),
            },
          },
        };
      }
      case SocketEventList.NewPlayer: {
        return {
          event: SocketEventList.NewPlayer,
          payload: {
            player: this.stringFromArray(Array.from(array.slice(1))),
          },
        };
      }
      case SocketEventList.NewNPCInit: {
        return {
          event: SocketEventList.NewNPCInit,
          payload: {
            npc: this.stringFromArray(Array.from(array.slice(1))),
          },
        };
      }
      case SocketEventList.PlayerLeave: {
        return {
          event: SocketEventList.PlayerLeave,
          payload: {
            player: this.stringFromArray(Array.from(array.slice(1))),
          },
        };
      }
    }
  };

  public encode = (message: Message): ArrayBuffer | void => {
    switch (message.event) {
      case SocketEventList.SceneConfigs: {
        const pkg = new Uint8Array(1);
        pkg.set([SocketEventList.SceneConfigs]);

        return pkg;
      }
      case SocketEventList.InitCharacter: {
        const eventPkg = new Uint8Array([SocketEventList.InitCharacter]);
        const scenePkg = new Uint8Array(
          this.stringToArray(message.payload?.scene!)
        );

        return new Uint8Array([...eventPkg, ...scenePkg]);
      }
      case SocketEventList.Update: {
        const eventPkg = new Uint8Array([SocketEventList.Update]);
        const pluginPkg = new Uint8Array([message.payload?.plugin!]);

        return new Uint8Array([
          ...eventPkg,
          ...pluginPkg,
          ...message.payload?.update?.data,
        ]);
      }
    }
  };

  public stringFromArray = (pkg: number[]): string =>
    pkg.map((char) => String.fromCharCode(char)).join("");

  public stringToArray = (string: string): number[] =>
    string.split("").map((_, index) => string.charCodeAt(index));
}
