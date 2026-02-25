/**
 * chart.js — 仿新浪财经/东方财富 真实K线图
 * 主图: K线蜡烛 + MA5/10/20/30
 * 副图1: 成交量柱 + 量MA5/MA10
 * 副图2: MACD (DIF/DEA/柱状图)
 */
class StockChart {
    constructor(mainId, volId, macdId) {
        this.mainCanvas = document.getElementById(mainId);
        this.volCanvas = document.getElementById(volId);
        this.macdCanvas = document.getElementById(macdId);
        this.ctx = this.mainCanvas.getContext('2d');
        this.vctx = this.volCanvas.getContext('2d');
        this.mctx = this.macdCanvas ? this.macdCanvas.getContext('2d') : null;
        this.dpr = window.devicePixelRatio || 1;
        this.crosshair = null;
        this.data = [];
        this.indicators = {};
        this.features = [];
        this.highlightIdx = -1;
        this._bindCrosshair();
    }

    resize() {
        const p = this.mainCanvas.parentElement;
        if (!p) return;
        const w = p.clientWidth;
        const totalH = p.clientHeight;
        const mainH = Math.max(180, Math.floor(totalH * 0.55));
        const volH = Math.max(60, Math.floor(totalH * 0.18));
        const macdH = Math.max(60, Math.floor(totalH * 0.22));
        this._setSize(this.mainCanvas, this.ctx, w, mainH);
        this._setSize(this.volCanvas, this.vctx, w, volH);
        if (this.macdCanvas && this.mctx) this._setSize(this.macdCanvas, this.mctx, w, macdH);
    }

    _setSize(c, ctx, w, h) {
        c.width = w * this.dpr; c.height = h * this.dpr;
        c.style.width = w + 'px'; c.style.height = h + 'px';
        ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    }

    get w() { return this.mainCanvas.width / this.dpr; }
    get h() { return this.mainCanvas.height / this.dpr; }
    get vw() { return this.volCanvas.width / this.dpr; }
    get vh() { return this.volCanvas.height / this.dpr; }
    get mw() { return this.macdCanvas ? this.macdCanvas.width / this.dpr : 0; }
    get mh() { return this.macdCanvas ? this.macdCanvas.height / this.dpr : 0; }

    _bindCrosshair() {
        const handler = (e) => {
            if (!this.data || this.data.length === 0) return;
            const rect = this.mainCanvas.getBoundingClientRect();
            this.crosshair = { x: e.clientX - rect.left, y: e.clientY - rect.top };
            this.draw(this.data, this.highlightIdx, this.indicators, this.features);
        };
        this.mainCanvas.addEventListener('mousemove', handler);
        this.mainCanvas.addEventListener('mouseleave', () => {
            this.crosshair = null;
            this.draw(this.data, this.highlightIdx, this.indicators, this.features);
        });
    }

    draw(data, highlightIdx, indicators, features) {
        this.data = data; this.indicators = indicators || {}; this.features = features || []; this.highlightIdx = highlightIdx;
        if (!data || data.length === 0) return;

        const pad = { top: 32, right: 64, bottom: 18, left: 2 };
        const cw = this.w - pad.left - pad.right;
        const ch = this.h - pad.top - pad.bottom;

        // Visible candles
        const maxCandles = Math.min(data.length, Math.floor(cw / 5));
        const visibleData = data.slice(Math.max(0, data.length - maxCandles));
        const startIdx = Math.max(0, data.length - maxCandles);
        const n = visibleData.length;
        const candleW = Math.max(3, Math.min(14, Math.floor(cw / n * 0.72)));
        const gap = Math.max(1, Math.floor((cw - candleW * n) / n));
        const step = candleW + gap;
        const toX = (i) => pad.left + gap / 2 + i * step;

        // Price range
        const allP = [];
        visibleData.forEach(d => { allP.push(d.high, d.low); });
        const maKeys = ['ma5', 'ma10', 'ma20', 'ma30'];
        maKeys.forEach(k => {
            if (indicators[k]) for (let i = 0; i < n; i++) { const v = indicators[k][startIdx + i]; if (v != null) allP.push(v); }
        });
        const minP = Math.min(...allP) * 0.997;
        const maxP = Math.max(...allP) * 1.003;
        const range = maxP - minP || 1;
        const toY = p => pad.top + ch * (1 - (p - minP) / range);

        // === MAIN CHART ===
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.w, this.h);
        ctx.fillStyle = '#0c1018'; ctx.fillRect(0, 0, this.w, this.h);

        // Grid
        this._drawGrid(ctx, pad, cw, ch, this.w, minP, maxP, 5);

        // Date labels
        ctx.fillStyle = '#3d4858'; ctx.font = '9px monospace'; ctx.textAlign = 'center';
        const lblEvery = Math.max(1, Math.floor(n / 7));
        for (let i = 0; i < n; i += lblEvery) ctx.fillText(visibleData[i].date, toX(i) + candleW / 2, this.h - 3);

