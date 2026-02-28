

// Global State
let currentQuestionIndex = 0;
let userAnswers = {}; // Map question index to selected option
let questions = [];
let cachedExplanations = {}; // Cache AI explanations
let pendingExplanations = {}; // Track pending fetches

// Timer State
let timerInterval = null;
let timeRemaining = 25 * 60; // 25 minutes in seconds
let isTimerRunning = false;

// DOM Elements
const elements = {
    questionContainer: document.getElementById('questionContainer'),
    prevBtn: document.getElementById('prevBtn'),
    nextBtn: document.getElementById('nextBtn'),
    questionSelect: document.getElementById('questionSelect'),
    progress: document.getElementById('progress'),
    answeredSpan: document.getElementById('answered'),
    totalSpan: document.getElementById('total'),
    correctCountSpan: document.getElementById('correctCount'),
    modal: document.getElementById('explanationModal'),
    explanationContent: document.getElementById('explanationContent')
};

// Initialize
function init() {
    if (typeof examData === 'undefined' || !examData.questoes) {
        alert('Erro: Dados das questões não encontrados. Verifique o arquivo questions.js.');
        return;
    }

    questions = examData.questoes;
    elements.totalSpan.textContent = questions.length;

    // Populate Select
    questions.forEach((q, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `Questão ${q.numero}`;
        elements.questionSelect.appendChild(option);
    });

    // Load first question
    loadQuestion(0);
}

function loadQuestion(index) {
    if (index < 0 || index >= questions.length) return;

    currentQuestionIndex = index;
    const q = questions[index];

    // Update Select
    elements.questionSelect.value = index;

    // Update Buttons
    elements.prevBtn.disabled = index === 0;
    elements.nextBtn.disabled = index === questions.length - 1;

    // Render Question
    let tagsHtml = q.tags.map(tag => `<span class="tag">${tag}</span>`).join('');

    let optionsHtml = '';
    const letters = ['A', 'B', 'C', 'D', 'E'];

    // Determine strict state
    const userAnswer = userAnswers[index];
    const isAnswered = userAnswer !== undefined;

    letters.forEach(letter => {
        if (!q.alternativas[letter]) return;

        let className = 'option';
        // If answered, show correct/incorrect
        if (isAnswered) {
            if (letter === q.resposta_correta) {
                className += ' correct';
            } else if (letter === userAnswer) {
                className += ' incorrect';
            }
        }

        optionsHtml += `
            <div class="${className}" onclick="selectOption('${letter}')">
                <div class="option-letter">${letter}</div>
                <div class="option-text">${q.alternativas[letter]}</div>
            </div>
        `;
    });

    const html = `
        <div class="question-card">
            <div class="question-header">
                <div class="question-number">Questão ${q.numero}</div>
                <div class="question-tags">${tagsHtml}</div>
            </div>
            <div class="question-text">${q.enunciado.replace(/\n/g, '<br>')}</div>
            <div class="options">
                ${optionsHtml}
            </div>
        </div>
        <div id="explanationBox" class="explanation-box" style="display: none;"></div>
    `;

    elements.questionContainer.innerHTML = html;

    // If already answered, show cached explanation
    if (isAnswered && cachedExplanations[currentQuestionIndex]) {
        showInlineExplanation(cachedExplanations[currentQuestionIndex], q, userAnswer);
    }

    // Pre-fetch explanation in background (if not already cached or pending)
    if (!cachedExplanations[index] && !pendingExplanations[index]) {
        prefetchExplanation(index);
    }
}

async function selectOption(letter) {
    if (userAnswers[currentQuestionIndex] !== undefined) return; // Already answered

    userAnswers[currentQuestionIndex] = letter;
    const q = questions[currentQuestionIndex];
    const index = currentQuestionIndex;

    // Reload question to show correct/incorrect
    loadQuestion(currentQuestionIndex);
    updateProgress();

    // Show explanation immediately if cached, otherwise wait for it
    if (cachedExplanations[index]) {
        showInlineExplanation(cachedExplanations[index], q, letter);
    } else {
        // Show loading and wait for pending fetch
        const explanationBox = document.getElementById('explanationBox');
        explanationBox.style.display = 'block';
        explanationBox.innerHTML = `<div class="loading"><div class="spinner"></div><p>Carregando...</p></div>`;

        // Wait for the pending fetch to complete
        if (pendingExplanations[index]) {
            await pendingExplanations[index];
            if (cachedExplanations[index]) {
                showInlineExplanation(cachedExplanations[index], q, letter);
            }
        }
    }
}

