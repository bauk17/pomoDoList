export class MissingFieldError extends Error {
  field: string;

  constructor(field: string) {
    super(`The following field is missing: ${field}`);
    this.name = "MissingFieldError";
    this.field = field;
  }
}
