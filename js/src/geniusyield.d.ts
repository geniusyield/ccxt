import Exchange from './abstract/geniusyield.js';
import type { Market } from './base/types.js';
/**
 * @class geniusyield
 * @augments Exchange
 */
export default class geniusyield extends Exchange {
    describe(): any;
    fetchMarkets(params?: {}): Promise<Market[]>;
}
