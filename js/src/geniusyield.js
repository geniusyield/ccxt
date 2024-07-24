// ---------------------------------------------------------------------------
import Exchange from './abstract/geniusyield.js';
import { TICK_SIZE, PAD_WITH_ZERO } from './base/functions/number.js';
import { InvalidOrder, InsufficientFunds, ExchangeNotAvailable, DDoSProtection, BadRequest, InvalidAddress, AuthenticationError } from './base/errors.js';
import { Precise } from './base/Precise.js';
// ---------------------------------------------------------------------------
/**
 * @class geniusyield
 * @augments Exchange
 */
export default class geniusyield extends Exchange {
    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'geniusyield',
            'name': 'Genius Yield',
            'countries': ['CH'],
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
                'cancelOrder': false,
                'cancelOrders': false,
                'closeAllPositions': false,
                'closePosition': false,
                'createDepositAddress': false,
                'createOrder': false,
                'createReduceOnlyOrder': false,
                'createStopLimitOrder': false,
                'createStopMarketOrder': false,
                'createStopOrder': false,
                'fetchBalance': false,
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
                'fetchOrders': false,
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
                    'preprod': 'https://localhost:8082/v0/',
                    'mainnet': 'https://localhost:8082/v0/',
                },
                'www': 'https://www.geniusyield.co/',
                'doc': [
                    'https://github.com/geniusyield/dex-contracts-api?tab=readme-ov-file#geniusyield-dex',
                ],
            },
            'api': {
                'public': {
                    'get': {},
                },
                'private': {
                    'get': {
                        'markets': 0,
                        'trading-fees': 0,
                    }
                },
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
    async fetchMarkets(params = {}) {
        /**
         * @method
         * @name geniusyield#fetchMarkets
         * @description retrieves data on all markets for geniusyield
         * @see https://api-docs-v3.geniusyield.io/#get-markets
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object[]} an array of objects representing market data
         */
        const markets = await this.privateGetMarkets(params);
        // [
        //    {
        //      "market_id": "lovelace_dda5fdb1002f7389b33e036b6afee82a8189becb6cba852e8b79b4fb.0014df1047454e53",
        //      "base_asset": "lovelace",
        //      "target_asset": "dda5fdb1002f7389b33e036b6afee82a8189becb6cba852e8b79b4fb.0014df1047454e53"
        //    }
        // ]
        const fees = await this.privateGetTradingFees();
        // {
        //   "flat_maker_fee": "1000000",
        //   "flat_taker_fee": "1000000",
        //   "percentage_maker_fee": "0.3",
        //   "percentage_taker_fee": "0.3"
        // }
        const maker = this.safeNumber(fees, 'makerFeeRate');
        const taker = this.safeNumber(fees, 'takerFeeRate');
        const makerMin = this.safeString(fees, 'makerTradeMinimum');
        const takerMin = this.safeString(fees, 'takerTradeMinimum');
        const minCost = this.parseNumber(Precise.stringMin(makerMin, takerMin));
        const result = [];
        for (let i = 0; i < markets.length; i++) {
            const entry = markets[i];
            const marketId = this.safeString(entry, 'market_id');
            const baseId = this.safeString(entry, 'base_asset');
            const quoteId = this.safeString(entry, 'target_asset');
            const base = this.safeCurrencyCode(baseId);
            const quote = this.safeCurrencyCode(quoteId);
            const basePrecision = this.parseNumber(this.parsePrecision(this.safeString(entry, 'baseAssetPrecision')));
            const quotePrecision = this.parseNumber(this.parsePrecision(this.safeString(entry, 'quoteAssetPrecision')));
            const status = this.safeString(entry, 'status');
            result.push({
                'id': marketId,
                'symbol': base + '/' + quote,
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
                'active': (status !== 'inactive'),
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
                    'amount': basePrecision,
                    'price': this.safeNumber(entry, 'tickSize'),
                },
                'limits': {
                    'leverage': {
                        'min': undefined,
                        'max': undefined,
                    },
                    'amount': {
                        'min': basePrecision,
                        'max': undefined,
                    },
                    'price': {
                        'min': quotePrecision,
                        'max': undefined,
                    },
                    'cost': {
                        'min': minCost,
                        'max': undefined,
                    },
                },
                'created': undefined,
                'info': entry,
            });
        }
        return result;
    }
}
