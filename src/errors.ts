export class UnexpectedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnexpectedError";
  }
}

export class UnexpectedValidationError extends UnexpectedError {
  constructor() {
    super(
      "Unexpected validation error occurred. Please report this issue via one of the contact methods.",
    );
  }
}
