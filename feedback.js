/**
 * feedback.js — 成就系统 + 关卡报告
 */
class FeedbackSystem {
    constructor() {
        this.achievements = [
            { id: 'first_trade', name: '初出茅庐', desc: '完成第一笔交易', icon: '🎯', unlocked: false },
            { id: 'first_profit', name: '小有收获', desc: '首次盈利卖出', icon: '💰', unlocked: false },
            { id: '10pct_profit', name: '稳扎稳打', desc: '单关盈利超10%', icon: '📈', unlocked: false },
            { id: 'volume_master', name: '量能大师', desc: '在放量时正确操作', icon: '🔊', unlocked: false },
            { id: 'stop_loss_hero', name: '纪律先锋', desc: '执行止损（亏损<5%时卖出）', icon: '🛡️', unlocked: false },
            { id: 'level3_clear', name: '均线达人', desc: '通过第3关', icon: '📏', unlocked: false },
            { id: 'perfect_score', name: '完美操作', desc: '单次交易获S级评分', icon: '🏆', unlocked: false },
            { id: 'macd_user', name: 'MACD实战', desc: '在MACD金叉时买入', icon: '✨', unlocked: false },
            { id: 'level5_clear', name: '实战高手', desc: '通过全部5关', icon: '👑', unlocked: false },
            { id: 'big_profit', name: '暴利猎手', desc: '单笔盈利超15%', icon: '🤑', unlocked: false },
            { id: 'quiz_perfect', name: '学霸', desc: '测验全部答对', icon: '🎓', unlocked: false },
        ];
        this.newAchievements = [];
    }

    checkAchievements(trade, trading, levelId) {
        this.newAchievements = [];
        const unlock = (id) => {
            const ach = this.achievements.find(a => a.id === id);
            if (ach && !ach.unlocked) { ach.unlocked = true; this.newAchievements.push(ach); }
        };
        unlock('first_trade');
        if (trade.type === 'SELL' && trade.pnl > 0) unlock('first_profit');
        if (trade.type === 'SELL' && trade.pnlRate > 0.15) unlock('big_profit');
        if (trade.score?.grade === 'S') unlock('perfect_score');
        if (trade.type === 'SELL' && trade.pnl < 0 && Math.abs(trade.pnlRate) < 0.05) unlock('stop_loss_hero');
        return this.newAchievements;
    }

    checkLevelClear(levelId, profitRate) {
        const unlock = (id) => {
            const ach = this.achievements.find(a => a.id === id);
            if (ach && !ach.unlocked) { ach.unlocked = true; this.newAchievements.push(ach); }
        };
        if (profitRate >= 0.10) unlock('10pct_profit');
        if (levelId >= 3) unlock('level3_clear');
        if (levelId >= 5) unlock('level5_clear');
    }

    generateReport(levelConfig, trading, currentPrice) {
        const profitRate = trading.getProfitRate(currentPrice);
        const passed = profitRate >= levelConfig.targetProfit;
        const avgScore = trading.getAverageScore();
        let stars = 1;
        if (profitRate >= levelConfig.targetProfit * 2) stars = 3;
        else if (profitRate >= levelConfig.targetProfit * 1.3) stars = 2;
        return {
            levelId: levelConfig.id, title: levelConfig.title, passed, profitRate,
            targetProfit: levelConfig.targetProfit, totalAssets: trading.getTotalAssets(currentPrice),
            tradeCount: trading.tradeCount, avgScore: Math.round(avgScore), stars,
            trades: trading.tradeHistory,
        };
    }

    loadProgress() {
        try {
            const data = localStorage.getItem('stock_game_v2');
            if (data) {
                const saved = JSON.parse(data);
                if (saved.achievements) saved.achievements.forEach(a => { const f = this.achievements.find(x => x.id === a.id); if (f) f.unlocked = a.unlocked; });
                return saved.unlockedLevels || [1];
            }
        } catch (e) { }
        return [1];
    }

    saveProgress(unlockedLevels) {
        try { localStorage.setItem('stock_game_v2', JSON.stringify({ unlockedLevels, achievements: this.achievements })); } catch (e) { }
    }
}
