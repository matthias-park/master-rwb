interface GetToken {
  Success: boolean;
  Code: number;
  Message: string | null;
  Data: string;
}

export default GetToken;
