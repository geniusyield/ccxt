import { implicitReturnType } from '../base/types.js';
import { Exchange as _Exchange } from '../base/Exchange.js';
interface Exchange {
    privateGetBalancesAddress(params?: {}): Promise<implicitReturnType>;
    privateGetMarkets(params?: {}): Promise<implicitReturnType>;
    privateGetTradingFees(params?: {}): Promise<implicitReturnType>;
    privateGetSettings(params?: {}): Promise<implicitReturnType>;
}
declare abstract class Exchange extends _Exchange {
}
export default Exchange;
