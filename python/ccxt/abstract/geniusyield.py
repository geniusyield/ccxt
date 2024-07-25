from ccxt.base.types import Entry


class ImplicitAPI:
    private_get_balances_address = privateGetBalancesAddress = Entry('balances/{address}', 'private', 'GET', {'cost': 10})
    private_get_markets = privateGetMarkets = Entry('markets', 'private', 'GET', {'cost': 10})
    private_get_trading_fees = privateGetTradingFees = Entry('trading-fees', 'private', 'GET', {'cost': 10})
    private_get_settings = privateGetSettings = Entry('settings', 'private', 'GET', {'cost': 10})
