import { EnvironmentContext } from '@netlify/blobs';
import { Manifest } from '@netlify/zip-it-and-ship-it';
import { DevEventHandler } from '@netlify/dev-utils';

interface FunctionMatch {
    handle: (req: Request) => Promise<Response>;
    preferStatic: boolean;
}
interface FunctionsHandlerOptions {
    accountId?: string;
    blobsContext?: EnvironmentContext;
    destPath: string;
    config: any;
    debug?: boolean;
    eventHandler?: DevEventHandler;
    frameworksAPIFunctionsPath?: string;
    internalFunctionsPath?: string;
    manifest?: Manifest;
    projectRoot: string;
    siteId?: string;
    settings: any;
    timeouts: any;
    userFunctionsPath?: string;
}
declare class FunctionsHandler {
    private accountID?;
    private registry;
    private scan;
    private siteID?;
    constructor(options: FunctionsHandlerOptions);
    private invoke;
    match(request: Request): Promise<FunctionMatch | undefined>;
}

export { type FunctionMatch, FunctionsHandler };
