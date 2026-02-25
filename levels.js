/**
 * levels.js — 5关教学配置 + 真实K线数据生成
 * 价格区间模拟德明利(001309): 191-308
 */

const LEVEL_CONFIGS = [
    {
        id: 1,
        title: '认识市场基础',
        subtitle: '学习K线图的语言',
        targetProfit: 0.05,
        maxTrades: 5,
        tradingDays: 5,
        initialPrice: 250,
        initialCash: 100000,
        unlockFeatures: [],
        learningPoints: ['candle_basic'],
        tips: [
            '红色阳线 = 收盘价 > 开盘价 = 上涨',
            '绿色阴线 = 收盘价 < 开盘价 = 下跌',
            '实体长短 = 涨跌幅度大小',
            '上下影线 = 盘中最高/最低价波动',
        ],
        lessons: [
            {
                title: '📚 股票是什么？',
                content: `<p>买股票就是成为公司的<b>"小老板"</b></p>
<p>德明利是做<span class="hl">存储芯片</span>的公司，你买入它的股票，就拥有了公司的一部分，公司赚钱你就赚钱。</p>
<div class="teach-box">
<p>✅ <b>重点理解：</b></p>
<ul>
<li>股价 = 市场对公司价值的看法</li>
<li>股价波动 = 市场看法的变化</li>
<li>你的目标：低价买入，高价卖出</li>
</ul>
</div>`,
            },
            {
                title: '📊 K线图基础',
                content: `<div class="candle-demo">
<div class="candle-group">
  <div class="candle-item up">
    <div class="candle-wick"></div>
    <div class="candle-body"></div>
    <div class="candle-wick-bottom"></div>
    <div class="candle-label">阳线（红色）</div>
    <div class="candle-meaning">收盘 > 开盘 = 上涨</div>
  </div>
  <div class="candle-item down">
    <div class="candle-wick"></div>
    <div class="candle-body"></div>
    <div class="candle-wick-bottom"></div>
    <div class="candle-label">阴线（绿色）</div>
    <div class="candle-meaning">收盘 < 开盘 = 下跌</div>
  </div>
  <div class="candle-item doji">
    <div class="candle-wick"></div>
    <div class="candle-body"></div>
    <div class="candle-wick-bottom"></div>
    <div class="candle-label">十字星</div>
    <div class="candle-meaning">开盘 ≈ 收盘 = 观望</div>
  </div>
</div>
</div>
<div class="teach-box">
<p>📈 <b>实体部分</b>：开盘价到收盘价的波动</p>
<p>📍 <b>上下影线</b>：盘中最高价和最低价的波动</p>
</div>`,
            },
        ],
        quiz: [
            {
                question: '德明利今天开盘250元，收盘255元，这根K线是什么颜色？',
                options: ['红色阳线', '绿色阴线', '十字星'],
                answer: 0,
                explanation: '因为收盘价 255元 > 开盘价 250元，股价上涨，所以是红色阳线。',
            },
            {
                question: '影线很长的K线说明什么？',
                options: ['盘中波动很大', '成交量很大', '没有任何意义'],
                answer: 0,
                explanation: '长影线意味着盘中价格波动了很多但最终回到靠近开盘/收盘的位置，说明多空力量在争夺。',
            },
        ],
        tasks: ['观察K线颜色变化', '在阳线出现时尝试买入100股'],
        phases: [
            { days: 2, trend: 'up', strength: 0.02, volProfile: 'normal', desc: '连续阳线——市场看涨' },
            { days: 1, trend: 'down', strength: 0.01, volProfile: 'normal', desc: '出现阴线——小幅回调' },
            { days: 2, trend: 'up', strength: 0.03, volProfile: 'high', desc: '大阳线出现——强势上涨' },
        ],
    },

    {
        id: 2,
        title: '成交量——市场的"心跳"',
        subtitle: '学会看量与价的关系',
        targetProfit: 0.08,
        maxTrades: 5,
        tradingDays: 8,
        initialPrice: 240,
        initialCash: 100000,
        unlockFeatures: ['volume'],
        learningPoints: ['volume_price'],
        tips: [
            '🔥 量增价涨 = 健康上涨，可跟进',
            '💀 量增价跌 = 资金出逃，考虑卖出',
            '⚠️ 量缩价涨 = 上涨缺支持，不追高',
            '🤔 量缩价跌 = 市场观望，等方向',
        ],
        lessons: [
            {
                title: '🫀 成交量是市场的"心跳"',
                content: `<p><b>成交量</b> = 股票换手的数量，反映市场的活跃程度</p>
<div class="teach-box">
<p>💡 <b>关键理解：</b></p>
<ul>
<li>成交量越大 = 市场关注度越高</li>
<li>成交量放大 = 资金正在进场或出场</li>
<li>成交量萎缩 = 市场观望</li>
</ul>
</div>
<p>📊 <b>实际应用：</b></p>
<p>德明利日成交7.73万手 ≈ 773万股<br>如果今天比昨天放量50%，说明更多资金在交易</p>`,
            },
            {
                title: '📊 量价关系的4种核心模式',
                content: `<div class="vol-matrix">
  <div class="vol-item positive"><h4>🔥 量增价涨（健康）</h4><p>真金白银推动上涨</p><p class="action buy">✅ 可以跟进</p></div>
  <div class="vol-item danger"><h4>💀 量增价跌（危险）</h4><p>资金恐慌出逃</p><p class="action sell">🛑 考虑卖出</p></div>
  <div class="vol-item warning"><h4>⚠️ 量缩价涨（警惕）</h4><p>上涨缺乏支持</p><p class="action warn">⚠️ 不要追高</p></div>
  <div class="vol-item neutral"><h4>🤔 量缩价跌（观望）</h4><p>买卖双方都观望</p><p class="action hold">👀 等待方向</p></div>
</div>`,
            },
        ],
        quiz: [
            {
                question: '今天德明利放量上涨3%，说明什么？',
                options: ['资金积极买入，上涨有支持', '上涨即将结束', '没有参考意义'],
                answer: 0,
                explanation: '放量上涨 = 量增价涨，是最健康的上涨模式，说明有真金白银在推动。',
            },
            {
                question: '股价下跌但成交量显著放大，你应该？',
                options: ['抄底买入', '观望不动', '考虑卖出'],
                answer: 2,
                explanation: '量增价跌说明大量资金在出逃，是危险信号。此时应考虑卖出避险，而非逆势抄底。',
            },
        ],
        tasks: ['找到一处"量增价涨"并买入', '在"量增价跌"时卖出'],
        phases: [
            { days: 2, trend: 'up', strength: 0.02, volProfile: 'high', desc: '放量上涨——资金积极买入' },
            { days: 2, trend: 'down', strength: 0.008, volProfile: 'low', desc: '缩量回调——属于正常洗盘' },
            { days: 2, trend: 'up', strength: 0.035, volProfile: 'surge', desc: '放量突破前高——强烈看涨信号' },
            { days: 2, trend: 'down', strength: 0.04, volProfile: 'surge', desc: '放量暴跌——资金出逃！' },
        ],
    },

    {
        id: 3,
        title: '均线——市场的"趋势线"',
        subtitle: '5日、10日、20日均线的秘密',
        targetProfit: 0.10,
        maxTrades: 8,
        tradingDays: 10,
        initialPrice: 230,
        initialCash: 100000,
        unlockFeatures: ['volume', 'ma5', 'ma10', 'ma20'],
        learningPoints: ['volume_price', 'support_pressure'],
        tips: [
            'MA5 > MA10 > MA20 = 多头排列，趋势向上',
            '回踩均线不破 = 支撑有效，可买入',
            '跌破均线 = 支撑失败，谨慎减仓',
            '均线 = 市场平均持仓成本',
        ],
        lessons: [
            {
                title: '📏 均线是市场的"平均成本"',
                content: `<p><b>均线（MA）</b>= 过去 N 天收盘价的平均值</p>
<div class="teach-box">
<ul>
<li><span style="color:#eab308">■</span> <b>5日均线</b> = 最近5天买入者的平均成本</li>
<li><span style="color:#3b82f6">■</span> <b>10日均线</b> = 最近10天买入者的平均成本</li>
<li><span style="color:#ec4899">■</span> <b>20日均线</b> = 最近20天买入者的平均成本</li>
</ul>
</div>
<p>💡 当股价在均线上方时，说明近期买入的人都在<b>盈利</b>，他们不太会卖出；<br>
当股价跌破均线时，说明近期买入的人都<b>亏损</b>，他们可能会割肉卖出。</p>`,
            },
            {
                title: '📈 均线的多空排列',
                content: `<div class="teach-box green">
<h4>✅ 多头排列（上涨趋势）</h4>
<p style="font-family:monospace">股价 > MA5 > MA10 > MA20</p>
<p>短期成本 > 中期成本 > 长期成本<br>→ 市场处于上涨趋势，<b>可以持股或逢低买入</b></p>
</div>
<div class="teach-box red">
<h4>🛑 空头排列（下跌趋势）</h4>
<p style="font-family:monospace">股价 < MA5 < MA10 < MA20</p>
<p>短期成本 < 中期成本 < 长期成本<br>→ 市场处于下跌趋势，<b>谨慎，考虑减仓</b></p>
</div>`,
            },
        ],
        quiz: [
            {
                question: '德明利当前价250，MA5=246，MA10=242，MA20=257，说明什么？',
                options: ['短期偏强但面临20日线压力', '全面看涨可以加仓', '全面看跌应该卖出'],
                answer: 0,
                explanation: '股价 > MA5 > MA10（短期偏强），但股价 < MA20（面临20日线压力），需突破257才能确认中期趋势。',
            },
            {
                question: '股价回调到10日均线附近企稳，这意味着？',
                options: ['均线支撑有效，可考虑买入', '应该立即卖出', '均线没有参考意义'],
                answer: 0,
                explanation: '均线代表持仓成本。回踩均线不破说明此处有"成本支撑"，往往是不错的买入机会。',
            },
        ],
        tasks: ['在均线多头排列时买入', '观察股价回踩均线的支撑'],
        phases: [
            { days: 3, trend: 'up', strength: 0.025, volProfile: 'high', desc: '放量上穿5日线和10日线' },
            { days: 2, trend: 'down', strength: 0.012, volProfile: 'low', desc: '回踩10日线——关键支撑' },
            { days: 3, trend: 'up', strength: 0.04, volProfile: 'surge', desc: '放量突破20日线——中期趋势扭转' },
            { days: 2, trend: 'flat', strength: 0.005, volProfile: 'normal', desc: '高位震荡整理' },
        ],
    },

    {
        id: 4,
        title: '支撑与压力',
        subtitle: '市场的"地板"和"天花板"',
        targetProfit: 0.12,
        maxTrades: 8,
        tradingDays: 12,
        initialPrice: 225,
        initialCash: 120000,
        unlockFeatures: ['volume', 'ma5', 'ma10', 'ma20', 'ma30'],
        learningPoints: ['volume_price', 'support_pressure', 'event_trading'],
        tips: [
            '前期低点 = 支撑位（地板）',
            '前期高点 = 压力位（天花板）',
            '在支撑位附近买入，风险小',
            '在压力位附近卖出，或等突破',
        ],
        lessons: [
            {
                title: '🏗️ 支撑与压力位',
                content: `<p><b>支撑位</b> = 股价难以跌破的价位，像"地板"<br>
<b>压力位</b> = 股价难以突破的价位，像"天花板"</p>
<div class="teach-box">
<p>🔑 <b>形成原因：</b></p>
<ul>
<li>支撑位 = 大量投资者在此价位买入，不愿亏损卖出</li>
<li>压力位 = 大量投资者在此价位被套，想要解套卖出</li>
</ul>
</div>
<div class="level-zones">
  <div class="zone zone-danger">🔴 压力区 260+ 前期高点/套牢区</div>
  <div class="zone zone-warn">🟡 观察区 245-260 震荡整理</div>
  <div class="zone zone-safe">🟢 支撑区 230-240 前期低点支撑</div>
</div>`,
            },
            {
                title: '📐 交易区域划分',
                content: `<div class="teach-box green">
<h4>🟢 安全买入区（支撑位附近）</h4>
<p>前期低点支撑 + 超跌反弹区<br>风险低，可以<b>分批买入</b></p>
</div>
<div class="teach-box yellow">
<h4>🟡 观察区</h4>
<p>震荡整理区域，<b>高抛低吸</b></p>
</div>
<div class="teach-box red">
<h4>🔴 风险区（压力位附近）</h4>
<p>前期高点 + 套牢区<br>需要放量突破确认，否则<b>减仓</b></p>
</div>`,
            },
        ],
        quiz: [
            {
                question: '德明利当前250元，最近支撑位240元，压力位260元。最佳操作？',
                options: ['等回调到240附近再买入', '现在立即满仓买入', '立即全部卖出'],
                answer: 0,
                explanation: '当前价位处于支撑与压力之间，距离支撑位有4%空间。等回调到支撑位附近买入，风险更低。',
            },
            {
                question: '股价放量突破前期高点260元，应该怎么做？',
                options: ['可以跟进买入', '立即卖出', '没有参考意义'],
                answer: 0,
                explanation: '放量突破压力位说明多方力量强大，前期压力变成了新的支撑，可以考虑买入。',
            },
        ],
        tasks: ['在支撑位附近买入', '在压力位附近卖出或等突破'],
        phases: [
            { days: 2, trend: 'down', strength: 0.015, volProfile: 'normal', desc: '股价回调到支撑区' },
            { days: 3, trend: 'up', strength: 0.025, volProfile: 'high', desc: '支撑有效，反弹向上' },
            { days: 2, trend: 'flat', strength: 0.005, volProfile: 'low', desc: '压力位附近震荡' },
            { days: 2, trend: 'up', strength: 0.05, volProfile: 'surge', desc: '📢 放量突破压力位！' },
            { days: 3, trend: 'down', strength: 0.02, volProfile: 'normal', desc: '获利回吐，正常调整' },
        ],
    },

    {
        id: 5,
        title: '实战交易系统',
        subtitle: '综合运用所有技巧',
        targetProfit: 0.15,
        maxTrades: 999,
        tradingDays: 15,
        initialPrice: 220,
        initialCash: 150000,
        unlockFeatures: ['volume', 'ma5', 'ma10', 'ma20', 'ma30', 'macd'],
        learningPoints: ['volume_price', 'support_pressure', 'technical_indicators', 'stop_loss', 'position_management'],
        tips: [
            'MACD金叉 + 放量 = 强买入信号',
            '设定止损位，亏损5%无条件卖出',
            '分批建仓，首次不超过30%',
            '制定交易计划再行动',
        ],
        lessons: [
            {
                title: '🔧 建立交易系统',
                content: `<p>一个完整的交易包含<b>6个步骤</b>：</p>
<div class="steps-flow">
  <div class="step-item">1️⃣ 分析趋势</div>
  <div class="step-arrow">→</div>
  <div class="step-item">2️⃣ 找入场点</div>
  <div class="step-arrow">→</div>
  <div class="step-item">3️⃣ 定仓位</div>
  <div class="step-arrow">→</div>
  <div class="step-item">4️⃣ 设止损</div>
  <div class="step-arrow">→</div>
  <div class="step-item">5️⃣ 定止盈</div>
  <div class="step-arrow">→</div>
  <div class="step-item">6️⃣ 执行复盘</div>
</div>
<div class="teach-box">
<p>⚠️ <b>纪律是盈利的关键！</b></p>
<p>再好的分析，没有执行力都等于零。<br>
设定好计划就严格执行，不被情绪左右。</p>
</div>`,
            },
            {
                title: '📊 MACD指标',
                content: `<p><b>MACD</b> = 趋势跟踪指标，帮你判断买卖时机</p>
<div class="teach-box">
<ul>
<li><span style="color:#3b82f6">■</span> <b>DIF线</b>（快线）：反映短期趋势</li>
<li><span style="color:#eab308">■</span> <b>DEA线</b>（慢线）：反映中期趋势</li>
<li>🔴🟢 <b>柱状图</b>：DIF与DEA的差值</li>
</ul>
</div>
<div class="teach-box green">
<h4>✨ 金叉（买入信号）</h4>
<p>DIF从下往上穿越DEA<br>柱状图从绿变红 → 趋势可能转为上涨</p>
</div>
<div class="teach-box red">
<h4>❌ 死叉（卖出信号）</h4>
<p>DIF从上往下穿越DEA<br>柱状图从红变绿 → 趋势可能转为下跌</p>
</div>`,
            },
        ],
        quiz: [
            {
                question: 'MACD金叉出现并且成交量放大，最佳操作是？',
                options: ['分批买入', '全仓卖出', '继续观望'],
                answer: 0,
                explanation: 'MACD金叉 + 放量 是双重确认的买入信号。分批买入可以控制风险。',
            },
            {
                question: '你买入后股价已经亏损5%，正确做法是？',
                options: ['果断止损卖出', '加仓摊低成本', '等待反弹'],
                answer: 0,
                explanation: '严格执行止损是交易纪律的核心。亏损5%止损可以保护你的本金不受更大损失。',
            },
        ],
        tasks: ['使用MACD金叉信号买入', '严格执行止损纪律'],
        phases: [
            { days: 2, trend: 'down', strength: 0.015, volProfile: 'low', desc: '缩量阴跌——下降趋势尾声' },
            { days: 2, trend: 'up', strength: 0.025, volProfile: 'high', desc: '底部放量——MACD金叉确认' },
            { days: 2, trend: 'down', strength: 0.01, volProfile: 'low', desc: '回踩确认——支撑有效' },
            { days: 3, trend: 'up', strength: 0.04, volProfile: 'surge', desc: '主升浪启动——量价齐升' },
            { days: 2, trend: 'down', strength: 0.035, volProfile: 'surge', desc: '⚠️ 放量暴跌——考验止损纪律' },
            { days: 2, trend: 'up', strength: 0.05, volProfile: 'surge', desc: '绝地反击——勇敢者的机会' },
            { days: 2, trend: 'down', strength: 0.015, volProfile: 'normal', desc: '高位震荡——见好就收' },
        ],
    },
];

