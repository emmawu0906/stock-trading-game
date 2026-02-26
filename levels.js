/**
 * levels.js — 10关教学配置 + 真实K线数据生成
 * 价格区间模拟德明利(001309): 191-308
 */

const LEVEL_CONFIGS = [
    // ===== 第1关：认识市场 — 学会"看" =====
    {
        id: 1,
        title: '认识市场',
        subtitle: '学会"看"K线',
        mode: 'trade',
        targetProfit: 0,
        maxTrades: 6,
        tradingDays: 10,
        initialPrice: 250,
        initialCash: 100000,
        unlockFeatures: [],
        passCondition: { type: 'prediction', minAccuracy: 0.6 },
        badge: '🏆 敏锐观察者',
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
<p>德明利是做<span class="hl">存储芯片</span>的公司，你买入它的股票，就拥有了公司的一部分。</p>
<div class="teach-box">
<p>✅ <b>重点理解：</b></p>
<ul>
<li>股价 = 市场对公司价值的看法</li>
<li>股价波动 = 买卖双方的力量博弈</li>
<li>你的目标：低价买入，高价卖出</li>
</ul>
</div>`,
            },
            {
                title: '📊 K线图基础',
                content: `<div class="candle-demo">
<div class="candle-group">
  <div class="candle-item up"><div class="candle-wick"></div><div class="candle-body"></div><div class="candle-wick-bottom"></div><div class="candle-label">阳线（红色）</div><div class="candle-meaning">收盘 > 开盘 = 上涨</div></div>
  <div class="candle-item down"><div class="candle-wick"></div><div class="candle-body"></div><div class="candle-wick-bottom"></div><div class="candle-label">阴线（绿色）</div><div class="candle-meaning">收盘 < 开盘 = 下跌</div></div>
  <div class="candle-item doji"><div class="candle-wick"></div><div class="candle-body"></div><div class="candle-wick-bottom"></div><div class="candle-label">十字星</div><div class="candle-meaning">开盘 ≈ 收盘 = 观望</div></div>
</div></div>
<div class="teach-box">
<p>📈 <b>实体部分</b>：开盘价到收盘价的波动</p>
<p>📍 <b>上下影线</b>：盘中最高价和最低价的波动</p>
</div>`,
            },
            {
                title: '🔍 如何读一根K线',
                content: `<div class="teach-box">
<p>💡 <b>K线告诉你4个关键信息：</b></p>
<ul>
<li><b>大阳线</b>（涨幅>2%）= 买方强势，持续看涨</li>
<li><b>大阴线</b>（跌幅>2%）= 卖方强势，谨慎观望</li>
<li><b>长上影线</b> = 上方有抛压，涨到高位有人卖</li>
<li><b>长下影线</b> = 下方有支撑，跌到低位有人买</li>
<li><b>十字星</b> = 多空平衡，方向将变</li>
</ul>
</div>
<div class="teach-box yellow">
<p>⚠️ <b>记住</b>：一根K线只是一天的故事，要结合多天一起看！</p>
</div>`,
            },
        ],
        quiz: [
            { question: '德明利今天开盘250元，收盘255元，这根K线是什么颜色？', options: ['红色阳线', '绿色阴线', '十字星'], answer: 0, explanation: '因为收盘价 255元 > 开盘价 250元，股价上涨，所以是红色阳线。' },
            { question: '一根K线带很长的上影线，说明什么？', options: ['上方有抛压，涨到高位有人卖出', '下方有支撑', '成交量很大'], answer: 0, explanation: '长上影线意味着股价盘中冲高后被打回，说明高位有抛售压力。' },
        ],
        phases: [
            { days: 2, trend: 'up', strength: 0.015, volProfile: 'normal', desc: '温和上涨——买方逐步进场' },
            { days: 1, trend: 'up', strength: 0.025, volProfile: 'high', desc: '放量上涨——资金加速流入' },
            { days: 1, trend: 'down', strength: 0.008, volProfile: 'low', desc: '小幅回调——正常获利了结' },
            { days: 2, trend: 'up', strength: 0.02, volProfile: 'normal', desc: '回调后继续涨——趋势不变' },
            { days: 1, trend: 'down', strength: 0.035, volProfile: 'surge', desc: '突然下跌——市场有风险！' },
            { days: 1, trend: 'up', strength: 0.018, volProfile: 'normal', desc: '反弹——跌多了会弹' },
            { days: 1, trend: 'flat', strength: 0.005, volProfile: 'low', desc: '震荡——方向不明' },
            { days: 1, trend: 'up', strength: 0.03, volProfile: 'surge', desc: '放量上涨——新一波行情' },
        ],
    },

    // ===== 第2关：第一笔交易 — 学会"做" =====
    {
        id: 2,
        title: '第一笔交易',
        subtitle: '学会买入和卖出',
        mode: 'coach', // 教练带做模式
        targetProfit: 0,
        maxTrades: 10,
        tradingDays: 10,
        initialPrice: 240,
        initialCash: 100000,
        unlockFeatures: ['volume'],
        passCondition: { type: 'trades', minTrades: 3 },
        badge: '🏆 初出茅庐',
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
</div>`,
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
            {
                title: '🎯 怎么做一笔交易',
                content: `<div class="teach-box green">
<h4>买入操作</h4>
<p>1. 选择买入数量（100股起步）</p>
<p>2. 点击【买入】按钮</p>
<p>3. 买入后，点【下一天】看股价变化</p>
</div>
<div class="teach-box red">
<h4>卖出操作</h4>
<p>1. 选择卖出数量</p>
<p>2. 点击【卖出】按钮</p>
<p>3. 卖出差价 = 你的盈利/亏损</p>
</div>
<div class="teach-box yellow">
<p>⚠️ <b>A股T+1规则</b>：今天买的股票明天才能卖</p>
</div>`,
            },
        ],
        quiz: [
            { question: '今天德明利放量上涨3%，说明什么？', options: ['资金积极买入，上涨有支持', '上涨即将结束', '没有参考意义'], answer: 0, explanation: '放量上涨 = 量增价涨，是最健康的上涨模式。' },
            { question: '你买了100股@250元，卖出@260元，大约赚多少？', options: ['约¥1000', '约¥2600', '约¥100'], answer: 0, explanation: '(260-250)×100 = ¥1000，扣除少量手续费后约¥980。' },
        ],
        coachScript: [
            { triggerDay: 1, triggerCondition: 'always', message: '📊 注意观察今天的K线和成交量。先不急着操作，看看市场怎么走。' },
            { triggerDay: 2, triggerCondition: 'price_up', message: '📈 连续上涨+成交量放大！这是一个不错的买入信号。\n点击【买入】，先买100股试试水。', action: 'suggest_buy', suggestShares: 100 },
            { triggerDay: 3, triggerCondition: 'holding', message: '👍 你的股票在涨！持仓盈利中。别着急卖，好的交易需要耐心。' },
            { triggerDay: 4, triggerCondition: 'holding', message: '⚠️ 注意！今天出现了一些卖出信号。\n建议卖出获利了结。点击【卖出】。', action: 'suggest_sell' },
            { triggerDay: 5, triggerCondition: 'no_position', message: '🔄 回调中，等待下一个买入机会。耐心是交易者最好的朋友。' },
            { triggerDay: 6, triggerCondition: 'price_up', message: '📈 信号再次出现！这次你自己判断一下，要不要买入？\n提示：看看量价关系。', action: 'hint_buy' },
            { triggerDay: 8, triggerCondition: 'holding', message: '🤔 这次你自己判断什么时候卖出。\n提示：观察K线形态和成交量变化。' },
            { triggerDay: 10, triggerCondition: 'always', message: '🎓 最后一天了！如果还有持仓，考虑是否要清仓。' },
        ],
        phases: [
            { days: 1, trend: 'flat', strength: 0.005, volProfile: 'normal', desc: '开盘观察——market平稳' },
            { days: 2, trend: 'up', strength: 0.025, volProfile: 'high', desc: '放量上涨——买入机会' },
            { days: 1, trend: 'down', strength: 0.015, volProfile: 'normal', desc: '小幅回调——卖出时机' },
            { days: 1, trend: 'down', strength: 0.008, volProfile: 'low', desc: '缩量调整——等待' },
            { days: 2, trend: 'up', strength: 0.03, volProfile: 'high', desc: '再次上涨——第二次机会' },
            { days: 1, trend: 'flat', strength: 0.005, volProfile: 'normal', desc: '震荡——持有观望' },
            { days: 2, trend: 'up', strength: 0.02, volProfile: 'normal', desc: '温和上涨——第三次机会' },
        ],
    },

    // ===== 第3关：仓位管理 — 学会"控制" =====
    {
        id: 3,
        title: '仓位管理',
        subtitle: '学会分批建仓',
        mode: 'trade',
        targetProfit: 0.01,
        maxTrades: 10,
        tradingDays: 10,
        initialPrice: 235,
        initialCash: 100000,
        unlockFeatures: ['volume', 'ma5', 'ma10'],
        passCondition: { type: 'position_score', minScore: 70 },
        positionLimit: 0.3, // 单次最大30%
        badge: '🏆 仓位大师',
        tips: [
            '单次买入不超过总资金的30%',
            '试仓(10%) → 确认加仓(20%) → 强信号再加(30%)',
            '永远留20%以上现金应对突发',
            '不同信号强度匹配不同仓位',
        ],
        lessons: [
            {
                title: '⚖️ 为什么不能All-in？',
                content: `<div class="teach-box red">
<h4>❌ 满仓的风险</h4>
<ul>
<li>跌了 → 无法补仓，只能干瞪眼</li>
<li>更好的机会来了 → 没钱买</li>
<li>心理压力大 → 容易做出错误决策</li>
</ul>
</div>
<div class="teach-box green">
<h4>✅ 分批建仓的好处</h4>
<ul>
<li>跌了 → 有钱补仓摊低成本</li>
<li>涨了 → 已有仓位在赚钱</li>
<li>心态平稳 → 决策更理性</li>
</ul>
</div>`,
            },
            {
                title: '📐 仓位三分法',
                content: `<div class="teach-box">
<h4>仓位管理策略</h4>
<div class="position-bar">
<div class="pos-seg pos-base">底仓 30%</div>
<div class="pos-seg pos-add">追仓 30%</div>
<div class="pos-seg pos-reserve">机动 40%</div>
</div>
<ul>
<li><b>底仓(30%)</b>：信号出现时的第一批买入</li>
<li><b>追仓(30%)</b>：趋势确认后加仓</li>
<li><b>机动(40%)</b>：极佳机会或留作防守</li>
</ul>
</div>`,
            },
        ],
        quiz: [
            { question: '你有10万资金，看到一个买入信号，应该买多少？', options: ['先买1-3万（试仓）', '全部买入（满仓）', '不买'], answer: 0, explanation: '先用10-30%资金试仓，等信号确认后再加仓。这样即使判断错误，损失也有限。' },
            { question: '为什么满仓操作不好？', options: ['没有余地应对下跌或更好的机会', '手续费太高', '不符合规定'], answer: 0, explanation: '满仓=没有后手。如果跌了无法补仓，如果有更好的机会没钱买。' },
        ],
        phases: [
            { days: 2, trend: 'up', strength: 0.015, volProfile: 'normal', desc: '温和上涨——试仓机会' },
            { days: 1, trend: 'down', strength: 0.012, volProfile: 'low', desc: '小幅回调——补仓机会' },
            { days: 2, trend: 'up', strength: 0.03, volProfile: 'high', desc: '放量上涨——加仓确认' },
            { days: 1, trend: 'down', strength: 0.02, volProfile: 'normal', desc: '获利回吐——减仓信号' },
            { days: 2, trend: 'flat', strength: 0.008, volProfile: 'low', desc: '震荡整理——观望' },
            { days: 2, trend: 'up', strength: 0.025, volProfile: 'high', desc: '方向明确——趋势延续' },
        ],
    },

    // ===== 第4关：止损纪律 — 学会"认输" =====
    {
        id: 4,
        title: '止损纪律',
        subtitle: '学会保护本金',
        mode: 'trade',
        targetProfit: 0,
        maxTrades: 10,
        tradingDays: 12,
        initialPrice: 248,
        initialCash: 100000,
        unlockFeatures: ['volume', 'ma5', 'ma10', 'ma20'],
        passCondition: { type: 'stoploss', minTrades: 5, allHaveStopLoss: true },
        requireStopLoss: true,
        badge: '🏆 纪律先锋',
        tips: [
            '买入时必须设止损（默认-5%）',
            '止损不是认输，是保护自己',
            '10次交易亏6次也能赚钱，关键亏小赚大',
            '设好止损就严格执行，不要取消',
        ],
        lessons: [
            {
                title: '🛡️ 止损——交易者的安全带',
                content: `<div class="teach-box">
<p>💡 <b>为什么止损是最重要的技能？</b></p>
<table class="compare-table">
<tr><th>情况</th><th>不止损</th><th>止损-5%</th></tr>
<tr><td>股价跌10%</td><td>亏损¥10,000</td><td>亏损¥5,000</td></tr>
<tr><td>股价跌20%</td><td>亏损¥20,000</td><td>亏损¥5,000</td></tr>
<tr><td>股价跌50%</td><td>亏损¥50,000</td><td>亏损¥5,000</td></tr>
</table>
<p>⚠️ 不止损，一次大亏就能抹掉10次小赚的利润！</p>
</div>`,
            },
            {
                title: '📐 止损位怎么设？',
                content: `<div class="teach-box green">
<h4>常用止损方法</h4>
<ul>
<li><b>百分比止损</b>：买入价下方5-8%</li>
<li><b>均线止损</b>：跌破10日均线</li>
<li><b>前低止损</b>：跌破前期低点</li>
</ul>
</div>
<div class="teach-box yellow">
<p>💡 <b>"止损被打后又涨回来了"怎么办？</b></p>
<p>这很正常！纪律比个案重要。10次止损中有3次能救你避开大跌(>15%)，这3次节省的钱远超7次误止损的损失。</p>
</div>`,
            },
        ],
        quiz: [
            { question: '你250元买入，止损设在237.5元（-5%），这意味着？', options: ['跌到237.5系统自动卖出，最多亏5%', '永远不会亏损', '股价不会跌破这个价'], answer: 0, explanation: '止损是你设定的"最大亏损底线"。触发后自动卖出，保护剩余本金。' },
            { question: '止损触发后股价又涨回来了，说明止损设错了吗？', options: ['不是，纪律比个案重要', '是的，不该设止损', '应该设更低的止损'], answer: 0, explanation: '个别止损被打掉是正常代价，长期来看止损纪律能保护你的大部分本金。' },
        ],
        phases: [
            { days: 3, trend: 'up', strength: 0.02, volProfile: 'high', desc: '上涨——建仓机会' },
            { days: 3, trend: 'down', strength: 0.025, volProfile: 'surge', desc: '连续下跌——止损测试！' },
            { days: 1, trend: 'down', strength: 0.02, volProfile: 'normal', desc: '继续跌——止损是对的' },
            { days: 2, trend: 'up', strength: 0.03, volProfile: 'high', desc: '反弹——新的买入机会' },
            { days: 2, trend: 'up', strength: 0.015, volProfile: 'normal', desc: '温和上涨——持有' },
            { days: 1, trend: 'down', strength: 0.01, volProfile: 'low', desc: '小幅回调——不触止损' },
        ],
    },

    // ===== 第5关：择时等待 — 学会"忍" =====
    {
        id: 5,
        title: '择时等待',
        subtitle: '等待最好的机会',
        mode: 'trade',
        targetProfit: 0.05,
        maxTrades: 10,
        tradingDays: 12,
        initialPrice: 230,
        initialCash: 100000,
        unlockFeatures: ['volume', 'ma5', 'ma10', 'ma20'],
        passCondition: { type: 'winrate', minWinRate: 0.5, minProfitRatio: 1.5 },
        showSignalPanel: true,
        badge: '🏆 耐心猎手',
        tips: [
            '不是每天都要交易，等待是最重要的能力',
            '1个信号=观望，2个=可试仓，3个共振=可加仓',
            '量价配合 + 均线趋势 + 技术形态 = 三信号共振',
            '宁可错过，不要做错',
        ],
        lessons: [
            {
                title: '⏳ 等待——最被低估的能力',
                content: `<div class="teach-box">
<p>💡 巴菲特说：<i>"投资的关键是等好球来了再挥棒"</i></p>
<p>大部分时间，市场没有明确方向。<b>90%的时间应该等待，只在10%的好机会出手。</b></p>
</div>
<div class="teach-box red">
<h4>❌ 冲动交易的代价</h4>
<p>频繁操作 → 手续费累积 → 增加出错概率 → 心态崩坏</p>
</div>`,
            },
            {
                title: '📡 信号共振系统',
                content: `<div class="teach-box">
<h4>三维信号判断</h4>
<ul>
<li>📊 <b>量价关系</b>：放量上涨？缩量下跌？</li>
<li>📈 <b>均线趋势</b>：MA5>MA10>MA20？多头排列？</li>
<li>🔧 <b>技术形态</b>：突破压力位？底部反转？</li>
</ul>
</div>
<div class="signal-levels">
<div class="sig-item sig-1">★☆☆ 1个信号 → 观望不动</div>
<div class="sig-item sig-2">★★☆ 2个信号 → 可以试仓(10-20%)</div>
<div class="sig-item sig-3">★★★ 3个共振 → 可以加仓(30-50%)</div>
</div>`,
            },
        ],
        quiz: [
            { question: '连续5天震荡无方向，你应该？', options: ['空仓等待', '猜涨买入', '猜跌卖空'], answer: 0, explanation: '方向不明时不出手，等待明确信号。耐心是交易者最重要的品质。' },
            { question: '放量突破+均线多头+MACD金叉同时出现，说明什么？', options: ['三信号共振，强买入机会', '只是巧合', '应该卖出'], answer: 0, explanation: '多个指标同时发出买入信号叫"共振"，这是概率最高的买入时机。' },
        ],
        phases: [
            { days: 3, trend: 'flat', strength: 0.006, volProfile: 'low', desc: '震荡无方向——考验耐心' },
            { days: 1, trend: 'up', strength: 0.035, volProfile: 'surge', desc: '放量突破！好机会来了' },
            { days: 2, trend: 'up', strength: 0.025, volProfile: 'high', desc: '趋势确认——持有' },
            { days: 1, trend: 'down', strength: 0.02, volProfile: 'normal', desc: '冲高回落——止盈信号' },
            { days: 3, trend: 'flat', strength: 0.005, volProfile: 'low', desc: '再次震荡——又要等' },
            { days: 2, trend: 'up', strength: 0.03, volProfile: 'high', desc: '第二波行情——机会再现' },
        ],
    },

    // ===== 第6关：市场判势 =====
    {
        id: 6, title: '市场判势', subtitle: '识别牛熊震荡', mode: 'trade',
        targetProfit: 0.01, maxTrades: 12, tradingDays: 15, initialPrice: 240, initialCash: 100000,
        unlockFeatures: ['volume', 'ma5', 'ma10', 'ma20', 'ma30'],
        passCondition: { type: 'trend_score', minScore: 70 },
        showTrendPanel: true, badge: '🏆 趋势骑手',
        tips: ['MA5>MA10>MA20 = 多头排列（上涨趋势）', 'MA5<MA10<MA20 = 空头排列（下跌趋势）', '牛市重仓，熊市轻仓，震荡半仓', '顺势而为，不要逆势抄底'],
        lessons: [
            { title: '🌊 三种市场状态', content: `<div class="teach-box green"><h4>🟢 上涨趋势</h4><p style="font-family:monospace">股价 > MA5 > MA10 > MA20</p><p>策略：<b>持股为主，逢低加仓</b></p></div><div class="teach-box red"><h4>🔴 下跌趋势</h4><p style="font-family:monospace">股价 < MA5 < MA10 < MA20</p><p>策略：<b>空仓观望，不抄底</b></p></div><div class="teach-box yellow"><h4>🟡 震荡整理</h4><p>均线缠绕，方向不明</p><p>策略：<b>轻仓或空仓等突破</b></p></div>` },
            { title: '📏 均线系统', content: `<div class="teach-box"><ul><li><span style="color:#eab308">■</span> <b>5日均线</b> = 短期趋势</li><li><span style="color:#3b82f6">■</span> <b>10日均线</b> = 短中期趋势</li><li><span style="color:#ec4899">■</span> <b>20日均线</b> = 中期趋势</li><li><span style="color:#8b5cf6">■</span> <b>30日均线</b> = 中长期趋势</li></ul><p>💡 股价在均线上方=近期买入者盈利；跌破均线=近期买入者亏损。</p></div>` },
        ],
        quiz: [
            { question: 'MA5>MA10>MA20且股价在所有均线之上，应该？', options: ['持股或逢低买入', '赶紧卖出', '空仓等待'], answer: 0, explanation: '多头排列=上涨趋势明确。' },
            { question: '下跌趋势中股价突然涨了一天，应该？', options: ['不追涨，可能是反弹陷阱', '追入', '无影响'], answer: 0, explanation: '下跌趋势中的单日反弹叫"死猫弹"。' },
        ],
        phases: [
            { days: 5, trend: 'up', strength: 0.02, volProfile: 'high', desc: '上涨趋势——均线多头排列' },
            { days: 2, trend: 'down', strength: 0.015, volProfile: 'normal', desc: '趋势转换——均线走平' },
            { days: 3, trend: 'down', strength: 0.025, volProfile: 'high', desc: '下跌趋势——空头排列' },
            { days: 2, trend: 'flat', strength: 0.008, volProfile: 'low', desc: '底部震荡——等信号' },
            { days: 3, trend: 'up', strength: 0.03, volProfile: 'surge', desc: '趋势反转——新一轮上涨' },
        ],
    },

    // ===== 第7关：对抗贪婪 =====
    {
        id: 7, title: '对抗贪婪', subtitle: '保住利润', mode: 'trade',
        targetProfit: 0.08, maxTrades: 10, tradingDays: 12, initialPrice: 225, initialCash: 100000,
        unlockFeatures: ['volume', 'ma5', 'ma10', 'ma20', 'ma30', 'macd'],
        passCondition: { type: 'takeprofit_score', minProfit: 0.08, minScore: 70 },
        badge: '🏆 利润守护者',
        tips: ['赚10%后止损上移到成本价', '分批止盈：涨10%卖1/3，涨15%再卖1/3', '"再涨一点再卖"是贪婪的开始', '落袋为安 > 纸上富贵'],
        lessons: [
            { title: '💰 贪婪如何让人亏钱', content: `<div class="teach-box red"><h4>💸 典型过程</h4><ol><li>涨10%，"再涨一点"</li><li>涨15%，"还能涨！"</li><li>开始回落，"只是调整"</li><li>跌回成本，"等涨回来"</li><li>继续跌，亏损卖出…</li></ol><p>⚠️ 从赚15%到亏10%，只因不懂<b>止盈</b></p></div>` },
            { title: '🎯 止盈策略', content: `<div class="teach-box green"><h4>移动止盈</h4><p>赚10% → 止损上移到成本价（保本）</p><p>继续涨 → 止损跟涨（锁利润）</p></div><div class="teach-box green"><h4>分批止盈</h4><p>涨10%卖1/3 → 涨15%再卖1/3 → 留1/3追趋势</p></div>` },
        ],
        quiz: [
            { question: '买入后已赚12%，出现放量滞涨，应该？', options: ['至少卖出1/3锁定利润', '等更高', '全卖'], answer: 0, explanation: '放量滞涨=上涨动力减弱，部分止盈平衡贪婪和纪律。' },
            { question: '移动止盈是什么？', options: ['随股价上涨不断提高止损位', '固定目标价', '取消止损'], answer: 0, explanation: '移动止盈=保护已有利润的同时继续享受上涨。' },
        ],
        phases: [
            { days: 2, trend: 'up', strength: 0.015, volProfile: 'normal', desc: '温和建仓' },
            { days: 4, trend: 'up', strength: 0.03, volProfile: 'high', desc: '持续上涨——利润累积' },
            { days: 1, trend: 'up', strength: 0.01, volProfile: 'surge', desc: '高位放量滞涨——止盈！' },
            { days: 1, trend: 'down', strength: 0.015, volProfile: 'normal', desc: '开始回调' },
            { days: 2, trend: 'down', strength: 0.035, volProfile: 'surge', desc: '暴跌——不止盈的惩罚' },
            { days: 2, trend: 'up', strength: 0.015, volProfile: 'normal', desc: '反弹但不创新高' },
        ],
    },

    // ===== 第8关：对抗恐惧 =====
    {
        id: 8, title: '对抗恐惧', subtitle: '恐慌中寻找机会', mode: 'trade',
        targetProfit: 0.05, maxTrades: 10, tradingDays: 12, initialPrice: 255, initialCash: 100000,
        unlockFeatures: ['volume', 'ma5', 'ma10', 'ma20', 'ma30', 'macd'],
        passCondition: { type: 'fear_score', minScore: 60 },
        showPanicPrompts: true, badge: '🏆 钢铁意志',
        tips: ['"别人贪婪时恐惧，别人恐惧时贪婪"', '放量暴跌后缩量企稳=恐慌底', '长下影线=下方有买盘', '恐慌不割肉≠死扛，要看信号'],
        lessons: [
            { title: '😱 恐惧如何让人亏钱', content: `<div class="teach-box red"><h4>恐慌亏损过程</h4><ol><li>暴跌-5%，"完了！"</li><li>继续跌-3%，"赶紧割！"</li><li>卖在最低点…</li><li>第二天V形反弹+4%</li><li>一周后涨回原价</li></ol><p>⚠️ 恐慌割肉=卖在最低点=散户亏钱核心原因</p></div>` },
            { title: '🧠 恐慌中保持理性', content: `<div class="teach-box green"><h4>恐慌底识别信号</h4><ul><li>放量暴跌后成交量萎缩=卖盘枯竭</li><li>长下影线=下方有资金接盘</li><li>跌幅收窄=杀跌动能衰减</li></ul></div><div class="teach-box yellow"><p><b>恐慌下跌</b>（短期可扛）vs <b>趋势下跌</b>（要止损）<br>区别：恐慌跌得快但快速企稳；趋势下跌慢慢阴跌</p></div>` },
        ],
        quiz: [
            { question: '连跌3天后成交量萎缩+长下影线，说明？', options: ['可能是恐慌底，关注企稳', '还会跌', '无意义'], answer: 0, explanation: '放量暴跌后缩量+长下影线=经典恐慌底特征。' },
            { question: '持仓亏8%，止损设在-10%，该？', options: ['按纪律持有等止损位', '提前割', '加仓摊成本'], answer: 0, explanation: '设了止损就执行纪律，-8%没到位就不要恐慌卖出。' },
        ],
        phases: [
            { days: 3, trend: 'up', strength: 0.018, volProfile: 'normal', desc: '正常上涨' },
            { days: 2, trend: 'down', strength: 0.04, volProfile: 'surge', desc: '突然暴跌！' },
            { days: 1, trend: 'down', strength: 0.05, volProfile: 'surge', desc: '最大恐慌点' },
            { days: 2, trend: 'up', strength: 0.035, volProfile: 'high', desc: 'V形反弹！' },
            { days: 2, trend: 'up', strength: 0.02, volProfile: 'normal', desc: '恢复上涨' },
            { days: 1, trend: 'down', strength: 0.015, volProfile: 'low', desc: '小幅回调' },
            { days: 1, trend: 'up', strength: 0.02, volProfile: 'normal', desc: '企稳反弹' },
        ],
    },

    // ===== 第9关：信息解读 =====
    {
        id: 9, title: '信息解读', subtitle: '消息面分析', mode: 'trade',
        targetProfit: 0.05, maxTrades: 12, tradingDays: 15, initialPrice: 235, initialCash: 100000,
        unlockFeatures: ['volume', 'ma5', 'ma10', 'ma20', 'ma30', 'macd'],
        passCondition: { type: 'news_score', minAccuracy: 0.6 },
        showNewsSystem: true, badge: '🏆 消息猎人',
        tips: ['利好出尽是利空', '利空不跌是底部', '消息要看量价验证', '重大消息先观望别冲'],
        newsEvents: [
            { day: 2, headline: '📰 德明利季报：营收增长25%，净利润增长18%', type: 'earnings', impact: 'positive', options: ['重大利好📈', '一般', '利好出尽📉'], answer: 0, explanation: '业绩超预期是实质利好。' },
            { day: 5, headline: '📰 国家大基金三期入场，重点支持存储芯片', type: 'policy', impact: 'positive', options: ['行业利好📈', '有限', '已消化'], answer: 0, explanation: '政策+资金支持=实质性利好。' },
            { day: 8, headline: '📰 大股东拟减持不超过2%', type: 'insider', impact: 'negative', options: ['重大利空📉', '轻微利空', '不影响'], answer: 1, explanation: '2%减持=小规模轻微利空。' },
            { day: 11, headline: '📰 美国加强芯片出口管制', type: 'macro', impact: 'mixed', options: ['利空📉', '短空长多', '不影响'], answer: 1, explanation: '短期冲击但加速国产替代。' },
            { day: 14, headline: '📰 券商上调目标价至280元', type: 'analyst', impact: 'positive', options: ['利好📈', '不可信', '已反映'], answer: 0, explanation: '券商上调评级吸引机构关注。' },
        ],
        lessons: [
            { title: '📰 消息面入门', content: `<div class="teach-box"><h4>三个层面</h4><ul><li>🌍 宏观政策：利率、GDP、行业政策</li><li>🏭 行业动态：政策、竞争格局</li><li>🏢 公司公告：财报、增减持、订单</li></ul></div>` },
            { title: '🤔 利好不一定涨', content: `<div class="teach-box yellow"><h4>"利好出尽是利空"</h4><p>如果利好前股价已大涨，利好公布后可能反跌。聪明资金提前买入，消息出来反而卖出。</p></div><div class="teach-box green"><h4>"利空不跌是底部"</h4><p>坏消息出来却不跌，说明该卖的卖完了。</p></div>` },
        ],
        quiz: [
            { question: '业绩增长30%但股价高开低走放量下跌？', options: ['利好已消化，借利好出货', '业绩不好', '正常波动'], answer: 0, explanation: '"利好出尽是利空"。' },
            { question: '芯片扶持政策出台后？', options: ['观察量价再决策', '满仓冲', '不管'], answer: 0, explanation: '看市场量价反应比消息本身更重要。' },
        ],
        phases: [
            { days: 2, trend: 'up', strength: 0.015, volProfile: 'normal', desc: '温和上涨' },
            { days: 2, trend: 'up', strength: 0.035, volProfile: 'surge', desc: '财报利好——放量涨' },
            { days: 1, trend: 'down', strength: 0.01, volProfile: 'normal', desc: '消化利好' },
            { days: 2, trend: 'up', strength: 0.025, volProfile: 'high', desc: '政策利好——再涨' },
            { days: 1, trend: 'flat', strength: 0.005, volProfile: 'low', desc: '高位震荡' },
            { days: 2, trend: 'down', strength: 0.02, volProfile: 'normal', desc: '减持——回调' },
            { days: 2, trend: 'flat', strength: 0.008, volProfile: 'low', desc: '企稳' },
            { days: 1, trend: 'up', strength: 0.02, volProfile: 'normal', desc: '出口管制后反弹' },
            { days: 2, trend: 'up', strength: 0.03, volProfile: 'high', desc: '研报利好' },
        ],
    },

    // ===== 第10关：综合实战 =====
    {
        id: 10, title: '综合实战', subtitle: '完整交易系统', mode: 'trade',
        targetProfit: 0.10, maxTrades: 999, tradingDays: 20, initialPrice: 220, initialCash: 150000,
        unlockFeatures: ['volume', 'ma5', 'ma10', 'ma20', 'ma30', 'macd'],
        passCondition: { type: 'comprehensive', minProfit: 0.10, minDimensionAvg: 65 },
        requireTradePlan: true, showSixDimension: true, badge: '👑 交易大师',
        tips: ['判趋势→找入场→定仓位→设止损→定止盈→复盘', '综合运用前9关技巧', '每笔交易前写计划', '纪律是盈利的关键'],
        lessons: [
            { title: '🔧 交易系统6步法', content: `<div class="steps-flow"><div class="step-item">1️⃣ 判趋势</div><div class="step-arrow">→</div><div class="step-item">2️⃣ 找入场</div><div class="step-arrow">→</div><div class="step-item">3️⃣ 定仓位</div><div class="step-arrow">→</div><div class="step-item">4️⃣ 设止损</div><div class="step-arrow">→</div><div class="step-item">5️⃣ 定止盈</div><div class="step-arrow">→</div><div class="step-item">6️⃣ 复盘</div></div><div class="teach-box"><p>⚠️ <b>纪律是盈利的关键！</b>再好的分析没有执行力都等于零。</p></div>` },
            { title: '📋 9关能力回顾', content: `<div class="teach-box"><table class="review-table"><tr><th>关</th><th>核心能力</th></tr><tr><td>1</td><td>看懂K线</td></tr><tr><td>2</td><td>买卖操作</td></tr><tr><td>3</td><td>仓位管理</td></tr><tr><td>4</td><td>止损纪律</td></tr><tr><td>5</td><td>择时等待</td></tr><tr><td>6</td><td>识别趋势</td></tr><tr><td>7</td><td>止盈策略</td></tr><tr><td>8</td><td>克服恐惧</td></tr><tr><td>9</td><td>消息解读</td></tr></table></div>` },
        ],
        quiz: [
            { question: 'MACD金叉+放量+均线多头，最佳操作？', options: ['分批买入，设止损止盈', '全仓冲', '观望'], answer: 0, explanation: '多信号共振+分批+止损=完整交易系统。' },
            { question: '买入后亏损5%，正确做法？', options: ['果断止损', '加仓摊成本', '等反弹'], answer: 0, explanation: '严格执行止损。' },
        ],
        phases: [
            { days: 3, trend: 'down', strength: 0.012, volProfile: 'low', desc: '下跌尾声——等待' },
            { days: 2, trend: 'up', strength: 0.03, volProfile: 'surge', desc: '底部放量——入场' },
            { days: 3, trend: 'up', strength: 0.025, volProfile: 'high', desc: '上涨确立' },
            { days: 2, trend: 'down', strength: 0.015, volProfile: 'low', desc: '回调洗盘' },
            { days: 3, trend: 'up', strength: 0.04, volProfile: 'surge', desc: '主升浪' },
            { days: 2, trend: 'up', strength: 0.008, volProfile: 'surge', desc: '高位滞涨——止盈' },
            { days: 2, trend: 'down', strength: 0.035, volProfile: 'surge', desc: '暴跌——恐慌测试' },
            { days: 3, trend: 'up', strength: 0.02, volProfile: 'normal', desc: '反弹弱于前高' },
        ],
    },
];

