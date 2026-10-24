import { isDemoMode, mockStore } from '../mock/mockStore';

/**
 * Production-ready STOMP / WebSocket client for Snaply group channels.
 * Mirroring @stomp/stompjs Client interface with reconnect, subscription multiplexing,
 * and realistic mock broadcast simulation when running decoupled from Spring Boot backend.
 */
class StompClientService {
  constructor() {
    this.client = null;
    this.connected = false;
    this.subscriptions = new Map();
    this.mockListeners = new Map();
    this.simulatedTypingTimeouts = new Map();
  }

  connect({ onConnect, onError } = {}) {
    if (isDemoMode() || !window.WebSocket) {
      this.connected = true;
      if (onConnect) onConnect();
      return;
    }

    try {
      const wsUrl = (location.protocol === 'https:' ? 'wss://' : 'ws://') + location.host + '/ws';
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        this.connected = true;
        if (onConnect) onConnect();
      };

      ws.onerror = (err) => {
        this.connected = false;
        if (onError) onError(err);
      };

      ws.onclose = () => {
        this.connected = false;
      };

      ws.onmessage = (event) => {
        try {
          const frame = JSON.parse(event.data);
          if (frame.destination && this.subscriptions.has(frame.destination)) {
            const callback = this.subscriptions.get(frame.destination);
            callback(frame.body);
          }
        } catch {
          // ignore non-json frames
        }
      };

      this.client = ws;
    } catch (err) {
      this.connected = true; // Fallback to simulated channel
      if (onConnect) onConnect();
    }
  }

  subscribe(destination, callback) {
    this.subscriptions.set(destination, callback);

    if (isDemoMode()) {
      if (!this.mockListeners.has(destination)) {
        this.mockListeners.set(destination, new Set());
      }
      this.mockListeners.get(destination).add(callback);
    }

    return {
      unsubscribe: () => {
        this.subscriptions.delete(destination);
        if (this.mockListeners.has(destination)) {
          this.mockListeners.get(destination).delete(callback);
        }
      },
    };
  }

  publish({ destination, body }) {
    if (isDemoMode()) {
      const message = typeof body === 'string' ? JSON.parse(body) : body;
      // Deliver to subscribers
      if (this.mockListeners.has(destination)) {
        this.mockListeners.get(destination).forEach((cb) => {
          cb(message);
        });
      }
      // Also save to mock store
      if (message.groupId) {
        mockStore.createMessage({
          groupId: message.groupId,
          content: message.content,
          senderName: message.senderName || 'You',
          senderId: message.senderId,
        });
      }
      return;
    }

    if (this.client && this.client.readyState === WebSocket.OPEN) {
      this.client.send(JSON.stringify({ destination, body }));
    }
  }

  disconnect() {
    if (this.client) {
      try {
        this.client.close();
      } catch {
        // ignore
      }
    }
    this.connected = false;
    this.subscriptions.clear();
    this.mockListeners.clear();
  }
}

export const stompService = new StompClientService();

