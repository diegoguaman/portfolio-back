export class ResponseDto<T> {
  constructor(partial: Partial<ResponseDto<T>>) {
    Object.assign(this, partial);
  }
  data!: T;
  timestamp!: Date;
}
