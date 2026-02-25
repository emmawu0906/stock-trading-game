/**
 * signals.js — 技术指标 + 量价信号检测
 * SMA / EMA / MACD / KDJ / Volume MAs
 */
class TechnicalIndicators {
    static sma(prices, period) {
        const result = [];
        for (let i = 0; i < prices.length; i++) {
            if (i < period - 1) { result.push(null); }
            else { result.push(+(prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period).toFixed(2)); }
        }
        return result;
    }
    static ema(prices, period) {
        const result = []; const k = 2 / (period + 1);
        for (let i = 0; i < prices.length; i++) {
            if (prices[i] === null) { result.push(null); continue; }
            if (result.length === 0 || result.every(v => v === null)) result.push(prices[i]);
            else { const prev = result[result.length - 1] || prices[i]; result.push(+(prices[i] * k + prev * (1 - k)).toFixed(4)); }
        }
        return result;
    }
    static macd(prices) {
        const ema12 = this.ema(prices, 12), ema26 = this.ema(prices, 26);
        const dif = [];
        for (let i = 0; i < prices.length; i++) {
            dif.push(ema12[i] != null && ema26[i] != null ? +(ema12[i] - ema26[i]).toFixed(4) : null);
        }
        const validDif = dif.filter(v => v !== null);
        const dea = this.ema(validDif, 9);
        const paddedDea = new Array(dif.length - validDif.length).fill(null).concat(dea);
        const bar = dif.map((d, i) => d != null && paddedDea[i] != null ? +((d - paddedDea[i]) * 2).toFixed(4) : null);
        return { dif, dea: paddedDea, bar };
    }
    static kdj(dailyData) {
        const period = 9, result = { k: [], d: [], j: [] };
        let prevK = 50, prevD = 50;
        for (let i = 0; i < dailyData.length; i++) {
            if (i < period - 1) { result.k.push(50); result.d.push(50); result.j.push(50); continue; }
            const w = dailyData.slice(i - period + 1, i + 1);
            const highest = Math.max(...w.map(d => d.high)), lowest = Math.min(...w.map(d => d.low));
            const rsv = highest === lowest ? 50 : ((dailyData[i].close - lowest) / (highest - lowest)) * 100;
            const k = (2 / 3) * prevK + (1 / 3) * rsv, d = (2 / 3) * prevD + (1 / 3) * k, j = 3 * k - 2 * d;
            result.k.push(+k.toFixed(2)); result.d.push(+d.toFixed(2)); result.j.push(+Math.max(0, Math.min(100, j)).toFixed(2));
            prevK = k; prevD = d;
        }
        return result;
    }
}

class SignalSystem {
    static generateSignals(dayData, allDays, indicators) {
        const signals = [];
        const dayIdx = allDays.indexOf(dayData);

        if (dayData.volumeMulti >= 2.0 && dayData.change > 0.02) {
            const ma20 = indicators.ma20?.[dayIdx];
            if (ma20 && dayData.close > ma20) signals.push({ type: 'STRONG_BUY', name: '放量突破', icon: '🔥', description: `成交量放大${dayData.volumeMulti.toFixed(1)}倍，突破20日线`, confidence: 0.8 });
            else signals.push({ type: 'BUY', name: '放量上涨', icon: '📈', description: `成交量放大${dayData.volumeMulti.toFixed(1)}倍，股价上涨${(dayData.change * 100).toFixed(1)}%`, confidence: 0.65 });
        }
        if (dayData.volumeMulti < 0.7 && dayData.change < 0 && dayData.change > -0.03) {
            signals.push({ type: 'HOLD', name: '缩量回调', icon: '⏸️', description: '成交量萎缩，回调幅度小——正常洗盘', confidence: 0.6 });
        }
        if (dayData.volumeMulti >= 1.8 && dayData.change < -0.02) {
            signals.push({ type: 'SELL', name: '放量下跌', icon: '🚨', description: '放量大跌，资金出逃——注意风险', confidence: 0.7 });
        }
        if (dayIdx >= 1) {
            const prevDay = allDays[dayIdx - 1];
            if (dayData.close > prevDay.close && dayData.volume < prevDay.volume * 0.7) {
                signals.push({ type: 'WARNING', name: '量价背离', icon: '⚠️', description: '价格上涨但成交量下降——上涨可能不可持续', confidence: 0.55 });
            }
        }
        if (indicators.macd && dayIdx >= 1) {
            const prevBar = indicators.macd.bar[dayIdx - 1], currBar = indicators.macd.bar[dayIdx];
            if (prevBar != null && currBar != null) {
                if (prevBar <= 0 && currBar > 0) signals.push({ type: 'BUY', name: 'MACD金叉', icon: '✨', description: 'MACD柱转正——趋势可能向上', confidence: 0.7 });
                if (prevBar >= 0 && currBar < 0) signals.push({ type: 'SELL', name: 'MACD死叉', icon: '❌', description: 'MACD柱转负——趋势可能向下', confidence: 0.7 });
            }
        }
        if (indicators.ma10?.[dayIdx] && dayData.change < 0) {
            const ma10 = indicators.ma10[dayIdx];
            if (dayData.low <= ma10 * 1.005 && dayData.close > ma10) signals.push({ type: 'BUY', name: '均线支撑', icon: '🛡️', description: '回踩10日线获得支撑', confidence: 0.65 });
        }
        if (dayData.isEvent) signals.push({ type: 'EVENT', name: '重大事件', icon: '📢', description: dayData.patternDesc, confidence: 0.9 });

        return signals;
    }

    static calculateIndicators(allDays, features) {
        const closes = allDays.map(d => d.close);
        const volumes = allDays.map(d => d.volume);
        const indicators = {};
        // Always compute MA5 for chart
        indicators.ma5 = TechnicalIndicators.sma(closes, 5);
        if (features.includes('ma10')) indicators.ma10 = TechnicalIndicators.sma(closes, 10);
        if (features.includes('ma20')) indicators.ma20 = TechnicalIndicators.sma(closes, 20);
        if (features.includes('ma30')) indicators.ma30 = TechnicalIndicators.sma(closes, 30);
        if (features.includes('macd')) indicators.macd = TechnicalIndicators.macd(closes);
        if (features.includes('kdj')) indicators.kdj = TechnicalIndicators.kdj(allDays);
        // Volume MAs
        indicators.volMa5 = TechnicalIndicators.sma(volumes, 5);
        indicators.volMa10 = TechnicalIndicators.sma(volumes, 10);
        return indicators;
    }
}