        // Candles
        for (let i = 0; i < n; i++) {
            const d = visibleData[i];
            const x = toX(i), cx = x + candleW / 2;
            const isUp = d.close >= d.open;
            const color = isUp ? '#ef4444' : '#22c55e';

            // Wick
            ctx.strokeStyle = color; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(cx, toY(d.high)); ctx.lineTo(cx, toY(d.low)); ctx.stroke();

            // Body
            const bt = toY(Math.max(d.open, d.close)), bb = toY(Math.min(d.open, d.close));
            const bh = Math.max(1, bb - bt);
            if (isUp) {
                if (candleW >= 4) {
                    ctx.fillStyle = '#ef4444'; ctx.fillRect(x, bt, candleW, bh);
                } else { ctx.fillStyle = '#ef4444'; ctx.fillRect(x, bt, candleW, bh); }
            } else { ctx.fillStyle = '#22c55e'; ctx.fillRect(x, bt, candleW, bh); }

            // Highlight current trading day
            if (startIdx + i === highlightIdx) {
                ctx.save(); ctx.strokeStyle = 'rgba(96,165,250,0.7)'; ctx.lineWidth = 2;
                ctx.setLineDash([3, 2]);
                ctx.strokeRect(x - 2, toY(d.high) - 3, candleW + 4, toY(d.low) - toY(d.high) + 6);
                ctx.setLineDash([]); ctx.restore();
            }

            // History divider
            if (d.isHistory && i < n - 1 && !visibleData[i + 1].isHistory) {
                ctx.strokeStyle = 'rgba(96,165,250,0.25)'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
                ctx.beginPath(); ctx.moveTo(x + candleW + gap / 2, pad.top); ctx.lineTo(x + candleW + gap / 2, pad.top + ch); ctx.stroke();
                ctx.setLineDash([]); ctx.fillStyle = 'rgba(96,165,250,0.45)'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
                ctx.fillText('▼ 交易开始', x + candleW + gap / 2, pad.top - 2);
            }
        }

        // MAs
        const maStyles = [
            { key: 'ma5', color: '#eab308', label: 'MA5' },
            { key: 'ma10', color: '#3b82f6', label: 'MA10' },
            { key: 'ma20', color: '#ec4899', label: 'MA20' },
            { key: 'ma30', color: '#22c55e', label: 'MA30' },
        ];
        for (const ma of maStyles) {
            if (!indicators[ma.key]) continue;
            if (ma.key !== 'ma5' && !features.includes(ma.key)) continue;
            ctx.beginPath(); ctx.strokeStyle = ma.color; ctx.lineWidth = 1.1;
            let started = false;
            for (let i = 0; i < n; i++) {
                const v = indicators[ma.key][startIdx + i];
                if (v == null) continue;
                const px = toX(i) + candleW / 2, py = toY(v);
                if (!started) { ctx.moveTo(px, py); started = true; } else ctx.lineTo(px, py);
            }
            ctx.stroke();
        }

        // OHLC header - date + stock info
        const lastD = visibleData[n - 1];
        const prevClose = n > 1 ? visibleData[n - 2].close : lastD.open;
        const isUp = lastD.close >= prevClose;
        const clr = isUp ? '#ef4444' : '#22c55e';

        // Date info
        ctx.fillStyle = '#8899aa'; ctx.font = '10px sans-serif'; ctx.textAlign = 'left';
        const showD = this.crosshair ? this._closestCandle(visibleData, toX, candleW, n) : lastD;
        ctx.fillText(`${showD.date || ''}  开 ${showD.open.toFixed(2)}  高 ${showD.high.toFixed(2)}  收 ${showD.close.toFixed(2)}  低 ${showD.low.toFixed(2)}  量 ${(showD.volume / 10000).toFixed(0)}万`, pad.left + 4, 12);

        // MA legend
        let lx = pad.left + 4;
        for (const ma of maStyles) {
            if (!indicators[ma.key]) continue;
            if (ma.key !== 'ma5' && !features.includes(ma.key)) continue;
            const idx = this.crosshair ? (startIdx + this._closestIndex(visibleData, toX, candleW, n)) : (data.length - 1);
            const v = indicators[ma.key][idx];
            ctx.fillStyle = ma.color; ctx.font = '10px monospace';
            ctx.fillText(`${ma.label}:${v ? v.toFixed(2) : '--'}`, lx, 24);
            lx += 100;
        }

