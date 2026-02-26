/**
 * app.js — 主控制器
 * 关卡选择 → 资金选择 → 教学弹窗 → 测验 → 实战交易 → 报告
 */
class GameApp {
    constructor() {
        this.feedback = new FeedbackSystem();
        this.teaching = new TeachingSystem();
        this.unlockedLevels = this.feedback.loadProgress();
        this.levelConfig = null;
        this.priceGen = null;
        this.trading = null;
        this.chart = null;
        this.indicators = {};
        this.currentTradingDay = -1;
        this.gameOver = false;
        this.selectedCapital = 100000; // 默认10万
        this.pendingLevelId = null;
        this.init();
    }

    init() {
        this.renderLevelGrid();
        this.bindEvents();
    }

    // ========== Level Select ==========
    renderLevelGrid() {
        const grid = document.getElementById('level-grid');
        grid.innerHTML = LEVEL_CONFIGS.map(cfg => {
            const unlocked = this.unlockedLevels.includes(cfg.id);
            const cls = unlocked ? 'unlocked' : 'locked';
            const modeIcons = { observe: '👁️', coach: '🤝', trade: '📈' };
            const badgeIcon = unlocked ? (cfg.badge ? cfg.badge.slice(0, 2) : modeIcons[cfg.mode] || '📈') : '🔒';
            const targetText = cfg.mode === 'observe' ? '🎯 预测准确率60%+' : `🎯 盈利目标 ${(cfg.targetProfit * 100).toFixed(0)}%`;
            const metaText = cfg.mode === 'observe' ? `${cfg.tradingDays}天观察 · 纯预测` : `${cfg.tradingDays}个交易日 · ${cfg.maxTrades > 100 ? '无限' : cfg.maxTrades}次交易`;
            return `
        <div class="level-card ${cls}" data-level="${cfg.id}">
          <div class="level-badge">${badgeIcon}</div>
          <div class="level-number">${cfg.id}</div>
          <div class="level-title">${cfg.title}</div>
          <div class="level-subtitle">${cfg.subtitle}</div>
          <div class="level-target">${targetText}</div>
          <div class="level-meta">${metaText}</div>
        </div>`;
        }).join('');

        grid.querySelectorAll('.level-card.unlocked').forEach(card => {
            card.addEventListener('click', () => this.showCapitalModal(parseInt(card.dataset.level)));
        });
    }

    // ========== Capital Selection ==========
    showCapitalModal(levelId) {
        this.pendingLevelId = levelId;
        const cfg = LEVEL_CONFIGS.find(c => c.id === levelId);
        document.getElementById('capital-level-name').textContent = `第${levelId}关：${cfg.title}`;
        this.renderCapitalGrid();
        document.getElementById('capital-modal').classList.remove('hidden');
    }

    hideCapitalModal() {
        document.getElementById('capital-modal').classList.add('hidden');
        this.pendingLevelId = null;
    }

    renderCapitalGrid() {
        const grid = document.getElementById('capital-grid');
        const amounts = [100000, 200000, 300000, 400000, 500000, 600000, 700000, 800000, 900000, 1000000];
        grid.innerHTML = amounts.map(amt => {
            const wan = amt / 10000;
            const selected = amt === this.selectedCapital ? 'selected' : '';
            return `<div class="capital-option ${selected}" data-amount="${amt}">
                <div class="capital-amount">${wan}</div>
                <div class="capital-unit">万元</div>
            </div>`;
        }).join('');

        grid.querySelectorAll('.capital-option').forEach(opt => {
            opt.addEventListener('click', () => {
                this.selectedCapital = parseInt(opt.dataset.amount);
                grid.querySelectorAll('.capital-option').forEach(o => o.classList.remove('selected'));
                opt.classList.add('selected');
            });
        });
    }

