
export const Resources: Record<string, Record<string, Promise<any>>> = {
  map: {
    Game: import('./Game.json')
  },
  tileset: {
    Grass: import('./tileset/main/TX Tileset Grass.png')
  }
}