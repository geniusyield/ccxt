
// ---------------------------------------------------------------------------

import Exchange from './abstract/geniusyield.js';
import { TICK_SIZE, PAD_WITH_ZERO } from './base/functions/number.js';
import { InvalidOrder, InsufficientFunds, ExchangeNotAvailable, DDoSProtection, BadRequest, InvalidAddress, AuthenticationError } from './base/errors.js';
import type { Market, Str, MarketInterface } from './base/types.js';

// ---------------------------------------------------------------------------

/**
 * @class geniusyield
 * @augments Exchange
 */
export default class geniusyield extends Exchange {
    safeMarket (marketId: Str = undefined, market: Market = undefined, delimiter: Str = undefined, marketType: Str = undefined): MarketInterface {
        const isOption = (marketId !== undefined) && ((marketId.indexOf ('-C') > -1) || (marketId.indexOf ('-P') > -1));
        if (isOption && !(marketId in this.markets_by_id)) {
            // handle expired option contracts
            return this.createExpiredOptionMarket (marketId);
        }
        return super.safeMarket (marketId, market, delimiter, marketType);
    }

    describe () {
        return this.deepExtend (super.describe (), {
            'id': 'geniusyield',
            'name': 'Genius Yield',
            'countries': [ 'CH' ],
            'rateLimit': 1000,
            'version': 'v0',
            'pro': false,
            'dex': true,
            'certified': false,
            'requiresWeb3': true,
            'has': {
                'CORS': undefined,
                'spot': true,
                'margin': false,
                'swap': false,
                'future': false,
                'option': false,
                'addMargin': false,
                'cancelAllOrders': false,
                'cancelOrder': true,
                'cancelOrders': false,
                'closeAllPositions': false,
                'closePosition': false,
                'createDepositAddress': false,
                'createOrder': true,
                'createReduceOnlyOrder': false,
                'createStopLimitOrder': false,
                'createStopMarketOrder': false,
                'createStopOrder': false,
                'fetchBalance': true,
                'fetchBorrowRateHistories': false,
                'fetchBorrowRateHistory': false,
                'fetchClosedOrders': false,
                'fetchCrossBorrowRate': false,
                'fetchCrossBorrowRates': false,
                'fetchCurrencies': false,
                'fetchDeposit': false,
                'fetchDepositAddress': false,
                'fetchDepositAddresses': false,
                'fetchDepositAddressesByNetwork': false,
                'fetchDeposits': false,
                'fetchFundingHistory': false,
                'fetchFundingRate': false,
                'fetchFundingRateHistory': false,
                'fetchFundingRates': false,
                'fetchIndexOHLCV': false,
                'fetchIsolatedBorrowRate': false,
                'fetchIsolatedBorrowRates': false,
                'fetchLeverage': false,
                'fetchLeverageTiers': false,
                'fetchMarginMode': false,
                'fetchMarkets': true,
                'fetchMarkOHLCV': false,
                'fetchMyTrades': false,
                'fetchOHLCV': false,
                'fetchOpenInterestHistory': false,
                'fetchOpenOrders': false,
                'fetchOrder': false,
                'fetchOrderBook': false,
                'fetchOrders': true,
                'fetchPosition': false,
                'fetchPositionHistory': false,
                'fetchPositionMode': false,
                'fetchPositions': false,
                'fetchPositionsForSymbol': false,
                'fetchPositionsHistory': false,
                'fetchPositionsRisk': false,
                'fetchPremiumIndexOHLCV': false,
                'fetchStatus': false,
                'fetchTicker': false,
                'fetchTickers': false,
                'fetchTime': false,
                'fetchTrades': false,
                'fetchTradingFee': false,
                'fetchTradingFees': false,
                'fetchTransactions': false,
                'fetchWithdrawal': false,
                'fetchWithdrawals': false,
                'reduceMargin': false,
                'sandbox': false,
                'setLeverage': false,
                'setMarginMode': false,
                'setPositionMode': false,
                'transfer': false,
                'withdraw': false,
            },
            'timeframes': {
                '1m': '1m',
                '5m': '5m',
                '15m': '15m',
                '30m': '30m',
                '1h': '1h',
                '6h': '6h',
                '1d': '1d',
            },
            'urls': {
                'api': {
                    'preprod': 'http://localhost:8082',
                    'mainnet': 'http://localhost:8082',
                },
                'www': 'https://www.geniusyield.co/',
                'doc': [
                    'https://github.com/geniusyield/dex-contracts-api?tab=readme-ov-file#geniusyield-dex',
                ],
            },
            'api': {
                'public': {
                    'get': {
                    },
                },
                'private': {
                    'get': {
                        'markets': 10,
                        'trading-fees': 10,
                    },
                },
            },
            'headers': {
                'X-Gate-Channel-Id': 'ccxt',
            },
            'options': {
                'defaultTimeInForce': 'utc',
                'defaultSelfTradePrevention': 'cn',
                'network': 'mainnet',
            },
            'exceptions': {
                'exact': {
                    'INVALID_ORDER_QUANTITY': InvalidOrder,
                    'INSUFFICIENT_FUNDS': InsufficientFunds,
                    'SERVICE_UNAVAILABLE': ExchangeNotAvailable,
                    'EXCEEDED_RATE_LIMIT': DDoSProtection,
                    'INVALID_PARAMETER': BadRequest,
                    'WALLET_NOT_ASSOCIATED': InvalidAddress,
                    'INVALID_WALLET_SIGNATURE': AuthenticationError,
                },
            },
            'requiredCredentials': {
                'walletAddress': false,
                'privateKey': false,
                'apiKey': true,
                'secret': false,
            },
            'precisionMode': TICK_SIZE,
            'paddingMode': PAD_WITH_ZERO,
            'commonCurrencies': {},
        });
    }

