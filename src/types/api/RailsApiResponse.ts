interface RailsApiResponse<T> {
  Success: boolean;
  Code: number;
  Message: string | null;
  Data: T;
  Fallback?: true;
}

export default RailsApiResponse;
