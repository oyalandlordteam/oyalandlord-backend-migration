import fs from 'fs';
import path from 'path';

export const logger = {
  info: (message: string, meta?: any) => log('INFO', message, meta),
  warn: (message: string, meta?: any) => log('WARN', message, meta),
  error: (message: string, meta?: any) => log('ERROR', message, meta),
  debug: (message: string, meta?: any) => log('DEBUG', message, meta),
};

function log(level: string, message: string, meta?: any) {
  const timestamp = new Date().toISOString();
  const metaString = meta ? ` | Meta: ${JSON.stringify(meta)}` : '';
  const logEntry = `[${timestamp}] [${level}] ${message}${metaString}\n`;

  console.log(logEntry.trim());

  try {
    const logDir = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    
    const logFile = path.join(logDir, 'app.log');
    fs.appendFileSync(logFile, logEntry);
  } catch (error) {
    console.error('Failed to write to log file:', error);
  }
}