    async fetchMarkets (params = {}): Promise<Market[]> {
        /**
         * @method
         * @name geniusyield#fetchMarkets
         * @description retrieves data on all markets for geniusyield
         * @see https://api-docs-v3.geniusyield.io/#get-markets
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object[]} an array of objects representing market data
         */
        const markets = await this.privateGetMarkets (params);
        // [
        //    {
        //      "market_id": "lovelace_dda5fdb1002f7389b33e036b6afee82a8189becb6cba852e8b79b4fb.0014df1047454e53",
        //      "base_asset": "lovelace",
        //      "target_asset": "dda5fdb1002f7389b33e036b6afee82a8189becb6cba852e8b79b4fb.0014df1047454e53"
        //    }
        // ]
        const fees = await this.privateGetTradingFees ();
        // {
        //   "flat_maker_fee": "1000000",
        //   "flat_taker_fee": "1000000",
        //   "percentage_maker_fee": "0.3",
        //   "percentage_taker_fee": "0.3"
        // }
        const maker = this.safeNumber (fees, 'percentage_maker_fee');
        const taker = this.safeNumber (fees, 'percentage_taker_fee');
        const result = [];
        for (let i = 0; i < markets.length; i++) {
            const entry = markets[i];
            const marketId = this.safeString (entry, 'market_id');
            const baseId = this.safeString (entry, 'base_asset');
            const quoteId = this.safeString (entry, 'target_asset');
            const base = this.safeCurrencyCode (baseId);
            const quote = this.safeCurrencyCode (quoteId);
            result.push ({
                'id': marketId,
                'symbol': marketId,
                'base': base,
                'quote': quote,
                'settle': undefined,
                'baseId': baseId,
                'quoteId': quoteId,
                'settleId': undefined,
                'type': 'spot',
                'spot': true,
                'margin': false,
                'swap': false,
                'future': false,
                'option': false,
                'active': true,
                'contract': false,
                'linear': undefined,
                'inverse': undefined,
                'taker': taker,
                'maker': maker,
                'contractSize': undefined,
                'expiry': undefined,
                'expiryDatetime': undefined,
                'strike': undefined,
                'optionType': undefined,
                'precision': {
                    'amount': undefined,
                    'price': undefined,
                },
                'limits': {
                    'leverage': {
                        'min': undefined,
                        'max': undefined,
                    },
                    'amount': {
                        'min': undefined,
                        'max': undefined,
                    },
                    'price': {
                        'min': undefined,
                        'max': undefined,
                    },
                    'cost': {
                        'min': undefined,
                        'max': undefined,
                    },
                },
                'created': undefined,
                'info': entry,
            });
        }
        return result;
    }

    sign (path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        const network = this.safeString (this.options, 'network', 'mainnet');
        const version = this.safeString (this.options, 'version', 'v0');
        let url = this.urls['api'][network] + '/' + version + '/' + path;
        const keys = Object.keys (params);
        const length = keys.length;
        let query = undefined;
        if (length > 0) {
            if (method === 'GET') {
                query = this.urlencode (params);
                url = url + '?' + query;
            } else {
                body = this.json (params);
            }
        }
        headers = {
            'Content-Type': 'application/json',
        };
        if (this.apiKey !== undefined) {
            headers['api-key'] = this.apiKey;
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }
}
