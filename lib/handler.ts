import * as http from 'http';
import {Store} from 'rxjs-reselect';
import {State} from './store/index';

/** Handler. */
interface Handler {
    /**
     * Takes care of the request.
     * @param request The http request.
     * @param response The http response.
     * @param next The next middleware.
     * @param registry The registry.
     * @param ngApimockId The ngApimock id.
     */
    handleRequest (request: http.IncomingMessage, response: http.ServerResponse, next: Function,
                   ngApimockId: string): void;
}

export default Handler;