        // Current price line
        const priceY = toY(lastD.close);
        ctx.strokeStyle = clr + '88'; ctx.lineWidth = 0.5; ctx.setLineDash([2, 2]);
        ctx.beginPath(); ctx.moveTo(pad.left, priceY); ctx.lineTo(this.w - pad.right, priceY); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = clr;
        ctx.fillRect(this.w - pad.right + 1, priceY - 8, 56, 16);
        ctx.fillStyle = '#fff'; ctx.font = 'bold 9px monospace'; ctx.textAlign = 'center';
        ctx.fillText(lastD.close.toFixed(2), this.w - pad.right + 29, priceY + 3);

        // Crosshair
        if (this.crosshair) this._drawCrosshair(ctx, visibleData, startIdx, n, toX, toY, candleW, pad, this.w, this.h, minP, maxP, ch);

        // === VOLUME ===
        this._drawVolume(visibleData, startIdx, highlightIdx, candleW, gap, pad, step, n);

        // === MACD ===
        if (this.mctx && indicators.macd) this._drawMACD(visibleData, startIdx, n, candleW, gap, pad, step);
    }

    _closestCandle(data, toX, cw, n) {
        const ci = this._closestIndex(data, toX, cw, n);
        return data[ci];
    }
    _closestIndex(data, toX, cw, n) {
        if (!this.crosshair) return n - 1;
        let best = 0, bestD = Infinity;
        for (let i = 0; i < n; i++) {
            const d = Math.abs(this.crosshair.x - (toX(i) + cw / 2));
            if (d < bestD) { bestD = d; best = i; }
        }
        return best;
    }

    _drawCrosshair(ctx, data, startIdx, n, toX, toY, cw, pad, w, h, minP, maxP, ch) {
        const ci = this._closestIndex(data, toX, cw, n);
        const d = data[ci], cx = toX(ci) + cw / 2;
        ctx.strokeStyle = 'rgba(148,163,184,0.3)'; ctx.lineWidth = 0.5; ctx.setLineDash([3, 3]);
        ctx.beginPath(); ctx.moveTo(cx, pad.top); ctx.lineTo(cx, pad.top + ch); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(pad.left, this.crosshair.y); ctx.lineTo(w - pad.right, this.crosshair.y); ctx.stroke();
        ctx.setLineDash([]);
        // Price tag on y-axis
        const priceAtY = maxP - ((this.crosshair.y - pad.top) / ch) * (maxP - minP);
        if (priceAtY >= minP && priceAtY <= maxP) {
            ctx.fillStyle = '#334155'; ctx.fillRect(w - pad.right + 1, this.crosshair.y - 8, 56, 16);
            ctx.fillStyle = '#e2e8f0'; ctx.font = '9px monospace'; ctx.textAlign = 'center';
            ctx.fillText(priceAtY.toFixed(2), w - pad.right + 29, this.crosshair.y + 3);
        }
    }

    _drawVolume(data, startIdx, highlightIdx, candleW, gap, mainPad, step, n) {
        const ctx = this.vctx, w = this.vw, h = this.vh;
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = '#0c1018'; ctx.fillRect(0, 0, w, h);
        const pad = { left: mainPad.left, right: mainPad.right };
        const toX = (i) => pad.left + gap / 2 + i * step;
        const maxVol = Math.max(...data.map(d => d.volume)) || 1;
        const barArea = h - 16;

        // Volume MA legend
        ctx.fillStyle = '#6b7280'; ctx.font = '9px monospace'; ctx.textAlign = 'left';
        let lx = 4;
        ctx.fillText('成交', lx, 10);
        if (this.indicators.volMa5) {
            const lastV = this.indicators.volMa5[this.indicators.volMa5.length - 1];
            ctx.fillStyle = '#eab308'; ctx.fillText(`MA5:${lastV ? (lastV / 10000).toFixed(0) + '万' : '--'}`, lx + 32, 10);
        }
        if (this.indicators.volMa10) {
            const lastV = this.indicators.volMa10[this.indicators.volMa10.length - 1];
            ctx.fillStyle = '#3b82f6'; ctx.fillText(`MA10:${lastV ? (lastV / 10000).toFixed(0) + '万' : '--'}`, lx + 120, 10);
        }

        // Grid
        ctx.strokeStyle = 'rgba(255,255,255,0.03)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(pad.left, h / 2); ctx.lineTo(w - pad.right, h / 2); ctx.stroke();

        for (let i = 0; i < n; i++) {
            const d = data[i];
            const x = toX(i);
            const barH = Math.max(1, (d.volume / maxVol) * barArea);
            const isUp = d.close >= d.open;
            ctx.fillStyle = isUp ? 'rgba(239,68,68,0.55)' : 'rgba(34,197,94,0.55)';
            ctx.fillRect(x, h - barH - 2, candleW, barH);
            if (startIdx + i === highlightIdx) {
                ctx.strokeStyle = 'rgba(96,165,250,0.5)'; ctx.lineWidth = 1;
                ctx.strokeRect(x - 1, h - barH - 3, candleW + 2, barH + 2);
            }
        }

        // Volume MA lines
        const volMAs = [
            { key: 'volMa5', color: '#eab308' },
            { key: 'volMa10', color: '#3b82f6' },
        ];
        for (const vm of volMAs) {
            if (!this.indicators[vm.key]) continue;
            ctx.beginPath(); ctx.strokeStyle = vm.color; ctx.lineWidth = 1;
            let started = false;
            for (let i = 0; i < n; i++) {
                const v = this.indicators[vm.key][startIdx + i];
                if (v == null) continue;
                const px = toX(i) + candleW / 2;
                const py = h - 2 - (v / maxVol) * barArea;
                if (!started) { ctx.moveTo(px, py); started = true; } else ctx.lineTo(px, py);
            }
            ctx.stroke();
        }
    }

    _drawMACD(data, startIdx, n, candleW, gap, mainPad, step) {
        const ctx = this.mctx, w = this.mw, h = this.mh;
        if (!ctx) return;
        ctx.clearRect(0, 0, w, h); ctx.fillStyle = '#0c1018'; ctx.fillRect(0, 0, w, h);
        const pad = { left: mainPad.left, right: mainPad.right };
        const toX = (i) => pad.left + gap / 2 + i * step;
        const macd = this.indicators.macd;
        if (!macd) return;

        // Gather visible values
        const difs = [], deas = [], bars = [];
        for (let i = 0; i < n; i++) {
            const ai = startIdx + i;
            difs.push(macd.dif[ai]); deas.push(macd.dea[ai]); bars.push(macd.bar[ai]);
        }

        const allVals = [...difs, ...deas, ...bars].filter(v => v != null);
        if (allVals.length === 0) return;
        const maxV = Math.max(...allVals.map(Math.abs)) * 1.1 || 1;
        const midY = h / 2 + 6;
        const scaleH = (h - 20) / 2;
        const toMY = v => midY - (v / maxV) * scaleH;

        // Zero line
        ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(pad.left, midY); ctx.lineTo(w - pad.right, midY); ctx.stroke();

        // Legend
        ctx.font = '9px monospace'; ctx.textAlign = 'left';
        const lastDif = difs.filter(v => v != null).pop();
        const lastDea = deas.filter(v => v != null).pop();
        const lastBar = bars.filter(v => v != null).pop();
        ctx.fillStyle = '#6b7280'; ctx.fillText('MACD', 4, 10);
        ctx.fillStyle = '#3b82f6'; ctx.fillText(`DIF:${lastDif != null ? lastDif.toFixed(2) : '--'}`, 42, 10);
        ctx.fillStyle = '#eab308'; ctx.fillText(`DEA:${lastDea != null ? lastDea.toFixed(2) : '--'}`, 120, 10);
        ctx.fillStyle = (lastBar || 0) >= 0 ? '#ef4444' : '#22c55e';
        ctx.fillText(`MACD:${lastBar != null ? lastBar.toFixed(2) : '--'}`, 200, 10);

        // MACD bars
        for (let i = 0; i < n; i++) {
            const v = bars[i];
            if (v == null) continue;
            const x = toX(i);
            const barH = Math.abs(v / maxV) * scaleH;
            ctx.fillStyle = v >= 0 ? '#ef4444' : '#22c55e';
            if (v >= 0) ctx.fillRect(x, midY - barH, candleW, barH);
            else ctx.fillRect(x, midY, candleW, barH);
        }

        // DIF line
        ctx.beginPath(); ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 1.2;
        let started = false;
        for (let i = 0; i < n; i++) {
            if (difs[i] == null) continue;
            const px = toX(i) + candleW / 2, py = toMY(difs[i]);
            if (!started) { ctx.moveTo(px, py); started = true; } else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // DEA line
        ctx.beginPath(); ctx.strokeStyle = '#eab308'; ctx.lineWidth = 1.2;
        started = false;
        for (let i = 0; i < n; i++) {
            if (deas[i] == null) continue;
            const px = toX(i) + candleW / 2, py = toMY(deas[i]);
            if (!started) { ctx.moveTo(px, py); started = true; } else ctx.lineTo(px, py);
        }
        ctx.stroke();
    }

    _drawGrid(ctx, pad, cw, ch, w, minP, maxP, lines) {
        ctx.textAlign = 'right';
        for (let i = 0; i <= lines; i++) {
            const y = pad.top + (i / lines) * ch;
            const price = maxP - (i / lines) * (maxP - minP);
            ctx.strokeStyle = 'rgba(255,255,255,0.03)'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(w - pad.right, y); ctx.stroke();
            ctx.fillStyle = '#4b5563'; ctx.font = '9px monospace';
            ctx.fillText(price.toFixed(2), w - pad.right + 50, y + 3);
        }
    }
}
