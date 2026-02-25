/**
 * teaching.js — 教学弹窗 + 测验系统
 */
class TeachingSystem {
    constructor() {
        this.modal = document.getElementById('teaching-modal');
        this.currentLessons = [];
        this.currentQuiz = [];
        this.lessonIdx = 0;
        this.quizIdx = 0;
        this.onComplete = null;
    }

    /** Start the teaching flow for a level */
    startTeaching(levelConfig, onComplete) {
        this.currentLessons = levelConfig.lessons || [];
        this.currentQuiz = levelConfig.quiz || [];
        this.lessonIdx = 0;
        this.quizIdx = 0;
        this.onComplete = onComplete;

        if (this.currentLessons.length > 0) {
            this.showLesson(0);
        } else if (this.currentQuiz.length > 0) {
            this.showQuiz(0);
        } else {
            this.finish();
        }
    }

    showLesson(idx) {
        this.lessonIdx = idx;
        const lesson = this.currentLessons[idx];
        if (!lesson) { this.startQuiz(); return; }

        const isLast = idx >= this.currentLessons.length - 1;
        const progress = `${idx + 1} / ${this.currentLessons.length}`;

        this.modal.innerHTML = `
      <div class="teach-overlay" id="teach-overlay">
        <div class="teach-card">
          <div class="teach-progress">知识讲解 ${progress}</div>
          <h2 class="teach-title">${lesson.title}</h2>
          <div class="teach-content">${lesson.content}</div>
          <div class="teach-actions">
            ${idx > 0 ? '<button class="teach-btn secondary" id="teach-prev">◀ 上一页</button>' : ''}
            <button class="teach-btn primary" id="teach-next">${isLast ? '开始测验 ▶' : '下一页 ▶'}</button>
          </div>
        </div>
      </div>
    `;
        this.modal.classList.remove('hidden');

        if (idx > 0) document.getElementById('teach-prev').addEventListener('click', () => this.showLesson(idx - 1));
        document.getElementById('teach-next').addEventListener('click', () => {
            if (isLast) this.startQuiz();
            else this.showLesson(idx + 1);
        });
    }

    startQuiz() {
        if (this.currentQuiz.length > 0) {
            this.showQuiz(0);
        } else {
            this.finish();
        }
    }

    showQuiz(idx) {
        this.quizIdx = idx;
        const q = this.currentQuiz[idx];
        if (!q) { this.finish(); return; }

        const progress = `${idx + 1} / ${this.currentQuiz.length}`;

        this.modal.innerHTML = `
      <div class="teach-overlay" id="teach-overlay">
        <div class="teach-card quiz-card">
          <div class="teach-progress">📝 小测验 ${progress}</div>
          <h2 class="quiz-question">${q.question}</h2>
          <div class="quiz-options">
            ${q.options.map((opt, i) => `
              <button class="quiz-option" data-idx="${i}">
                <span class="opt-letter">${'ABC'[i]}</span>
                <span class="opt-text">${opt}</span>
              </button>
            `).join('')}
          </div>
          <div id="quiz-result" class="quiz-result hidden"></div>
        </div>
      </div>
    `;
        this.modal.classList.remove('hidden');

        // Bind option clicks
        this.modal.querySelectorAll('.quiz-option').forEach(btn => {
            btn.addEventListener('click', () => this.checkAnswer(idx, parseInt(btn.dataset.idx)));
        });
    }

    checkAnswer(qIdx, selectedIdx) {
        const q = this.currentQuiz[qIdx];
        const correct = selectedIdx === q.answer;
        const resultEl = document.getElementById('quiz-result');

        // Highlight correct/wrong
        this.modal.querySelectorAll('.quiz-option').forEach((btn, i) => {
            btn.classList.add('disabled');
            if (i === q.answer) btn.classList.add('correct');
            if (i === selectedIdx && !correct) btn.classList.add('wrong');
        });

        resultEl.innerHTML = `
      <div class="result-${correct ? 'correct' : 'wrong'}">
        <div class="result-icon">${correct ? '✅ 回答正确！' : '❌ 回答错误'}</div>
        <div class="result-explain">${q.explanation}</div>
      </div>
      <button class="teach-btn primary" id="quiz-next">${qIdx < this.currentQuiz.length - 1 ? '下一题 ▶' : '开始实战 🚀'}</button>
    `;
        resultEl.classList.remove('hidden');

        document.getElementById('quiz-next').addEventListener('click', () => {
            if (qIdx < this.currentQuiz.length - 1) this.showQuiz(qIdx + 1);
            else this.finish();
        });
    }

    finish() {
        this.modal.classList.add('hidden');
        this.modal.innerHTML = '';
        if (this.onComplete) this.onComplete();
    }

    /** Show a quick tip during gameplay */
    showTip(title, content, duration = 4000) {
        const tip = document.createElement('div');
        tip.className = 'game-tip-popup';
        tip.innerHTML = `<div class="tip-title">${title}</div><div class="tip-body">${content}</div>`;
        document.body.appendChild(tip);
        requestAnimationFrame(() => tip.classList.add('show'));
        setTimeout(() => { tip.classList.remove('show'); setTimeout(() => tip.remove(), 300); }, duration);
    }
}
