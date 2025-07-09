import SerialPort from 'serialport';
import Readline from '@serialport/parser-readline';
import { logger } from './logger.js';
import { processIridiumMessage } from './messageProcessor.js';

export class IridiumModem {
  constructor(port = '/dev/ttyUSB0', baudRate = 19200) {
    this.port = port;
    this.baudRate = baudRate;
    this.connection = null;
    this.isConnected = false;
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.connection = new SerialPort(this.port, {
        baudRate: this.baudRate,
        autoOpen: false
      });

      const parser = this.connection.pipe(new Readline({ delimiter: '\r\n' }));

      this.connection.open((err) => {
        if (err) {
          logger.error(`Failed to open Iridium connection: ${err.message}`);
          return reject(err);
        }

        this.isConnected = true;
        logger.info(`Iridium modem connected on ${this.port}`);

        parser.on('data', (data) => {
          logger.debug(`Raw Iridium data: ${data}`);
          this.handleData(data);
        });

        this.connection.on('close', () => {
          this.isConnected = false;
          logger.warn('Iridium connection closed');
        });

        this.connection.on('error', (err) => {
          logger.error(`Iridium error: ${err.message}`);
        });

        resolve();
      });
    });
  }

  async handleData(rawData) {
    try {
      const message = await processIridiumMessage(rawData);
      if (message) {
        logger.info(`Valid message from ${message.serial_number}`);
        // El droneManager se encargará del procesamiento posterior
      }
    } catch (error) {
      logger.warn(`Invalid message: ${error.message}`);
    }
  }

  async close() {
    return new Promise((resolve) => {
      if (this.connection && this.isConnected) {
        this.connection.close(() => {
          this.isConnected = false;
          logger.info('Iridium modem disconnected');
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
}
