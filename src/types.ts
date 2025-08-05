import { IncomingMessage, ServerResponse } from 'http';

export interface CheetahRequest extends IncomingMessage {
  query: Record<string, string | string[]>;
  params?: Record<string, string>;
}

export interface CheetahResponse extends ServerResponse {
  json: (body: any) => void;
  status: (code: number) => CheetahResponse;
}

export type NextFunction = () => void;

export type Middleware = (req: CheetahRequest, res: CheetahResponse, next: NextFunction) => void;
export type Handler = (req: CheetahRequest, res: CheetahResponse) => void;
export interface ServerOptions {
  cluster?: boolean;
}
