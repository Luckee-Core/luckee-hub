export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type ApiResult<T> = ApiResponse<T> & { httpStatus: number };