/**
 * PriceGenerator — 生成真实K线OHLCV数据
 * 改进版：更真实的市场行为，平滑的趋势转换
 * 价格区间模拟德明利(001309): 191-308
 */
class PriceGenerator {
    constructor(config) {
        this.config = config;
        this.baseVolume = 400000 + Math.random() * 800000;
        this.historyDays = 30 + Math.floor(Math.random() * 21);
        this.dailyData = [];
        this.tradingStartIndex = 0;
        this.priceOffset = 0.75 + Math.random() * 0.20;
        this.volatilityFactor = 0.7 + Math.random() * 0.6;
        this.startMonth = Math.floor(Math.random() * 6);
        // 跟踪最近N天的收盘价用于计算均线等
        this.recentPrices = [];
        // 市场"情绪"：影响连续性
        this.momentum = 0;
        this.generate();
    }

    generate() {
        this.dailyData = [];
        this.recentPrices = [];
        this.momentum = 0;
        let price = this.config.initialPrice * this.priceOffset;
        price = Math.max(191, Math.min(308, price));
        price = this.generateHistory(price);
        this.tradingStartIndex = this.dailyData.length;
        this.generateTradingDays(price);
    }

    generateHistory(startPrice) {
        let price = startPrice;
        const historyPattern = Math.random();
        let trendBias;
        if (historyPattern < 0.3) {
            trendBias = 0.002 + Math.random() * 0.003;
        } else if (historyPattern < 0.6) {
            trendBias = -0.003 + Math.random() * 0.001;
        } else if (historyPattern < 0.8) {
            trendBias = (Math.random() - 0.5) * 0.001;
        } else {
            trendBias = 0;
        }

        for (let i = 0; i < this.historyDays; i++) {
            let bias = trendBias;
            if (historyPattern >= 0.8) {
                const mid = this.historyDays / 2;
                bias = i < mid ? -0.003 + Math.random() * 0.001 : 0.003 + Math.random() * 0.001;
                if (Math.random() < 0.5) bias = -bias;
            }
            const noise = (Math.random() - 0.48) * 0.032 * this.volatilityFactor;
            const dayReturn = bias + noise;
            // 加入momentum使历史走势更连贯
            this.momentum = this.momentum * 0.7 + dayReturn * 0.3;
            const volMulti = 0.3 + Math.random() * 1.8;
            const d = this.makeCandle(price, dayReturn, volMulti, i);
            d.isHistory = true; d.patternDesc = '';
            this.dailyData.push(d);
            this.recentPrices.push(d.close);
            price = d.close;
            price = Math.max(191, Math.min(308, price));
        }
        return price;
    }

