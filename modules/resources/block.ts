export interface Block {
    block: string;
    x: number;
    z: number;
}

export default class Blocks {
    public static readonly BLOCKS = [
        {
          block: "Note Block",
          x: 5912,
          z: 1546,
        },
          {
          block: "Cobblestone",
          x: 5913,
          z: 1547,
          },
          {
          block: "Gold Block",
          x: 5914,
          z: 1547,
          },
          {
          block: "Crafting Table",
          x: 5912,
          z: 1547,
          },
          {
          block: "Glowstone",
          x: 5913,
          z: 1546,
          },
          {
          block: "Diamond Block",
          x: 5914,
          z: 1546,
          },
          {
          block: "Emerald Block",
          x: 5912,
          z: 1545,
          },
          {
          block: "Dirt",
          x: 5913,
          z: 1545,
          },
          {
          block: "Sand",
          x: 5914,
          z: 1545,
          }
      ]

      public static pick() {
        return this.BLOCKS[Math.floor(Math.random() * this.BLOCKS.length)];
      }
}