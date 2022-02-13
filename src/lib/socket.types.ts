import { Scenes } from "../module/scenes";

export interface SceneConfig {
  name: keyof typeof Scenes;
}

export enum SocketEventList {
  ClientId,
  SceneConfigs,
  InitCharacter,
  Update,
  NewPlayer,
  NewNPCInit,
  PlayerLeave,
}

export interface SocketUpdate<T> {
  plugin: number;
  entity: string;
  data: T;
}

export type MessagePayload = {
  id?: string | null;
  scenes?: SceneConfig[] | null;
  scene?: string | null;
  plugin?: number | null;
  updates?: Record<string, string> | null;
  update?: SocketUpdate<any> | null;
  player?: string | null;
  npc?: string | null;
  entity?: string | null;
};

export type Message = {
  event: SocketEventList;
  payload?: MessagePayload;
};

export enum SocketConnectionState {
  Disconnected,
  Connecting,
  Connected,
  Error,
}
