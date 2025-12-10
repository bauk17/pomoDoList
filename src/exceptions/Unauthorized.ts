export class UnauthorizedException extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "Unauthorized Exception";
    this.status = status;
  }
}