    generateTradingDays(startPrice) {
        let price = startPrice;
        let dayCount = 0;
        const phases = this.config.phases.map(p => ({ ...p }));

        for (let pi = 0; pi < phases.length; pi++) {
            const phase = phases[pi];
            // 天数变化±1
            const phaseDays = Math.max(1, phase.days + Math.floor(Math.random() * 3) - 1);
            // 强度变化50%-150%
            const strengthMult = 0.5 + Math.random() * 1.0;
            const actualStrength = phase.strength * strengthMult;

            for (let d = 0; d < phaseDays; d++) {
                const t = d / Math.max(1, phaseDays - 1);
                let dayReturn;

                if (phase.trend === 'up') {
                    // 上涨趋势：有小概率出现调整日(15%)
                    if (Math.random() < 0.15) {
                        dayReturn = -actualStrength * 0.25 * (0.5 + Math.random() * 0.5);
                    } else {
                        dayReturn = actualStrength * (0.4 + t * 0.6);
                    }
                } else if (phase.trend === 'down') {
                    // 下跌趋势：有小概率出现反弹日(15%)
                    if (Math.random() < 0.15) {
                        dayReturn = actualStrength * 0.25 * (0.5 + Math.random() * 0.5);
                    } else {
                        dayReturn = -actualStrength * (0.4 + t * 0.6);
                    }
                } else {
                    // 震荡：在一个范围内波动，受momentum影响
                    dayReturn = (Math.random() - 0.5) * actualStrength * 2;
                    dayReturn -= this.momentum * 0.3; // 均值回归
                }

                // 加入与前一天相关的噪声（模拟惯性）
                dayReturn += this.momentum * 0.15;
                // 独立随机噪声
                dayReturn += (Math.random() - 0.5) * 0.005 * this.volatilityFactor;
                // 限制单日涨跌幅在-10%到+10%（模拟A股涨跌停板）
                dayReturn = Math.max(-0.10, Math.min(0.10, dayReturn));

                // 更新momentum
                this.momentum = this.momentum * 0.6 + dayReturn * 0.4;

                const volMulti = this.getVolMulti(phase.volProfile, dayReturn);
                const candle = this.makeCandle(price, dayReturn, volMulti, this.dailyData.length);
                candle.patternDesc = phase.desc;
                candle.isEvent = (phase.desc || '').includes('📢') || (phase.desc || '').includes('！');
                candle.tradingDay = dayCount + 1;
                this.dailyData.push(candle);
                this.recentPrices.push(candle.close);
                price = candle.close;
                price = Math.max(191, Math.min(308, price));
                dayCount++;
            }
        }
    }

