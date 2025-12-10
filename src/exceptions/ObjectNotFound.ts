export class ObjectNotFoundException extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "Object Not Found Exception";
    this.status = status;
  }
}
