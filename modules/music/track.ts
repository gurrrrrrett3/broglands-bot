import { createAudioResource, demuxProbe } from "@discordjs/voice";
import ytdl from "ytdl-core";

export default class Track {
  constructor(public url: string) {}

  async get() {
    return demuxProbe(
      ytdl(this.url, {
        quality: "lowestaudio",
        filter: "audioonly",
      })
    ).then((probe) => {
      const res = createAudioResource(probe.stream, {
        inputType: probe.type,
        inlineVolume: true
      })
      res.volume?.setVolume(0.5)
      return res
    });
  }
}
