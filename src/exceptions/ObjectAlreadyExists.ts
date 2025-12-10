export class ObjectAlreadyExistsException extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "Object Already Exists Exception";
    this.status = status;
  }
}