    // ========== Start Level ==========
    startLevel(levelId) {
        this.levelConfig = LEVEL_CONFIGS.find(c => c.id === levelId);
        if (!this.levelConfig) return;

        this.priceGen = new PriceGenerator(this.levelConfig);
        this.trading = new TradingSystem(this.selectedCapital);
        this.currentTradingDay = -1;
        this.gameOver = false;

        // Switch screen
        document.getElementById('screen-menu').classList.add('hidden');
        document.getElementById('screen-game').classList.remove('hidden');

        // Init chart
        this.chart = new StockChart('kline-chart', 'vol-chart', 'macd-chart');
        this.chart.resize();

        // Header
        document.getElementById('level-info-title').textContent = `第${levelId}关：${this.levelConfig.title}`;
        const targetText = this.levelConfig.mode === 'observe' ? '目标：预测准确率60%+' : `目标 +${(this.levelConfig.targetProfit * 100).toFixed(0)}%`;
        document.getElementById('level-target-text').textContent = targetText;

        // Observation mode: hide trade controls, show prediction buttons
        this.isObserveMode = this.levelConfig.mode === 'observe';
        this.isCoachMode = this.levelConfig.mode === 'coach';
        this.predictions = { correct: 0, total: 0 };
        const tradeSection = document.querySelector('.trade-section');
        if (tradeSection) tradeSection.style.display = this.isObserveMode ? 'none' : '';

        // Tips
        const tipsList = document.getElementById('tips-list');
        tipsList.innerHTML = this.levelConfig.tips.map(t => `<div class="tip-item">${t}</div>`).join('');

        // Reset UI
        this.updateUI(this.levelConfig.initialPrice);
        document.getElementById('signal-list').innerHTML = '<div class="empty-hint">完成教学后开始交易</div>';
        document.getElementById('feedback-list').innerHTML = '';
        document.getElementById('pattern-desc').textContent = '开始教学...';
        document.getElementById('pattern-desc').className = 'pattern-desc';

        // Disable trade buttons during teaching
        this.setTradeEnabled(false);

        // Reset day counter
        document.getElementById('day-counter').textContent = `Day 0/${this.levelConfig.tradingDays}`;
        document.getElementById('day-progress-bar').style.width = '0%';

        // Draw history chart
        const historyData = this.priceGen.dailyData.slice(0, this.priceGen.tradingStartIndex);
        const features = this.levelConfig.unlockFeatures;
        this.indicators = SignalSystem.calculateIndicators(historyData, features);
        this.chart.draw(historyData, -1, this.indicators, features);

        // Start teaching
        this.teaching.startTeaching(this.levelConfig, () => {
            this.onTeachingComplete();
        });
    }

    onTeachingComplete() {
        // Observe mode: keep trade disabled
        if (!this.isObserveMode) {
            this.setTradeEnabled(true);
        }
        // Auto-advance to first trading day
        this.nextDay();
    }

