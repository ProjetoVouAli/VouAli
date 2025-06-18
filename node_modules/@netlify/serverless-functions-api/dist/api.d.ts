import { Context } from './context.js';
import './fingerprint.js';
export declare const REQUEST_SIGNAL_BUFFER = 20;
export type V2Function = {
    default: (req: Request, context: Context) => Promise<Response | void>;
};
export declare const getLambdaHandler: (funcOrFuncPath: V2Function | string) => import("./lambda/handler.js").LambdaHandler;
