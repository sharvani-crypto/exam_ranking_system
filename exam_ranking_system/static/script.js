/**
 * Exam & Ranking System — Main JavaScript
 * =========================================
 * Handles:
 *  - Countdown timer with auto-submit
 *  - Answer tracking & progress display
 *  - Mobile navigation toggle
 *  - Form validation
 *  - Scroll animations
 *  - Confirmation dialogs
 */
 
/* ══════════════════════════════════════════════
   MOBILE NAVIGATION TOGGLE
══════════════════════════════════════════════ */
function initNavToggle() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks  = document.querySelector('.nav-links');
 
  if (!hamburger || !navLinks) return;
 
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    // Animate hamburger icon
    hamburger.classList.toggle('active');
  });
 
  // Close nav when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}
 
 
/* ══════════════════════════════════════════════
   COUNTDOWN TIMER (Exam Page)
══════════════════════════════════════════════ */
let timerInterval = null;
 
function initExamTimer(durationMinutes) {
  const timerDisplay  = document.getElementById('timer-display');
  const progressBar   = document.getElementById('timer-progress-bar');
  const examForm      = document.getElementById('exam-form');
 
  if (!timerDisplay || !examForm) return;
 
  const totalSeconds = durationMinutes * 60;
  let secondsLeft    = totalSeconds;
 
  function updateTimer() {
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
 
    // Format as MM:SS
    const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    timerDisplay.textContent = display;
 
    // Update progress bar (shrinks from 100% to 0%)
    const pct = (secondsLeft / totalSeconds) * 100;
    if (progressBar) progressBar.style.width = pct + '%';
 
    // Color thresholds
    timerDisplay.className = 'timer-display';
    if (secondsLeft <= 60)                       timerDisplay.classList.add('danger');
    else if (secondsLeft <= totalSeconds * 0.25) timerDisplay.classList.add('warning');
 
    // Auto-submit when time runs out
    if (secondsLeft <= 0) {
      clearInterval(timerInterval);
      showTimerExpiredBanner();
      setTimeout(() => examForm.submit(), 1500);
      return;
    }
 
    secondsLeft--;
  }
 
  // Run immediately, then every second
  updateTimer();
  timerInterval = setInterval(updateTimer, 1000);
}
 
function showTimerExpiredBanner() {
  const banner = document.createElement('div');
  banner.className = 'alert alert-danger';
  banner.style.cssText = `
    position: fixed; top: 80px; left: 50%; transform: translateX(-50%);
    z-index: 9999; padding: 1rem 2rem; font-weight: 600;
    box-shadow: 0 8px 32px rgba(0,0,0,0.2); border-radius: 12px;
  `;
  banner.textContent = '⏰ Time is up! Submitting your exam...';
  document.body.appendChild(banner);
}
 
 
/* ══════════════════════════════════════════════
   ANSWER TRACKING (Exam Page)
══════════════════════════════════════════════ */
function initAnswerTracking(totalQuestions) {
  const dots = document.querySelectorAll('.progress-dot');
 
  // Track which questions have been answered
  const answered = new Set();
 
  document.querySelectorAll('.options-list input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const qNum = parseInt(radio.dataset.question, 10);
      answered.add(qNum);
 
      // Update dot for this question
      if (dots[qNum - 1]) {
        dots[qNum - 1].classList.add('answered');
        dots[qNum - 1].title = `Question ${qNum} answered`;
      }
 
      // Update answered count display
      const answeredCount = document.getElementById('answered-count');
      if (answeredCount) answeredCount.textContent = answered.size;
    });
  });
 
  // Dot click → scroll to question
  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      const target = document.getElementById(`question-${idx + 1}`);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });
}
 
 
/* ══════════════════════════════════════════════
   EXAM FORM SUBMIT CONFIRMATION
══════════════════════════════════════════════ */
function initExamSubmit(totalQuestions) {
  const submitBtn = document.getElementById('submit-exam-btn');
  const examForm  = document.getElementById('exam-form');
 
  if (!submitBtn || !examForm) return;
 
  submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
 
    // Count answered questions
    const answeredCount = document.querySelectorAll('.options-list input[type="radio"]:checked').length;
    const unanswered    = totalQuestions - answeredCount;
 
    let message = `You have answered ${answeredCount} of ${totalQuestions} questions.`;
    if (unanswered > 0) {
      message += `\n\n⚠️ ${unanswered} question(s) are unanswered. They will be marked as incorrect.`;
    }
    message += '\n\nAre you sure you want to submit?';
 
    if (confirm(message)) {
      // Stop the timer
      if (timerInterval) clearInterval(timerInterval);
      examForm.submit();
    }
  });
}
 
 
/* ══════════════════════════════════════════════
   SCROLL ANIMATIONS
══════════════════════════════════════════════ */
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
 
  document.querySelectorAll('.animate-in').forEach(el => {
    el.style.animationPlayState = 'paused';
    observer.observe(el);
  });
}
 
 
/* ══════════════════════════════════════════════
   FORM VALIDATION (Login / Register)
══════════════════════════════════════════════ */
function initFormValidation() {
  const registerForm = document.getElementById('register-form');
  if (!registerForm) return;
 
  registerForm.addEventListener('submit', (e) => {
    const password  = registerForm.querySelector('#password').value;
    const password2 = registerForm.querySelector('#password2');
 
    if (password2 && password !== password2.value) {
      e.preventDefault();
      showFormError(registerForm, 'Passwords do not match.');
      return;
    }
 
    if (password.length < 6) {
      e.preventDefault();
      showFormError(registerForm, 'Password must be at least 6 characters.');
    }
  });
}
 