    getVolMulti(profile, dayReturn) {
        const absReturn = Math.abs(dayReturn || 0);
        // 收益越大成交量越大（真实行为）
        const returnBoost = 1 + absReturn * 10;
        const noise = (Math.random() - 0.5) * 0.3;
        let base;
        switch (profile) {
            case 'surge': base = 2.0 + Math.random() * 1.5; break;
            case 'high': base = 1.2 + Math.random() * 0.8; break;
            case 'low': base = 0.3 + Math.random() * 0.3; break;
            default: base = 0.6 + Math.random() * 0.6;
        }
        return Math.max(0.2, (base + noise) * returnBoost);
    }

    makeCandle(prevClose, dayReturn, volMulti, idx) {
        const close = prevClose * (1 + dayReturn);
        const amplitude = Math.abs(dayReturn) + 0.003 + Math.random() * 0.012 * this.volatilityFactor;
        const isUp = close >= prevClose;
        const gapRatio = (Math.random() - 0.5) * 0.006 * this.volatilityFactor;
        const open = prevClose * (1 + gapRatio);
        let high, low;
        if (isUp) {
            high = Math.max(open, close) * (1 + Math.random() * amplitude * 0.6);
            low = Math.min(open, close) * (1 - Math.random() * amplitude * 0.3);
        } else {
            high = Math.max(open, close) * (1 + Math.random() * amplitude * 0.3);
            low = Math.min(open, close) * (1 - Math.random() * amplitude * 0.6);
        }
        high = Math.max(high, Math.max(open, close));
        low = Math.min(low, Math.min(open, close));
        high = Math.min(310, high); low = Math.max(190, low);
        const volume = Math.round(this.baseVolume * volMulti * (0.7 + Math.random() * 0.6));
        const change = (close - prevClose) / prevClose;

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
