export type MessageData = PingMessageData | AuthMessageData | PlayerPositionMessageData;

export interface PingMessageData {
    type: "ping"
    timestamp: number;
};

export interface AuthMessageData  {
    type: "auth"
    token: string;
}

export interface PlayerPositionMessageData {
    type: "playerPosition"
    name: string;
    x: number;
    z: number;
}

export default class SocketMessage {
    public type: string;
    public data: MessageData;

    constructor(data: MessageData) {
        this.type = data.type;
        this.data = data;
    }

    public str(): string {
        return JSON.stringify(this);
    }
}