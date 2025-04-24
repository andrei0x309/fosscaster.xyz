
const WS_URL = 'wss://ws.warpcast.com/stream';

class WcWebSocket {
    private socket: WebSocket | undefined;
    private url: string;
    private reconnectTimeout: number;
    private reconnectAttempts: number;
    private reconnectAttemptsLeft: number;
    private onMessage: (message: string) => void;
    private onOpen: () => void;
    private onClose: () => void;
    private onError: (error: any) => void;


    constructor({
        url,
        reconnectTimeout = 15000,
        reconnectAttempts = 2,
        onMessage,
        onOpen,
    }: {
        url: string;
        reconnectTimeout: number;
        reconnectAttempts: number;
        onMessage: (message: string) => void;
        onOpen: () => void;
    }) {
        this.url = url;
        this.reconnectTimeout = reconnectTimeout;
        this.reconnectAttempts = reconnectAttempts;
        this.reconnectAttemptsLeft = reconnectAttempts;
        this.onMessage = onMessage;
        this.onOpen = onOpen
        this.onClose = () => {};
        this.onError = (error: any) => {
            console.error('WebSocket error', error);
        };
        this.connect();
    }

    public connect() {
        this.socket = new WebSocket(this.url, 'wss');
        this.socket.onopen = () => {
            this.onOpen();
        };
        this.socket.onmessage = (event) => {
            this.onMessage(event.data);
        };
        this.socket.onclose = () => {
            this.onClose();
            if (this.reconnectAttemptsLeft > 0) {
                this.reconnectAttemptsLeft--;
                setTimeout(() => this.connect(), this.reconnectTimeout);
            }
        };
        this.socket.onerror = (error) => {
            this.onError(error);
        };
    }

    public send(message: string) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(message);
        }
    }

    public setOnMessage(callback: (message: string) => void) {
        this.onMessage = callback;
    }

    public setOnOpen(callback: () => void) {
        this.onOpen = callback;
    }

    public setOClose(callback: () => void) {
        this.onClose = callback;
    }

    public setOnonError(callback: (error: Error) => void) {
        this.onError = callback;
    }

    public close() {
        if (this.socket) {
            this.socket.close();
        }
    }

    public getState() {
        if (this.socket) {
            return this.socket.readyState;
        }
        return WebSocket.CLOSED;
    }

    public getUrl() {
        return this.url;
    }

    public getReconnectTimeout() {
        return this.reconnectTimeout;
    }
    public getReconnectAttempts() {
        return this.reconnectAttempts;
    }

    public getReconnectAttemptsLeft() {
        return this.reconnectAttemptsLeft;
    }
}

export const sendConvoRead = ({
    socket,
    conversationId
}: {
    socket: WcWebSocket;
    conversationId: string;
}) => {
    const converSationMsg = {
        "messageType": "direct-cast-read",
        "payload": {
            "conversationId": conversationId
        },
        "data": conversationId
    }
    socket.send(JSON.stringify(converSationMsg));

}

export const getNewAuthentificatedChat = async ({
    token,
    conversationId,
    onMessage,
}: {
    token: string;
    conversationId: string;
    onMessage: (message: string) => void;
}) => {
    
    let openPromise: () => void = () => {};
    const waitForSocket = new Promise<void>((resolve) => {
        openPromise = resolve;
    });

    const socket = new WcWebSocket({
        url: WS_URL,
        reconnectTimeout: 15000,
        reconnectAttempts: 2,
        onMessage,
        onOpen: () => {
           openPromise();
    
        },
    });

    await waitForSocket;
    
    const authMsg = {"messageType":"authenticate","data":`Bearer ${token}`}

    socket.send(JSON.stringify(authMsg));

    await new Promise((resolve) => setTimeout(resolve, 360));

    sendConvoRead({
        socket,
        conversationId
    })

    return socket;
}