    setTradeEnabled(enabled) {
        const btns = ['btn-buy', 'btn-sell', 'btn-buy-max', 'btn-sell-all'];
        btns.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.disabled = !enabled;
        });
    }

    // ========== Events ==========
    bindEvents() {
        // Capital modal
        document.getElementById('btn-capital-cancel').addEventListener('click', () => this.hideCapitalModal());
        document.getElementById('capital-overlay').addEventListener('click', () => this.hideCapitalModal());
        document.getElementById('btn-capital-confirm').addEventListener('click', () => {
            if (this.pendingLevelId) {
                const levelId = this.pendingLevelId;
                this.hideCapitalModal();
                this.startLevel(levelId);
            }
        });

        document.getElementById('btn-back-menu').addEventListener('click', () => this.backToMenu());
        document.getElementById('btn-next-day').addEventListener('click', () => this.nextDay());
        document.getElementById('btn-prev-day').addEventListener('click', () => this.prevDay());
        document.getElementById('btn-buy').addEventListener('click', () => this.trade('buy'));
        document.getElementById('btn-sell').addEventListener('click', () => this.trade('sell'));
        document.getElementById('btn-buy-max').addEventListener('click', () => this.tradeMax('buy'));
        document.getElementById('btn-sell-all').addEventListener('click', () => this.tradeMax('sell'));
        document.querySelectorAll('.qty-btn').forEach(b => b.addEventListener('click', () => {
            document.getElementById('trade-shares').value = b.dataset.qty;
        }));
        document.getElementById('btn-report-next').addEventListener('click', () => this.nextLevel());
        window.addEventListener('resize', () => { if (this.chart) { this.chart.resize(); this.redrawChart(); } });
    }

    // ========== Next / Prev Day ==========
    nextDay() {
        if (this.gameOver) return;
        const totalDays = this.priceGen.getTotalTradingDays();
        if (this.currentTradingDay >= totalDays - 1) {
            this.endLevel();
            return;
        }
        this.currentTradingDay++;
        const dayData = this.priceGen.getTradingDayData(this.currentTradingDay);
        if (!dayData) { this.endLevel(); return; }

        // Update indicators with all visible data
        const visibleData = this.priceGen.getVisibleData(this.currentTradingDay);
        this.indicators = SignalSystem.calculateIndicators(visibleData, this.levelConfig.unlockFeatures);

        // Draw chart
        const absIdx = this.priceGen.tradingStartIndex + this.currentTradingDay;
        this.chart.draw(visibleData, absIdx, this.indicators, this.levelConfig.unlockFeatures);

        // Update price display
        this.updateUI(dayData.close, dayData);

        // Pattern description
        const desc = document.getElementById('pattern-desc');
        desc.textContent = dayData.patternDesc || `第 ${dayData.tradingDay} 个交易日`;
        desc.className = 'pattern-desc' + (dayData.change >= 0 ? ' up' : ' down');

        // Signals
        const signals = SignalSystem.generateSignals(dayData, visibleData, this.indicators);
        this.renderSignals(signals);

        // Day progress
        document.getElementById('day-counter').textContent = `Day ${this.currentTradingDay + 1}/${totalDays}`;
        document.getElementById('day-progress-bar').style.width = `${((this.currentTradingDay + 1) / totalDays) * 100}%`;

        // Observe mode: show prediction prompt
        if (this.isObserveMode && this.currentTradingDay < totalDays - 1) {
            this.showPredictionPrompt(dayData);
        }

        // Coach mode: show coach messages
        if (this.isCoachMode && this.levelConfig.coachScript) {
            this.showCoachMessage(dayData);
        }
    }

    prevDay() {
        // Just re-render current state (no going back essentially, just shows info)
        if (this.currentTradingDay < 0) return;
        this.teaching.showTip('💡 提示', '暂不支持回到过去交易，请专注当前行情');
    }

    // ========== Trade ==========
    trade(type) {
        if (this.gameOver) return;
        if (this.currentTradingDay < 0) {
            this.showTradeMsg('请先完成教学，或点击「下一天」开始交易', 'error');
            return;
        }
        const dayData = this.priceGen.getTradingDayData(this.currentTradingDay);
        if (!dayData) return;
        const qty = parseInt(document.getElementById('trade-shares').value) || 100;
        const price = dayData.close;

        if (this.trading.tradeCount >= this.levelConfig.maxTrades) {
            this.showTradeMsg('已达交易次数上限', 'error');
            return;
        }

        let result;
        if (type === 'buy') result = this.trading.buy(price, qty);
        else result = this.trading.sell(price, qty);

        if (!result.success) { this.showTradeMsg(result.msg, 'error'); return; }

        // Score it
        const visibleData = this.priceGen.getVisibleData(this.currentTradingDay);
        const score = this.trading.scoreTrade(result.trade, dayData, visibleData, this.indicators);
        this.showTradeMsg(result.msg, 'success');
        this.renderScoreCard(score, result.trade);

        // Achievements
        const newAch = this.feedback.checkAchievements(result.trade, this.trading, this.levelConfig.id);
        newAch.forEach(a => this.showAchievement(a));

        // Update UI
        this.updateUI(price, dayData);
    }

    tradeMax(type) {
        if (this.gameOver) return;
        if (this.currentTradingDay < 0) {
            this.showTradeMsg('请先完成教学，或点击「下一天」开始交易', 'error');
            return;
        }
        const dayData = this.priceGen.getTradingDayData(this.currentTradingDay);
        if (!dayData) return;
        const price = dayData.close;
        if (type === 'buy') {
            const maxQty = this.trading.getMaxBuyQty(price);
            if (maxQty < 100) { this.showTradeMsg('资金不足买入1手', 'error'); return; }
            document.getElementById('trade-shares').value = maxQty;
            this.trade('buy');
        } else {
            if (this.trading.shares < 100) { this.showTradeMsg('没有持仓', 'error'); return; }
            document.getElementById('trade-shares').value = this.trading.shares;
            this.trade('sell');
        }
    }

    // ========== End Level ==========
    endLevel() {
        this.gameOver = true;
        const dayData = this.priceGen.getTradingDayData(Math.max(0, this.currentTradingDay));
        const price = dayData ? dayData.close : this.levelConfig.initialPrice;
        const report = this.feedback.generateReport(this.levelConfig, this.trading, price, this.predictions);

        this.feedback.newAchievements = [];
        this.feedback.checkLevelClear(this.levelConfig.id, report.profitRate);
        this.feedback.newAchievements.forEach(a => this.showAchievement(a));

        if (report.passed && !this.unlockedLevels.includes(this.levelConfig.id + 1) && this.levelConfig.id < 10) {
            this.unlockedLevels.push(this.levelConfig.id + 1);
        }
        this.feedback.saveProgress(this.unlockedLevels);

        this.showReport(report);
    }

    showReport(report) {
        document.getElementById('screen-game').classList.add('hidden');
        document.getElementById('screen-report').classList.remove('hidden');

        const starsStr = '⭐'.repeat(report.stars) + '☆'.repeat(3 - report.stars);
        const profitPct = (report.profitRate * 100).toFixed(2);
        const cls = report.passed ? 'passed' : 'failed';

        let tradesHTML = report.trades.map(t => {
            const cls = t.type === 'BUY' ? 'buy' : 'sell';
            const label = t.type === 'BUY' ? '买入' : '卖出';
            const scoreHTML = t.score ? `<span class="trade-score">${t.score.grade} (${t.score.score})</span>` : '';
            return `<div class="trade-record ${cls}"><span>${label} ${t.qty}股 @ ¥${t.price.toFixed(2)}</span>${scoreHTML}</div>`;
        }).join('');

        // Observe mode: show prediction stats instead of profit
        const isObs = report.isObserveMode;
        const mainStatLabel = isObs ? '预测准确率' : '收益率';
        const mainStatValue = isObs ? `${(report.profitRate * 100).toFixed(0)}%` : `${profitPct}%`;
        const targetLabel = isObs ? '目标准确率' : '目标';
        const targetValue = isObs ? `${(report.targetProfit * 100).toFixed(0)}%` : `+${(report.targetProfit * 100).toFixed(0)}%`;
        const predInfo = isObs && report.predictions ? `<div class="stat-row"><span>预测次数</span><span>${report.predictions.correct}/${report.predictions.total}</span></div>` : '';

        document.getElementById('report-content').innerHTML = `
      <div class="report-header ${cls}">
        <div class="report-stars">${starsStr}</div>
        <div class="report-result">${report.passed ? '🎉 闯关成功！' : '😔 未达目标'}</div>
        <div class="report-level">第${report.levelId}关 · ${report.title}</div>
      </div>
      <div class="report-stats">
        <div class="stat-row"><span>${mainStatLabel}</span><span class="${report.profitRate >= 0 ? 'up' : 'down'}">${mainStatValue}</span></div>
        <div class="stat-row"><span>${targetLabel}</span><span>${targetValue}</span></div>
        ${isObs ? predInfo : `<div class="stat-row"><span>总资产</span><span>¥${report.totalAssets.toFixed(0)}</span></div>`}
        ${isObs ? '' : `<div class="stat-row"><span>交易次数</span><span>${report.tradeCount}</span></div>`}
        ${isObs ? '' : `<div class="stat-row"><span>平均评分</span><span>${report.avgScore}</span></div>`}
      </div>
      <div class="report-trades"><h3>${isObs ? '📋 预测总结' : '📋 交易记录'}</h3>${tradesHTML || (isObs ? '<div class="empty-hint">观察模式无交易记录</div>' : '<div class="empty-hint">未进行交易</div>')}</div>
    `;

        const nextBtn = document.getElementById('btn-report-next');
        // Reset onclick to default handler
        nextBtn.onclick = null;
        if (report.passed && this.levelConfig.id < 10) {
            nextBtn.style.display = 'inline-flex';
            nextBtn.textContent = `第${this.levelConfig.id + 1}关 ▶`;
            nextBtn.onclick = () => this.nextLevel();
        } else if (this.levelConfig.id >= 10 && report.passed) {
            nextBtn.style.display = 'inline-flex';
            nextBtn.textContent = '🎓 全部通关！返回主页';
            nextBtn.onclick = () => this.backToMenu();
        } else {
            nextBtn.style.display = 'inline-flex';
            nextBtn.textContent = '🔄 重新挑战';
            nextBtn.onclick = () => { document.getElementById('screen-report').classList.add('hidden'); this.startLevel(this.levelConfig.id); };
        }
    }

    nextLevel() {
        const nextId = this.levelConfig.id + 1;
        document.getElementById('screen-report').classList.add('hidden');
        if (nextId <= 10 && this.unlockedLevels.includes(nextId)) {
            this.startLevel(nextId);
        } else {
            this.startLevel(this.levelConfig.id); // retry
        }
    }

    backToMenu() {
        document.getElementById('screen-game').classList.add('hidden');
        document.getElementById('screen-report').classList.add('hidden');
        document.getElementById('screen-menu').classList.remove('hidden');
        this.renderLevelGrid();
    }

    // ========== UI Updates ==========
    updateUI(price, dayData) {
        const priceEl = document.getElementById('current-price');
        const profitRate = this.trading ? this.trading.getProfitRate(price) : 0;
        const change = dayData ? dayData.change : 0;
        const isUp = change >= 0;
        priceEl.textContent = `¥${price.toFixed(2)}`;
        priceEl.style.color = isUp ? 'var(--up)' : 'var(--down)';
        document.getElementById('price-change').textContent = `${isUp ? '+' : ''}${(change * 100).toFixed(2)}%`;
        document.getElementById('price-change').style.color = isUp ? 'var(--up)' : 'var(--down)';
        document.getElementById('day-volume').textContent = dayData ? `${(dayData.volume / 10000).toFixed(0)}万` : '--';
        document.getElementById('volume-ratio').textContent = dayData ? `${dayData.volumeMulti.toFixed(1)}x` : '--';

        if (this.trading) {
            document.getElementById('total-assets').textContent = `¥${this.trading.getTotalAssets(price).toFixed(0)}`;
            const profitEl = document.getElementById('profit-rate');
            profitEl.textContent = `${profitRate >= 0 ? '+' : ''}${(profitRate * 100).toFixed(2)}%`;
            profitEl.style.color = profitRate >= 0 ? 'var(--up)' : 'var(--down)';
            document.getElementById('available-cash').textContent = `¥${this.trading.cash.toFixed(0)}`;
            document.getElementById('trade-limit-text').textContent = `交易 ${this.trading.tradeCount}/${this.levelConfig.maxTrades > 100 ? '∞' : this.levelConfig.maxTrades}`;

            // Position
            document.getElementById('pos-shares').textContent = `${this.trading.shares} 股`;
            if (this.trading.shares > 0) {
                document.getElementById('pos-cost').textContent = `¥${this.trading.avgCost.toFixed(2)}`;
                const pnl = (price - this.trading.avgCost) * this.trading.shares;
                const pnlEl = document.getElementById('pos-pnl');
                pnlEl.textContent = `${pnl >= 0 ? '+' : ''}¥${pnl.toFixed(0)}`;
                pnlEl.style.color = pnl >= 0 ? 'var(--up)' : 'var(--down)';
            } else {
                document.getElementById('pos-cost').textContent = '--';
                document.getElementById('pos-pnl').textContent = '--';
                document.getElementById('pos-pnl').style.color = '';
            }

            // Target progress
            const progress = Math.max(0, Math.min(100, (profitRate / this.levelConfig.targetProfit) * 100));
            document.getElementById('target-progress-bar').style.width = `${progress}%`;
        }
    }

    renderSignals(signals) {
        const list = document.getElementById('signal-list');
        if (!signals || signals.length === 0) {
            list.innerHTML = '<div class="empty-hint">暂无信号</div>';
            return;
        }
        list.innerHTML = signals.map(s => {
            const cls = s.type.includes('BUY') ? 'buy' : s.type === 'SELL' ? 'sell' : s.type === 'HOLD' ? 'hold' : s.type === 'WARNING' ? 'warn' : 'event';
            return `<div class="signal-item signal-${cls}"><div class="signal-icon">${s.icon}</div><div><div class="signal-name">${s.name}</div><div class="signal-desc">${s.description}</div></div></div>`;
        }).join('');
    }

    renderScoreCard(score, trade) {
        const feedbackList = document.getElementById('feedback-list');
        const html = `
      <div class="score-card grade-${score.grade}">
        <div class="score-header"><span class="score-grade">${score.grade}</span><span class="score-value">${score.score}分 · ${trade.type === 'BUY' ? '买入' : '卖出'}</span></div>
        ${score.feedbacks.map(f => `<div class="fb-item fb-${f.type}">${f.text}</div>`).join('')}
      </div>`;
        feedbackList.insertAdjacentHTML('afterbegin', html);
    }

    showTradeMsg(msg, type) {
        const el = document.getElementById('trade-message');
        el.textContent = msg;
        el.className = 'trade-msg ' + type;
        setTimeout(() => { el.className = 'trade-msg'; }, 3000);
    }

    showAchievement(ach) {
        const popup = document.createElement('div');
        popup.className = 'achievement-popup';
        popup.innerHTML = `<div class="ach-icon">${ach.icon}</div><div><div class="ach-name">${ach.name}</div><div class="ach-desc">${ach.desc}</div></div>`;
        document.body.appendChild(popup);
        requestAnimationFrame(() => popup.classList.add('show'));
        setTimeout(() => { popup.classList.remove('show'); setTimeout(() => popup.remove(), 400); }, 3500);
    }

    redrawChart() {
        if (!this.priceGen || this.currentTradingDay < 0) return;
        const visibleData = this.priceGen.getVisibleData(this.currentTradingDay);
        const absIdx = this.priceGen.tradingStartIndex + this.currentTradingDay;
        this.chart.draw(visibleData, absIdx, this.indicators, this.levelConfig.unlockFeatures);
    }

    // ========== Observe Mode: Prediction ==========
    showPredictionPrompt(dayData) {
        const nextDay = this.priceGen.getTradingDayData(this.currentTradingDay + 1);
        if (!nextDay) return;

        const modal = document.getElementById('teaching-modal');
        modal.className = 'teaching-overlay';
        modal.innerHTML = `
        <div class="teaching-card" style="max-width:420px">
            <div class="teaching-step-header">🔮 预测明天走势</div>
            <div class="teaching-body" style="padding:16px 20px">
                <p>今日收盘 <b>¥${dayData.close.toFixed(2)}</b>（${dayData.change >= 0 ? '+' : ''}${(dayData.change * 100).toFixed(2)}%）</p>
                <p style="margin:8px 0;font-size:14px;color:#9ca3af">${dayData.patternDesc}</p>
                <p style="margin:12px 0"><b>你认为明天股价会？</b></p>
                <div style="display:flex;gap:12px;margin-top:16px">
                    <button class="btn btn-buy" style="flex:1;padding:12px" onclick="window._gameApp.handlePrediction('up')">📈 上涨</button>
                    <button class="btn btn-sell" style="flex:1;padding:12px" onclick="window._gameApp.handlePrediction('down')">📉 下跌</button>
                </div>
                <p style="margin-top:12px;text-align:center;font-size:13px;color:#6b7280">预测进度：${this.predictions.total}/${this.levelConfig.tradingDays - 1}，正确 ${this.predictions.correct} 次</p>
            </div>
        </div>`;
        window._gameApp = this;
    }

    handlePrediction(direction) {
        const nextDay = this.priceGen.getTradingDayData(this.currentTradingDay + 1);
        if (!nextDay) return;
        const actual = nextDay.change >= 0 ? 'up' : 'down';
        const correct = direction === actual;
        this.predictions.total++;
        if (correct) this.predictions.correct++;

        const modal = document.getElementById('teaching-modal');
        const resultEmoji = correct ? '✅' : '❌';
        const resultText = correct ? '预测正确！' : '预测错误';
        modal.innerHTML = `
        <div class="teaching-card" style="max-width:420px">
            <div class="teaching-step-header">${resultEmoji} ${resultText}</div>
            <div class="teaching-body" style="padding:16px 20px">
                <p>明天实际${actual === 'up' ? '📈 上涨' : '📉 下跌'} ${(Math.abs(nextDay.change) * 100).toFixed(2)}%</p>
                <p style="margin:8px 0;font-size:13px;color:#9ca3af">${nextDay.patternDesc}</p>
                <p style="margin-top:12px">当前准确率：<b>${this.predictions.total > 0 ? ((this.predictions.correct / this.predictions.total) * 100).toFixed(0) : 0}%</b>（${this.predictions.correct}/${this.predictions.total}）</p>
                <button class="btn-nav primary" style="width:100%;margin-top:16px;padding:12px" onclick="document.getElementById('teaching-modal').className='hidden'">继续观察 →</button>
            </div>
        </div>`;
    }

    // ========== Coach Mode: Guided Messages ==========
    showCoachMessage(dayData) {
        const scripts = this.levelConfig.coachScript;
        if (!scripts) return;
        const day = this.currentTradingDay + 1;
        const matchingScripts = scripts.filter(s => s.triggerDay === day);
        if (matchingScripts.length === 0) return;

        for (const script of matchingScripts) {
            let show = false;
            switch (script.triggerCondition) {
                case 'always': show = true; break;
                case 'price_up': show = dayData.change > 0; break;
                case 'holding': show = this.trading.shares > 0; break;
                case 'no_position': show = this.trading.shares === 0; break;
            }
            if (!show) continue;

            const msg = script.message.replace(/\n/g, '<br>');
            const feedbackList = document.getElementById('feedback-list');
            feedbackList.insertAdjacentHTML('afterbegin', `
                <div class="score-card grade-A" style="border-left:3px solid #3b82f6">
                    <div class="score-header"><span class="score-grade" style="background:#3b82f6">🤝</span><span class="score-value">教练提示</span></div>
                    <div class="fb-item fb-good" style="font-size:14px;line-height:1.6">${msg}</div>
                </div>`);

            if (script.action === 'suggest_buy') {
                this.showTradeMsg(`💡 教练建议：买入${script.suggestShares || 100}股`, 'success');
                document.getElementById('trade-shares').value = script.suggestShares || 100;
            } else if (script.action === 'suggest_sell') {
                this.showTradeMsg('💡 教练建议：卖出持仓', 'success');
            }
            break; // show only first matching script per day
        }
    }
}

// Boot
window.addEventListener('DOMContentLoaded', () => new GameApp());