function getCorrectCount() {
    let correctCount = 0;
    for (const [index, answer] of Object.entries(userAnswers)) {
        if (questions[index] && answer === questions[index].resposta_correta) {
            correctCount++;
        }
    }
    return correctCount;
}

function updateProgress() {
    const answeredCount = Object.keys(userAnswers).length;
    const total = questions.length;
    const percentage = (answeredCount / total) * 100;
    const correctCount = getCorrectCount();

    elements.progress.style.width = `${percentage}%`;
    elements.answeredSpan.textContent = answeredCount;
    elements.correctCountSpan.textContent = correctCount;

    // Update stats table if visible
    renderTagStats();
}

function prevQuestion() {
    loadQuestion(currentQuestionIndex - 1);
}

function nextQuestion() {
    loadQuestion(currentQuestionIndex + 1);
}

function goToQuestion(index) {
    loadQuestion(parseInt(index));
}

// Pre-fetch explanation from JSON data (no API call needed)
async function prefetchExplanation(index) {
    const q = questions[index];

    const fetchPromise = (async () => {
        try {
            // Use explanation from JSON if available
            if (q.explicacao && q.explicacao.trim() !== '') {
                cachedExplanations[index] = q.explicacao;
            } else {
                // Fallback message if no explanation exists
                cachedExplanations[index] = 'Explicação não disponível para esta questão.';
            }
        } catch (error) {
            console.log('Error loading explanation:', error.message);
        } finally {
            delete pendingExplanations[index];
        }
    })();

    pendingExplanations[index] = fetchPromise;
}

function showInlineExplanation(explanation, q, userAnswer) {
    const explanationBox = document.getElementById('explanationBox');
    const isCorrect = userAnswer === q.resposta_correta;
    const resultText = isCorrect ? 'Correto' : 'Incorreto';
    const resultColor = isCorrect ? '#10b981' : '#f43f5e';

    explanationBox.style.display = 'block';
    explanationBox.innerHTML = `
        <div class="explanation-header">
            <div class="result-text">
                <h3 style="color: ${resultColor}">${resultText}</h3>
            </div>
        </div>
        <div class="explanation-body">
            ${formatExplanation(explanation)}
        </div>
        <div class="correct-answer-box">
            <h4>Gabarito Oficial</h4>
            <p><strong>Alternativa ${q.resposta_correta}:</strong> ${q.alternativas[q.resposta_correta]}</p>
        </div>
    `;
}

function formatExplanation(text) {
    return text
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/^/, '<p>')
        .replace(/$/, '</p>');
}

function showExplanation() {
    // Legacy function - now handled inline
}

function closeModal() {
    elements.modal.classList.remove('show');
    elements.modal.style.display = 'none';
}

// Pomodoro Timer Functions
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateTimerDisplay() {
    const timerDisplay = document.getElementById('timerDisplay');
    if (timerDisplay) {
        timerDisplay.textContent = formatTime(timeRemaining);
    }
}

function startTimer() {
    if (isTimerRunning) return;

    isTimerRunning = true;
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const timerDisplay = document.getElementById('timerDisplay');

    if (startBtn) startBtn.style.display = 'none';
    if (pauseBtn) pauseBtn.style.display = 'inline-block';
    if (timerDisplay) timerDisplay.classList.add('pulse');

    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();

        if (timeRemaining <= 0) {
            timerComplete();
        }
    }, 1000);
}