/**
 * PriceGenerator — 生成真实K线OHLCV数据
 * 使用德明利真实价格区间(191-308)
 * 包含30-50天历史 + 关卡交易日
 */
class PriceGenerator {
    constructor(config) {
        this.config = config;
        // 每次随机化基础成交量
        this.baseVolume = 400000 + Math.random() * 800000;
        // 随机化历史天数 (30-50天)
        this.historyDays = 30 + Math.floor(Math.random() * 21);
        this.dailyData = [];
        this.tradingStartIndex = 0;
        // 每次随机一个"种子偏移量"，影响整体价格水平
        this.priceOffset = 0.70 + Math.random() * 0.25; // 70%-95% of initialPrice
        // 随机波动率因子 (影响每日涨跌幅)
        this.volatilityFactor = 0.7 + Math.random() * 0.6; // 0.7x - 1.3x
        // 随机化日期起始月份
        this.startMonth = Math.floor(Math.random() * 6); // 0-5月偏移
        this.generate();
    }

    generate() {
        this.dailyData = [];
        let price = this.config.initialPrice * this.priceOffset;
        // 限制在德明利真实区间 191-308
        price = Math.max(191, Math.min(308, price));
        price = this.generateHistory(price);
        this.tradingStartIndex = this.dailyData.length;
        this.generateTradingDays(price);
    }

