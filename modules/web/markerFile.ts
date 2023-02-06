import { db } from "../../core";
import Utils from "../../core/utils/utils";
import { Frame } from "../map/entities/frame";

export default class MarkerFile {
  public static async get(world: string) {
    const markerData: MarkerType[] = [];

    // frame markers
    const frames = await db.getEntityManager().find(
      Frame,
      {
        // last 10 minutes
       timestamp: { $gt: new Date(Date.now() - 10 * 60 * 1000) },
        location: {
          world,
        },
      },
      {
        populate: ["user", "location"],
      }
    );

    frames.forEach((frame, index) => {
      if (!markerData.find((marker) => marker.id === `Frames: ${frame.user.username}`)) {
        markerData.push({
          hide: false,
          z_index: 0,
          name: `Frames: ${frame.user.username}`,
          control: true,
          id: `Frames: ${frame.user.username}`,
          order: index + 1,
          timestamp: Date.now(),
          markers: [],
        });
      }

      const markerIndex = markerData.findIndex((marker) => marker.id === `Frames: ${frame.user.username}`);

      if (markerIndex !== -1) {
        // check if first point
        if (markerData[markerIndex].markers.length === 0) {
          markerData[markerIndex].markers.push({
            type: "polyline",
            color: Utils.getColor(frame.user.username),
            points: [],
            tooltip: `Frames: ${frame.user.username}`,
          });
        }

        (markerData[markerIndex].markers[0] as PolylineMarker).points.push({
          x: frame.location.x,
          z: frame.location.z,
        });
      }
    });

    return markerData;
  }
}

interface MarkerType {
  hide: boolean;
  z_index: number;
  name: string;
  control: boolean;
  id: string;
  order: number;
  timestamp: number;
  markers: Marker[];
}

type Marker = IconMarker | PolylineMarker | RectangleMarker;

interface IconMarker {
  type: "icon";
  tooltip_anchor: {
    x: number;
    z: number;
  };
  size: {
    x: number;
    z: number;
  };
  anchor: {
    x: number;
    z: number;
  };
  point: {
    x: number;
    z: number;
  };
  tooltip: string;
  icon: string;
}

interface PolylineMarker {
  type: "polyline";
  points: {
    x: number;
    z: number;
  }[];
  color: string;
  tooltip: string;
}

interface RectangleMarker {
  type: "rectangle";
  popup: string;
  color: string;
  fillOpacity: number;
  tooltip: string;
  opacity: number;
  points: {
    x: number;
    z: number;
  }[];
}