function pauseTimer() {
    if (!isTimerRunning) return;

    isTimerRunning = false;
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const timerDisplay = document.getElementById('timerDisplay');

    if (startBtn) startBtn.style.display = 'inline-block';
    if (pauseBtn) pauseBtn.style.display = 'none';
    if (timerDisplay) timerDisplay.classList.remove('pulse');

    clearInterval(timerInterval);
}

function resetTimer() {
    pauseTimer();
    timeRemaining = 25 * 60;
    updateTimerDisplay();
}

function timerComplete() {
    pauseTimer();
    const timerDisplay = document.getElementById('timerDisplay');
    if (timerDisplay) {
        timerDisplay.classList.remove('pulse');
    }

    // Play a sound or show notification
    alert('⏰ Tempo esgotado! Hora de fazer uma pausa de 5 minutos.');
    resetTimer();
}

// Global scope for HTML onclick access
window.prevQuestion = prevQuestion;
window.nextQuestion = nextQuestion;
window.goToQuestion = goToQuestion;
window.selectOption = selectOption;
window.closeModal = closeModal;
window.showExplanation = showExplanation;
window.prefetchExplanation = prefetchExplanation;
window.startTimer = startTimer;
window.pauseTimer = pauseTimer;
window.resetTimer = resetTimer;
window.switchTab = switchTab;

/* Statistics & Tabs Logic */
let currentTab = 'timer';

function switchTab(tabId) {
    currentTab = tabId;

    // Update Buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('onclick').includes(tabId)) {
            btn.classList.add('active');
        }
    });

    // Update Content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.style.display = 'none';
    });
    document.getElementById(`tab-${tabId}`).style.display = 'block';

    if (tabId === 'stats') {
        renderTagStats();
    }
}

function renderTagStats() {
    const statsContainer = document.getElementById('tagStatsList');
    if (!statsContainer) return;

    const stats = getStatsByTag();

    // Sort by most answered, then by lowest percentage (most errors)
    const sortedTags = Object.entries(stats).sort(([, a], [, b]) => {
        if (b.answered !== a.answered) return b.answered - a.answered;
        // If same amount answered, show the one with lower percentage first (more errors)
        const percentA = a.answered > 0 ? (a.correct / a.answered) : 0;
        const percentB = b.answered > 0 ? (b.correct / b.answered) : 0;
        return percentA - percentB;
    });

    let html = '';

    sortedTags.forEach(([tag, data]) => {
        if (data.answered === 0 && !data.total) return; // Skip empty if desired, but we want to show available tags? 
        // Showing only tags with at least one question answering or just all? 
        // Let's show all tags that have questions in the exam.

        const percent = data.answered > 0 ? Math.round((data.correct / data.answered) * 100) : 0;

        let colorClass = 'medium';
        if (percent >= 70) colorClass = 'high'; // We don't have a class for high, using default green color from CSS
        if (percent < 50) colorClass = 'low';

        // Custom inline style for high to match CSS logic
        const percentColor = percent >= 70 ? '#10b981' : (percent < 50 ? '#f43f5e' : '#f59e0b');

        html += `
            <div class="stat-item">
                <div class="tag-name" title="${tag}">${tag}</div>
                <div>${data.answered} / ${data.total}</div>
                <div>${data.correct}</div>
                <div class="percentage" style="color: ${percentColor}">${percent}%</div>
            </div>
        `;
    });

    statsContainer.innerHTML = html || '<div style="padding: 20px; text-align: center; color: #64748b;">Nenhuma questão respondida ainda.</div>';
}

function getStatsByTag() {
    const stats = {};

    questions.forEach((q, index) => {
        q.tags.forEach(originalTag => {
            // Clean up tag if needed, or use as is
            const tag = originalTag.trim();

            if (!stats[tag]) {
                stats[tag] = { total: 0, answered: 0, correct: 0 };
            }
            stats[tag].total++;

            if (userAnswers[index] !== undefined) {
                stats[tag].answered++;
                if (userAnswers[index] === q.resposta_correta) {
                    stats[tag].correct++;
                }
            }
        });
    });

    return stats;
}

// Start
document.addEventListener('DOMContentLoaded', init);
