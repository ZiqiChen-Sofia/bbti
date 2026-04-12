/**
 * BBTI (Badminton Brain Type Indicator) - Application Logic
 * State management, quiz engine, scoring, result rendering, sharing
 */
(function () {
  'use strict';

  var DATA = window.BBTI_DATA;

  // ============================================================
  // DOM helpers
  // ============================================================
  function $(sel) { return document.querySelector(sel); }

  // ============================================================
  // State
  // ============================================================
  var state = {
    currentView: 'home',
    currentQuestion: 0,
    answers: new Array(DATA.questions.length).fill(null),
    scores: {
      attack: 0, defense: 0,
      skill: 0, power: 0,
      plan: 0, random: 0,
      zen: 0, heated: 0
    },
    resultType: null,
    confidence: null,
    activeStage: 'a', // which stage is currently visible: 'a' or 'b'
    transitioning: false
  };

  // ============================================================
  // View Navigation
  // ============================================================
  function showView(viewId) {
    var views = document.querySelectorAll('.view');
    for (var i = 0; i < views.length; i++) {
      views[i].classList.remove('active');
    }
    document.getElementById('view-' + viewId).classList.add('active');
    state.currentView = viewId;
    window.scrollTo(0, 0);
  }

  // ============================================================
  // Progress Bar
  // ============================================================
  function updateProgress(qIndex) {
    var total = DATA.questions.length;
    var current = qIndex + 1;
    var pct = Math.round((current / total) * 100);
    $('#progress-text').textContent = current + ' / ' + total;
    $('#progress-pct').textContent = pct + '%';
    $('#progress-fill').style.width = pct + '%';
  }

  // ============================================================
  // Quiz Engine
  // ============================================================
  function getStageEls() {
    return {
      a: $('#stage-a'),
      b: $('#stage-b')
    };
  }

  function buildQuestionHTML(qIndex) {
    var q = DATA.questions[qIndex];
    var html = '<h2 class="question-text">Q' + q.id + '. ' + q.text + '</h2>';
    html += '<div class="options-list">';
    for (var i = 0; i < q.options.length; i++) {
      var opt = q.options[i];
      var selectedClass = (state.answers[qIndex] === i) ? ' selected' : '';
      html += '<button class="option-btn' + selectedClass + '" data-question="' + qIndex + '" data-option="' + i + '">';
      html += '<span class="option-label">' + opt.label + '.</span>';
      html += '<span>' + opt.text + '</span>';
      html += '</button>';
    }
    html += '</div>';
    return html;
  }

  function renderQuestion(qIndex, direction) {
    if (state.transitioning) return;

    var stages = getStageEls();
    var currentStage = stages[state.activeStage];
    var nextStageKey = state.activeStage === 'a' ? 'b' : 'a';
    var nextStage = stages[nextStageKey];

    // Populate next stage content
    nextStage.innerHTML = buildQuestionHTML(qIndex);

    // Position next stage off-screen
    nextStage.classList.remove('stage-center', 'stage-left', 'stage-right');
    if (direction === 'forward') {
      nextStage.classList.add('stage-right');
    } else {
      nextStage.classList.add('stage-left');
    }

    // Force reflow so the initial position is applied before transition
    nextStage.offsetHeight; // eslint-disable-line no-unused-expressions

    state.transitioning = true;

    // Slide current out, next in
    currentStage.classList.remove('stage-center');
    if (direction === 'forward') {
      currentStage.classList.add('stage-left');
    } else {
      currentStage.classList.add('stage-right');
    }
    nextStage.classList.remove('stage-left', 'stage-right');
    nextStage.classList.add('stage-center');

    state.activeStage = nextStageKey;
    state.currentQuestion = qIndex;
    updateProgress(qIndex);

    // Update back button visibility
    var backBtn = $('#btn-back');
    if (qIndex > 0) {
      backBtn.classList.add('visible');
    } else {
      backBtn.classList.remove('visible');
    }

    // Transition end
    setTimeout(function () {
      state.transitioning = false;
    }, 400);
  }

  function renderFirstQuestion() {
    var stages = getStageEls();
    stages.a.innerHTML = buildQuestionHTML(0);
    stages.a.classList.add('stage-center');
    stages.a.classList.remove('stage-left', 'stage-right');
    stages.b.classList.add('stage-right');
    stages.b.classList.remove('stage-center', 'stage-left');
    state.activeStage = 'a';
    state.currentQuestion = 0;
    updateProgress(0);
    $('#btn-back').classList.remove('visible');
  }

  // ============================================================
  // Scoring
  // ============================================================
  function applyScores(qIndex, optIndex, sign) {
    var opt = DATA.questions[qIndex].options[optIndex];
    var sc = opt.scores;
    for (var key in sc) {
      if (sc.hasOwnProperty(key)) {
        state.scores[key] += sc[key] * sign;
      }
    }
  }

  function handleOptionSelect(qIndex, optIndex) {
    if (state.transitioning) return;

    // Reverse previous answer scores if re-answering
    if (state.answers[qIndex] !== null) {
      applyScores(qIndex, state.answers[qIndex], -1);
    }

    // Apply new scores
    state.answers[qIndex] = optIndex;
    applyScores(qIndex, optIndex, 1);

    // Visual feedback: highlight selected option
    var stages = getStageEls();
    var currentStage = stages[state.activeStage];
    var buttons = currentStage.querySelectorAll('.option-btn');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].classList.remove('selected');
    }
    buttons[optIndex].classList.add('selected');

    // Auto-advance after delay
    setTimeout(function () {
      if (qIndex < DATA.questions.length - 1) {
        renderQuestion(qIndex + 1, 'forward');
      } else {
        // Last question answered → loading → result
        showLoading();
      }
    }, 400);
  }

  function goBack() {
    if (state.currentQuestion > 0 && !state.transitioning) {
      renderQuestion(state.currentQuestion - 1, 'backward');
    }
  }

  // ============================================================
  // Loading & Result Computation
  // ============================================================
  function showLoading() {
    showView('loading');
    setTimeout(function () {
      computeResult();
      showView('result');
    }, 2500);
  }

  function computeResult() {
    var dims = DATA.dimensionOrder;
    var typeKey = '';
    var confidence = 0;
    var strongDims = 0;

    for (var i = 0; i < dims.length; i++) {
      var dimDef = DATA.dimensions[dims[i]];
      var scoreA = state.scores[dimDef.poleA.key];
      var scoreB = state.scores[dimDef.poleB.key];

      // Determine pole
      if (scoreA >= scoreB) {
        typeKey += dimDef.poleA.code;
      } else {
        typeKey += dimDef.poleB.code;
      }

      // Calculate confidence for this dimension
      var total = scoreA + scoreB;
      if (total > 0) {
        var margin = Math.abs(scoreA - scoreB);
        var dimConf = 50 + (margin / total) * 50;
        confidence += dimConf;
        if (margin > 2) strongDims++;
      } else {
        confidence += 50;
      }
    }

    confidence = Math.round(confidence / dims.length);
    state.resultType = DATA.typeMap[typeKey];
    state.confidence = confidence;
    state.strongDims = strongDims;

    renderResultPage();
  }

  // ============================================================
  // Result Page Rendering
  // ============================================================
  function renderResultPage() {
    var p = DATA.personalities[state.resultType];
    if (!p) return;

    var container = $('#result-container');
    var html = '';

    // Hero section
    html += '<div class="result-hero">';
    html += '<div class="result-emoji">' + p.emoji + '</div>';
    html += '<div class="result-code">' + p.code.split('').join(' ') + '</div>';
    html += '<h1 class="result-name">' + p.nameCN + '</h1>';
    html += '<div class="dimension-tags">';
    for (var i = 0; i < p.dimensions.length; i++) {
      html += '<span class="dim-tag">' + p.dimensions[i] + '</span>';
    }
    html += '</div>';
    html += '<p class="result-tagline">' + p.tagline + '</p>';
    html += '</div>';

    // Confidence
    html += '<div class="result-confidence">';
    html += '匹配度 ' + state.confidence + '% · 命中 ' + state.strongDims + '/4 维';
    html += '</div>';

    // Description
    html += '<div class="result-section">';
    html += '<div class="section-title">📖 人格描述</div>';
    html += '<div class="result-description">' + p.description + '</div>';
    html += '</div>';

    // Player archetype
    html += '<div class="result-section">';
    html += '<div class="section-title">⭐ 你的球场灵魂像</div>';
    html += '<div class="archetype-name">' + p.playerArchetype.name + '</div>';
    html += '<div class="archetype-desc">' + p.playerArchetype.desc + '</div>';
    html += '</div>';

    // Stats
    html += '<div class="result-section">';
    html += '<div class="section-title">📊 能力雷达</div>';
    for (var j = 0; j < DATA.statMeta.length; j++) {
      var sm = DATA.statMeta[j];
      var val = p.stats[sm.key];
      html += '<div class="stat-row">';
      html += '<span class="stat-emoji">' + sm.emoji + '</span>';
      html += '<span class="stat-label">' + sm.label + '</span>';
      html += '<div class="stat-bar-track"><div class="stat-bar-fill" data-value="' + val + '" style="transition-delay:' + (j * 100) + 'ms"></div></div>';
      html += '<span class="stat-value">' + val + '</span>';
      html += '</div>';
    }
    html += '</div>';

    // Traits
    html += '<div class="result-section">';
    html += '<div class="section-title">🏸 行为特征</div>';
    html += '<div class="trait-item"><span class="trait-label">🏸 核心行为</span>' + p.coreBehavior + '</div>';
    html += '<div class="trait-item"><span class="trait-label">📋 行为模式</span>' + p.behaviorPattern + '</div>';
    html += '<div class="trait-item"><span class="trait-label">💬 经典语录</span>' + p.quote + '</div>';
    html += '</div>';

    // Partner card
    var partnerData = DATA.personalities[p.partner.code];
    html += '<div class="result-section match-card partner">';
    html += '<div class="match-type-header">🏸 最佳双打搭档</div>';
    html += '<div class="match-type-name">' + partnerData.emoji + ' ' + partnerData.code + ' ' + partnerData.nameCN + '</div>';
    html += '<div class="match-reason">' + p.partner.reason + '</div>';
    html += '</div>';

    // Rival card
    var rivalData = DATA.personalities[p.rival.code];
    html += '<div class="result-section match-card rival">';
    html += '<div class="match-type-header">⚔️ 最佳对打宿敌</div>';
    html += '<div class="match-type-name">' + rivalData.emoji + ' ' + rivalData.code + ' ' + rivalData.nameCN + '</div>';
    html += '<div class="match-reason">' + p.rival.reason + '</div>';
    html += '</div>';

    // Share section
    html += '<div class="share-section">';
    html += '<button class="share-btn primary" id="btn-share-partner">🏸 发给你的双打搭子，看看你们有多配！</button>';
    html += '<button class="share-btn secondary" id="btn-share-rival">⚔️ @ 你最想赢的那个人，让他知道你是谁</button>';
    html += '</div>';

    // Gallery
    html += '<div class="result-section">';
    html += '<div class="gallery-title">🏆 集齐 16 种球场人格</div>';
    html += '<div class="gallery-subtitle">分享给球友们，看谁的朋友圈先集齐全部 16 种！</div>';
    html += '<div class="gallery-grid">';
    for (var k = 0; k < DATA.allTypeCodes.length; k++) {
      var tc = DATA.allTypeCodes[k];
      var tp = DATA.personalities[tc];
      var isActive = tc === state.resultType;
      var itemClass = isActive ? 'gallery-item active' : 'gallery-item locked';
      html += '<div class="' + itemClass + '">';
      html += '<div class="gallery-emoji">' + tp.emoji + '</div>';
      html += '<span class="gallery-code">' + tp.code + '</span>';
      html += '<span class="gallery-name">' + tp.nameCN + '</span>';
      html += '</div>';
    }
    html += '</div>';
    html += '</div>';

    // Footer
    html += '<div class="result-footer">';
    html += '<p class="disclaimer">本测试仅供娱乐，别拿它当选拔依据、搭子判决书或分手理由。你的球场人格不代表你的真实水平——毕竟测出「暴力美学」的人可能杀球只有 80 码。打球开心就好！</p>';
    html += '<button class="restart-btn" id="btn-restart">🔄 重新测试</button>';
    html += '</div>';

    container.innerHTML = html;

    // Animate stat bars after render
    setTimeout(function () {
      var fills = container.querySelectorAll('.stat-bar-fill');
      for (var f = 0; f < fills.length; f++) {
        fills[f].style.width = fills[f].dataset.value + '%';
      }
    }, 100);

    // Bind share buttons
    var sharePartnerBtn = document.getElementById('btn-share-partner');
    var shareRivalBtn = document.getElementById('btn-share-rival');
    var restartBtn = document.getElementById('btn-restart');

    if (sharePartnerBtn) {
      sharePartnerBtn.addEventListener('click', function () {
        handleShare('partner');
      });
    }
    if (shareRivalBtn) {
      shareRivalBtn.addEventListener('click', function () {
        handleShare('rival');
      });
    }
    if (restartBtn) {
      restartBtn.addEventListener('click', resetQuiz);
    }
  }

  // ============================================================
  // Sharing
  // ============================================================
  function handleShare(type) {
    var p = DATA.personalities[state.resultType];
    var title, text;

    if (type === 'partner') {
      var partnerData = DATA.personalities[p.partner.code];
      title = '🏸 我是' + p.emoji + p.nameCN + '！';
      text = '我的最佳双打搭档是' + partnerData.emoji + partnerData.nameCN + '！快来测测你是什么球场灵魂？';
    } else {
      var rivalData = DATA.personalities[p.rival.code];
      title = '⚔️ 我是' + p.emoji + p.nameCN + '！';
      text = '我的对打宿敌是' + rivalData.emoji + rivalData.nameCN + '！你敢来测测吗？';
    }

    var shareUrl = window.location.href.split('#')[0];

    // Try Web Share API first
    if (navigator.share) {
      navigator.share({
        title: title,
        text: text,
        url: shareUrl
      }).catch(function () {
        // User cancelled or error, fall back to copy
        copyToClipboard(text + ' ' + shareUrl);
      });
    } else {
      copyToClipboard(text + ' ' + shareUrl);
    }
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        showToast('链接已复制，快去分享给球友吧！');
      }).catch(function () {
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;left:-9999px;top:-9999px';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showToast('链接已复制，快去分享给球友吧！');
    } catch (e) {
      showToast('请手动复制链接分享');
    }
    document.body.removeChild(ta);
  }

  function showToast(msg) {
    var toast = $('#toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(function () {
      toast.classList.remove('show');
    }, 2500);
  }

  // ============================================================
  // Reset
  // ============================================================
  function resetQuiz() {
    state.currentQuestion = 0;
    state.answers = new Array(DATA.questions.length).fill(null);
    state.scores = {
      attack: 0, defense: 0,
      skill: 0, power: 0,
      plan: 0, random: 0,
      zen: 0, heated: 0
    };
    state.resultType = null;
    state.confidence = null;
    state.strongDims = null;
    state.transitioning = false;
    state.activeStage = 'a';
    showView('home');
  }

  // ============================================================
  // Event Delegation for Quiz Options
  // ============================================================
  function setupQuizEvents() {
    var container = $('#stage-container');
    container.addEventListener('click', function (e) {
      var btn = e.target.closest('.option-btn');
      if (!btn) return;
      var qIndex = parseInt(btn.dataset.question, 10);
      var oIndex = parseInt(btn.dataset.option, 10);
      handleOptionSelect(qIndex, oIndex);
    });
  }

  // ============================================================
  // Init
  // ============================================================
  function init() {
    // Start button
    $('#btn-start').addEventListener('click', function () {
      showView('quiz');
      renderFirstQuestion();
    });

    // Back button
    $('#btn-back').addEventListener('click', goBack);

    // Quiz option event delegation
    setupQuizEvents();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
