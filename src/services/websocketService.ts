export class WebSocketService {
  private ws: WebSocket | null = null;

  connect() {
    const url = process.env.NEXT_PUBLIC_WS_URL + 'notificaciones/';
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      console.log('WebSocket connected to', url);
    };

    this.ws.onmessage = (event) => {
      console.log('Message received:', event.data);
    };

    this.ws.onclose = () => {
      console.log('WebSocket closed');
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }

  sendMessage(message: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(message);
    }
  }
}
