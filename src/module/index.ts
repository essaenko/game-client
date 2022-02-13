import {MyGame} from "./game";

export const initGame = (domNode: string) => {
  new MyGame(domNode)
}