    generateHistory(startPrice) {
        let price = startPrice;
        // 随机化历史走势模式
        const historyPattern = Math.random();
        let trendBias;
        if (historyPattern < 0.3) {
            // 上涨历史
            trendBias = 0.002 + Math.random() * 0.003;
        } else if (historyPattern < 0.6) {
            // 下跌历史
            trendBias = -0.003 + Math.random() * 0.001;
        } else if (historyPattern < 0.8) {
            // 震荡历史
            trendBias = (Math.random() - 0.5) * 0.001;
        } else {
            // V形/倒V形
            trendBias = 0;
        }

        for (let i = 0; i < this.historyDays; i++) {
            let bias = trendBias;
            // V形/倒V形模式
            if (historyPattern >= 0.8) {
                const mid = this.historyDays / 2;
                bias = i < mid ? -0.003 + Math.random() * 0.001 : 0.003 + Math.random() * 0.001;
                if (Math.random() < 0.5) bias = -bias; // 随机翻转
            }
            // 随机波动
            const noise = (Math.random() - 0.48) * 0.032 * this.volatilityFactor;
            const dayReturn = bias + noise;
            const volMulti = 0.3 + Math.random() * 1.8;
            const d = this.makeCandle(price, dayReturn, volMulti, i);
            d.isHistory = true; d.patternDesc = '';
            this.dailyData.push(d);
            price = d.close;
            // 限制价格区间
            price = Math.max(191, Math.min(308, price));
        }
        return price;
    }

