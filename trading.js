/**
 * trading.js — 交易系统 + 增强评分
 */
class TradingSystem {
    constructor(initialCash) {
        this.initialCash = initialCash;
        this.cash = initialCash;
        this.shares = 0;
        this.avgCost = 0;
        this.tradeCount = 0;
        this.tradeHistory = [];
    }

    buy(price, qty) {
        const cost = price * qty;
        const commission = Math.max(5, cost * 0.0003);
        const total = cost + commission;
        if (total > this.cash) return { success: false, msg: `资金不足 (需要 ¥${total.toFixed(0)})` };
        if (qty < 100) return { success: false, msg: '最少买入100股（1手）' };
        this.cash -= total;
        const oldTotal = this.avgCost * this.shares;
        this.shares += qty;
        this.avgCost = (oldTotal + cost) / this.shares;
        this.tradeCount++;
        const trade = { type: 'BUY', price, qty, cost: total, time: Date.now() };
        this.tradeHistory.push(trade);
        return { success: true, msg: `买入 ${qty}股 @ ¥${price.toFixed(2)}`, trade };
    }

    sell(price, qty) {
        if (qty > this.shares) return { success: false, msg: `持仓不足 (持有${this.shares}股)` };
        if (qty < 100) return { success: false, msg: '最少卖出100股' };
        const revenue = price * qty;
        const commission = Math.max(5, revenue * 0.0003);
        const tax = revenue * 0.001;
        const net = revenue - commission - tax;
        const costBasis = this.avgCost * qty;
        const pnl = net - costBasis;
        const pnlRate = costBasis > 0 ? pnl / costBasis : 0;
        this.cash += net;
        this.shares -= qty;
        if (this.shares === 0) this.avgCost = 0;
        this.tradeCount++;
        const trade = { type: 'SELL', price, qty, revenue: net, pnl, pnlRate, time: Date.now() };
        this.tradeHistory.push(trade);
        return { success: true, msg: `卖出 ${qty}股 @ ¥${price.toFixed(2)}  ${pnl >= 0 ? '盈利' : '亏损'} ¥${Math.abs(pnl).toFixed(0)}`, trade };
    }

    getMaxBuyQty(price) { return Math.floor(this.cash / (price * 1.001)) - (Math.floor(this.cash / (price * 1.001)) % 100); }
    getTotalAssets(price) { return this.cash + this.shares * price; }
    getProfitRate(price) { return (this.getTotalAssets(price) - this.initialCash) / this.initialCash; }
    getAverageScore() {
        const scores = this.tradeHistory.filter(t => t.score).map(t => t.score.score);
        return scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    }

    /** Score a trade based on market context */
    scoreTrade(trade, dayData, allDays, indicators) {
        let score = 50;
        const fb = [];
        const dayIdx = allDays.indexOf(dayData);
        const isBuy = trade.type === 'BUY';

        // 1. 量价关系 (+/-15)
        if (isBuy) {
            if (dayData.volumeMulti >= 1.5 && dayData.change > 0) { score += 15; fb.push({ text: '放量上涨时买入，量价配合良好', type: 'good' }); }
            else if (dayData.volumeMulti >= 1.5 && dayData.change < 0) { score -= 15; fb.push({ text: '⚠️ 放量下跌时买入，逆势操作风险大', type: 'bad' }); }
            else if (dayData.volumeMulti < 0.7) { score -= 5; fb.push({ text: '⚠️ 缩量时买入，市场缺乏动力', type: 'warn' }); }
        } else {
            if (dayData.volumeMulti >= 1.5 && dayData.change < -0.02) { score += 10; fb.push({ text: '放量下跌时卖出，回避风险', type: 'good' }); }
            if (trade.pnl > 0) { score += 10; fb.push({ text: `盈利 ¥${trade.pnl.toFixed(0)}，不错！`, type: 'good' }); }
            else if (trade.pnl < 0 && Math.abs(trade.pnlRate) < 0.05) { score += 5; fb.push({ text: '及时止损，控制住了损失', type: 'ok' }); }
            else if (trade.pnl < 0) { score -= 10; fb.push({ text: `亏损 ¥${Math.abs(trade.pnl).toFixed(0)}，止损要更果断`, type: 'bad' }); }
        }

        // 2. 均线位置 (+/-10)
        if (indicators.ma10 && dayIdx >= 0) {
            const ma10 = indicators.ma10[dayIdx];
            if (ma10) {
                if (isBuy && dayData.close > ma10) { score += 8; fb.push({ text: '站稳10日线上方买入，趋势支持', type: 'good' }); }
                else if (isBuy && dayData.close < ma10) { score -= 8; fb.push({ text: '⚠️ 跌破10日线时买入，趋势不利', type: 'warn' }); }
            }
        }

        // 3. MACD (+/-10)
        if (indicators.macd?.bar?.[dayIdx] != null) {
            const bar = indicators.macd.bar[dayIdx];
            if (isBuy && bar > 0) { score += 8; fb.push({ text: 'MACD柱为正，上升趋势确认', type: 'good' }); }
            else if (isBuy && bar < 0) { score -= 5; fb.push({ text: '⚠️ MACD柱为负，下行趋势中买入', type: 'warn' }); }
        }

        score = Math.max(0, Math.min(100, Math.round(score)));
        const grade = score >= 85 ? 'S' : score >= 70 ? 'A' : score >= 55 ? 'B' : score >= 40 ? 'C' : 'D';
        const result = { score, grade, feedbacks: fb };
        trade.score = result;
        return result;
    }
}
