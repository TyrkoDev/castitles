export class Time {
  public static calculateHours(seconds: number): number {
    return Math.trunc(seconds / 3600);
  }

  public static calculateMinutes(seconds: number): number {
    return Math.trunc(seconds / 60);
  }

  public static timeToString(seconds: number): string {
    let timeSpent = Math.round(seconds);
    let hours = this.calculateHours(timeSpent);
    timeSpent = timeSpent % 3600;
    let minutes = this.calculateMinutes(timeSpent);
    timeSpent = timeSpent % 60;


    return this.formatTime(hours) + ':' + this.formatTime(minutes) + ':' + this.formatTime(timeSpent);
  }

  private static formatTime(time: number): string {
    return time > 9 ? time.toString() : '0' + time;
  }
}