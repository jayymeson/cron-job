export interface SyncCompletedEvent {
  duration: number;
  created: number;
  updated: number;
  strategy: string;
}

export interface SyncErrorEvent {
  error: Error;
  timestamp: Date;
}
