// 5, 30, 2 hours, 6 hours, 12 hours, never.

type TimerDurations = 5 | 30 | 120 | 360 | 720; // Allowed duration in minutes.

class LockerTimer {
  private duration: TimerDurations | null = null;

  constructor(duration: number) {
    this.validateDuration(duration);
  }

  private validateDuration(duration: number) {
    const validDurations: TimerDurations[] = [5, 30, 120, 360, 720];
    if (!validDurations.includes(duration as TimerDurations)) {
      throw new Error(
        `Invalid Timer duration. Valid durations are ${validDurations.join(', ')} minutes.`
      );
    }
    this.duration = duration as TimerDurations;
  }

  public getDuration(): number {
    return this?.duration as number;
  }

  public setDuration(duration: number) {
    this.validateDuration(duration);
  }
}

export default new LockerTimer(5);
