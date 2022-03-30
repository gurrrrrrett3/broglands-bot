export interface Block {
    block: string;
    x: number;
    z: number;
}

export default class Blocks {
    public static readonly BLOCKS = [
        {
          block: "Note Block",
          x: 5934,
          z: 1585,
        },
          {
          block: "White Wool",
          x: 5933,
          z: 1585,
          },
          {
          block: "Gold Block",
          x: 5932,
          z: 1585,
          },
          {
          block: "Crafting Table",
          x: 5934,
          z: 1584,
          },
          {
          block: "Glowstone",
          x: 5933,
          z: 1584,
          },
          {
          block: "Diamond Block",
          x: 5932,
          z: 1584,
          },
          {
          block: "Emerald Block",
          x: 5934,
          z: 1583,
          },
          {
          block: "Dirt",
          x: 5933,
          z: 1583,
          },
          {
          block: "Sand",
          x: 5932,
          z: 1583,
          }
      ]

      public static pick() {
        return this.BLOCKS[Math.floor(Math.random() * this.BLOCKS.length)];
      }
}