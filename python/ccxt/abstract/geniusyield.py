from ccxt.base.types import Entry


class ImplicitAPI:
    private_get_markets = privateGetMarkets = Entry('markets', 'private', 'GET', {'cost': 0})
    private_get_trading_fees = privateGetTradingFees = Entry('trading-fees', 'private', 'GET', {'cost': 0})