    generateTradingDays(startPrice) {
        let price = startPrice;
        let dayCount = 0;

        // 随机打乱phase的某些属性，但保留教学意义
        const phases = this.randomizePhases(this.config.phases);

        for (const phase of phases) {
            // 随机化每个phase的天数 (±1天, 最少1天)
            const phaseDays = Math.max(1, phase.days + Math.floor(Math.random() * 3) - 1);
            // 随机化phase强度 (50%-160%)
            const strengthMult = 0.5 + Math.random() * 1.1;
            const actualStrength = phase.strength * strengthMult;

            for (let d = 0; d < phaseDays; d++) {
                const t = d / Math.max(1, phaseDays - 1);
                let dayReturn;

                if (phase.trend === 'up') {
                    // 上涨趋势中加入随机反转日 (20%概率出现小阴线)
                    if (Math.random() < 0.2) {
                        dayReturn = -actualStrength * 0.3 * Math.random();
                    } else {
                        dayReturn = actualStrength * (0.3 + t * 0.7) + (Math.random() - 0.35) * 0.012 * this.volatilityFactor;
                    }
                } else if (phase.trend === 'down') {
                    // 下跌趋势中加入随机反弹日 (20%概率出现小阳线)
                    if (Math.random() < 0.2) {
                        dayReturn = actualStrength * 0.3 * Math.random();
                    } else {
                        dayReturn = -actualStrength * (0.3 + t * 0.7) + (Math.random() - 0.65) * 0.012 * this.volatilityFactor;
                    }
                } else {
                    // 震荡加入更大随机性
                    dayReturn = (Math.random() - 0.5) * actualStrength * 3;
                }

                // 额外随机噪声
                dayReturn += (Math.random() - 0.5) * 0.006 * this.volatilityFactor;

                const volMulti = this.getVolMulti(phase.volProfile);
                const candle = this.makeCandle(price, dayReturn, volMulti, this.dailyData.length);
                candle.patternDesc = phase.desc;
                candle.isEvent = (phase.desc || '').includes('📢');
                candle.tradingDay = dayCount + 1;
                this.dailyData.push(candle);
                price = candle.close;
                // 限制价格区间
                price = Math.max(191, Math.min(308, price));
                dayCount++;
            }

            // 30%概率在phase之间插入1-2天随机"噪声"交易日
            if (Math.random() < 0.3) {
                const noiseDays = 1 + Math.floor(Math.random() * 2);
                for (let n = 0; n < noiseDays; n++) {
                    const noiseReturn = (Math.random() - 0.5) * 0.02 * this.volatilityFactor;
                    const noiseVol = 0.6 + Math.random() * 1.0;
                    const noiseCandle = this.makeCandle(price, noiseReturn, noiseVol, this.dailyData.length);
                    noiseCandle.patternDesc = noiseReturn >= 0 ? '震荡整理——多空博弈' : '窄幅波动——方向未明';
                    noiseCandle.tradingDay = dayCount + 1;
                    this.dailyData.push(noiseCandle);
                    price = noiseCandle.close;
                    price = Math.max(191, Math.min(308, price));
                    dayCount++;
                }
            }
        }
    }

