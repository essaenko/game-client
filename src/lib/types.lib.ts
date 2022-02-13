export interface TileMap {
  height: number;
  width: number;
  version: number;
  infinite: boolean;
  layers: TileMapLayer[];
  nextlayerid: number;
  nextobjectid: number;
  orientation: string;
  renderorder: string;
  tiledversion: string;
  tileheight: number;
  tilewidth: number;
  type: string;
  tilesets: TileSet[]
}

export interface TileMapLayer {
  data: number[];
  height: number;
  id: number;
  name: string;
  opacity: number;
  type: string;
  visible: boolean;
  width: number;
  x: number;
  y: number;
}

export interface TileSet {
  columns: number;
  firstgid: number;
  image: string;
  imageheight: number;
  imagewidth: number;
  margin: number;
  name: string;
  spacing: number;
  tilecount: number;
  tileheight: number;
  tilewidth: number;
  tiles: {
    id: number;
    properties: {
      name: string;
      type: string;
      value: any;
    }[];
  }[];
}