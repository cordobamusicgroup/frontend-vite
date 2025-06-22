// SessionTimer.ts
// Lógica desacoplada de React para manejar el timeout y countdown de sesión usando eventBus (mitt)
import { eventBus } from '../../../eventBus';
import { jwtDecode } from 'jwt-decode';

interface JWTPayload {
  exp: number;
}

export class SessionTimer {
  private token: string | null = null;
  private countdownSeconds: number;
  private timeout: ReturnType<typeof setTimeout> | null = null;
  private interval: ReturnType<typeof setInterval> | null = null;
  private running = false;

  constructor(countdownSeconds = 30) {
    this.countdownSeconds = countdownSeconds;
    eventBus.on('session:restart', this.restart.bind(this));
    // Eliminado: eventBus.on('session:closed', this.close.bind(this));
  }

  public setToken(token: string | null) {
    this.token = token;
    this.restart();
  }

  private startTimeout() {
    this.clearTimers();
    if (!this.token) return;
    try {
      const decoded = jwtDecode<JWTPayload>(this.token);
      const now = Date.now();
      const exp = decoded.exp * 1000;
      
      
      
      const warnAt = exp - this.countdownSeconds * 1000;
      const delay = warnAt - now;
      if (delay <= 0) {
        this.startCountdown();
      } else {
        this.timeout = setTimeout(() => this.startCountdown(), delay);
      }
    } catch {
      // Token inválido
    }
  }

  private startCountdown() {
    if (this.running) return;
    this.running = true;
    let seconds = this.countdownSeconds;
    eventBus.emit('session:expiring', { seconds });
    this.interval = setInterval(() => {
      seconds--;
      eventBus.emit('session:tick', { seconds });
      if (seconds <= 0) {
        this.clearTimers();
        eventBus.emit('session:expired');
      }
    }, 1000);
  }

  public restart() {
    this.running = false;
    this.clearTimers();
    this.startTimeout();
  }

  public close() {
    this.running = false;
    this.clearTimers();
    // NO emitir eventBus.emit('session:closed') aquí para evitar recursión infinita
  }

  private clearTimers() {
    if (this.timeout) clearTimeout(this.timeout);
    if (this.interval) clearInterval(this.interval);
    this.timeout = null;
    this.interval = null;
  }
}

// Instancia global (puedes importar y usar en el AuthProvider o donde manejes el token)
export const sessionTimer = new SessionTimer(30);
