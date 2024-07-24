import Exchange from './abstract/geniusyield.js';
import type { Market, Str, MarketInterface } from './base/types.js';
/**
 * @class geniusyield
 * @augments Exchange
 */
export default class geniusyield extends Exchange {
    safeMarket(marketId?: Str, market?: Market, delimiter?: Str, marketType?: Str): MarketInterface;
    describe(): any;
    fetchMarkets(params?: {}): Promise<Market[]>;
    sign(path: any, api?: string, method?: string, params?: {}, headers?: any, body?: any): {
        url: string;
        method: string;
        body: any;
        headers: any;
    };
}
