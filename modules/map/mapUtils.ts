export default class MapUtils {

    public static calcDistance(from: {x: number, z: number}, to: {x: number, z: number}): number {
        return Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.z - from.z, 2));
    }

}