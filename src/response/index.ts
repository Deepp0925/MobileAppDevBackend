import { IBaseResponseInput } from "../types";

export class Response<T> {
  readonly data: T;

  constructor(input: IBaseResponseInput<T>) {
    this.data = input.data;
  }

  get response() {
    return {
      data: this.data,
      error: false,
    };
  }
}
