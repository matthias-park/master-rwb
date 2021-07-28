import { createLogger, transports, format } from 'winston';
import DailyRotationFile from 'winston-daily-rotate-file';
import { DEVELOPMENT } from './constants';

const customLoggerFormat = format.printf(
  ({ level, message, timestamp, durationMs }) => {
    let msg = `${timestamp} ${level}: ${message} `;
    if (durationMs) {
      msg += `duration=${durationMs}ms `;
    }
    return msg;
  },
);

const logger = createLogger({
  level: 'info',
  format: format.combine(format.timestamp(), customLoggerFormat),
  transports: [new transports.Console()],
});

if (!DEVELOPMENT) {
  logger.add(
    new DailyRotationFile({
      filename: 'log/%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '120m',
      maxFiles: '7d',
    }),
  );
}

export default logger;
