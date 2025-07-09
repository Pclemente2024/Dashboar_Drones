import os from 'os';
import { logger } from './logger.js';

export class HealthMonitor {
  constructor() {
    this.interval = 30000; // 30 segundos
    this.monitorInterval = null;
  }

  start() {
    this.monitorInterval = setInterval(() => {
      this.logSystemHealth();
    }, this.interval);
    logger.info('Health monitor started');
  }

  logSystemHealth() {
    const stats = {
      load: os.loadavg()[0].toFixed(2),
      freeMem: `${(os.freemem() / 1024 / 1024).toFixed(2)} MB`,
      uptime: `${(os.uptime() / 60 / 60).toFixed(2)} hours`
    };

    logger.debug('System health:', stats);
  }

  stop() {
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
      logger.info('Health monitor stopped');
    }
  }
}