function showFormError(form, message) {
  // Remove existing error
  const existing = form.querySelector('.js-error');
  if (existing) existing.remove();
 
  const div = document.createElement('div');
  div.className = 'auth-error js-error';
  div.innerHTML = `⚠️ ${message}`;
 
  const submitBtn = form.querySelector('button[type="submit"]');
  form.insertBefore(div, submitBtn);
}
 
 
/* ══════════════════════════════════════════════
   LEADERBOARD FILTER (Subject tabs)
══════════════════════════════════════════════ */
function initLeaderboardTabs() {
  const tabs    = document.querySelectorAll('.lb-tab');
  const panels  = document.querySelectorAll('.lb-panel');
 
  if (!tabs.length) return;
 
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
 
      // Activate tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
 
      // Show panel
      panels.forEach(p => {
        p.style.display = p.dataset.panel === target ? 'block' : 'none';
      });
    });
  });
 
  // Activate first tab by default
  if (tabs[0]) tabs[0].click();
}
 
 
/* ══════════════════════════════════════════════
   ANIMATE COUNTER (Stats section)
══════════════════════════════════════════════ */
function animateCounter(el, target, duration = 1200) {
  let start = 0;
  const step = target / (duration / 16);
 
  const update = () => {
    start += step;
    if (start >= target) {
      el.textContent = target;
      return;
    }
    el.textContent = Math.floor(start);
    requestAnimationFrame(update);
  };
 
  requestAnimationFrame(update);
}
 
function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;
 
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target, parseInt(entry.target.dataset.counter, 10));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
 
  counters.forEach(c => observer.observe(c));
}
 
 
/* ══════════════════════════════════════════════
   HIGHLIGHT ACTIVE NAV LINK
══════════════════════════════════════════════ */
function highlightActiveNav() {
  const path = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href') === path) {
      link.classList.add('active');
    }
  });
}
 
 
/* ══════════════════════════════════════════════
   INIT — RUN ON DOM READY
══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initNavToggle();
  initScrollAnimations();
  initFormValidation();
  initLeaderboardTabs();
  initCounters();
  highlightActiveNav();
 
  // Exam page specific init
  const examForm = document.getElementById('exam-form');
  if (examForm) {
    const duration       = parseInt(examForm.dataset.duration || '20', 10);
    const totalQuestions = parseInt(examForm.dataset.total    || '10', 10);
 
    initExamTimer(duration);
    initAnswerTracking(totalQuestions);
    initExamSubmit(totalQuestions);
  }
});
 