export function log(...args: any[]): void {
  console.log(new Date().toISOString(), '[INFO]', ...args);
}

export function error(...args: any[]): void {
  console.error(new Date().toISOString(), '[ERROR]', ...args);
}

export function warn(...args: any[]): void {
  console.warn(new Date().toISOString(), '[WARN]', ...args);
}

export function debug(...args: any[]): void {
  if (process.env.DEBUG) {
    console.debug(new Date().toISOString(), '[DEBUG]', ...args);
  }
}