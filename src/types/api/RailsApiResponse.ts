interface RailsApiResponse<T> {
  Success: boolean;
  Code: number;
  Message: string | null;
  Data: T;
  Fallback?: true;
  Unauthorized?: boolean;
}

export default RailsApiResponse;