    /** 随机化phase配置，保留教学含义但改变具体数值 */
    randomizePhases(originalPhases) {
        return originalPhases.map(phase => {
            const p = { ...phase };
            // 10%概率插入一个"假信号"——弱趋势随机翻转方向
            if (p.strength <= 0.015 && Math.random() < 0.1) {
                p.trend = p.trend === 'up' ? 'down' : p.trend === 'down' ? 'up' : p.trend;
            }
            return p;
        });
    }

    getVolMulti(profile) {
        // 增加成交量随机性
        const noise = (Math.random() - 0.5) * 0.4;
        switch (profile) {
            case 'surge': return Math.max(1.5, 2.0 + Math.random() * 2.0 + noise);
            case 'high': return Math.max(1.0, 1.2 + Math.random() * 1.0 + noise);
            case 'low': return Math.max(0.2, 0.3 + Math.random() * 0.4 + noise);
            default: return Math.max(0.3, 0.6 + Math.random() * 0.8 + noise);
        }
    }

    makeCandle(prevClose, dayReturn, volMulti, idx) {
        const close = prevClose * (1 + dayReturn);
        // 增加振幅随机性
        const amplitude = Math.abs(dayReturn) + 0.003 + Math.random() * 0.015 * this.volatilityFactor;
        const isUp = close >= prevClose;
        // 更大的跳空随机性
        const gapRatio = (Math.random() - 0.5) * 0.008 * this.volatilityFactor;
        const open = prevClose * (1 + gapRatio);
        let high, low;
        if (isUp) {
            high = Math.max(open, close) * (1 + Math.random() * amplitude * 0.8);
            low = Math.min(open, close) * (1 - Math.random() * amplitude * 0.4);
        } else {
            high = Math.max(open, close) * (1 + Math.random() * amplitude * 0.4);
            low = Math.min(open, close) * (1 - Math.random() * amplitude * 0.8);
        }
        high = Math.max(high, Math.max(open, close));
        low = Math.min(low, Math.min(open, close));
        // 限制OHLC在德明利区间
        high = Math.min(310, high); low = Math.max(190, low);
        const volume = Math.round(this.baseVolume * volMulti * (0.7 + Math.random() * 0.6));
        const change = (close - prevClose) / prevClose;

        // 日期生成
        const baseDate = new Date(2025, 7 + this.startMonth, 1);
        let daysToAdd = idx;
        let weekends = Math.floor(daysToAdd / 5) * 2;
        const realDate = new Date(baseDate);
        realDate.setDate(realDate.getDate() + daysToAdd + weekends);
        if (realDate.getDay() === 0) realDate.setDate(realDate.getDate() + 1);
        if (realDate.getDay() === 6) realDate.setDate(realDate.getDate() + 2);
        const dateStr = `${realDate.getFullYear()}/${String(realDate.getMonth() + 1).padStart(2, '0')}/${String(realDate.getDate()).padStart(2, '0')}`;

        return {
            index: idx, date: dateStr,
            open: +open.toFixed(2), high: +high.toFixed(2), low: +low.toFixed(2), close: +close.toFixed(2),
            volume, volumeMulti: +volMulti.toFixed(2), change: +change.toFixed(4),
            amount: Math.round(volume * close), isEvent: false, patternDesc: '', isHistory: false, tradingDay: 0,
        };
    }

    getTradingDayData(tradingDayIdx) {
        const absIdx = this.tradingStartIndex + tradingDayIdx;
        return absIdx < this.dailyData.length ? this.dailyData[absIdx] : null;
    }

    getVisibleData(tradingDayIdx) {
        const endIdx = this.tradingStartIndex + tradingDayIdx + 1;
        return this.dailyData.slice(0, endIdx);
    }

    getTotalTradingDays() { return this.dailyData.length - this.tradingStartIndex; }
}
