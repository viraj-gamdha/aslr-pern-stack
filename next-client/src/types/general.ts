export interface ApiResult<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export interface FetchError extends Error {
  status?: number;
  response?: Response;
  data?: ApiResult<{}>;
}

export type StateSetter<T> = React.Dispatch<React.SetStateAction<T>>;
