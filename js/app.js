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
    var html = '';
    if (q.scene) {
      html += '<p class="scene-text">' + q.scene + '</p>';
    }
    html += '<h2 class="question-text">Q' + q.id + '. ' + q.text + '</h2>';
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

    if (navigator.vibrate) { navigator.vibrate(10); }

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
  var loadingMessages = [
    '正在分析你的球场灵魂...',
    '检测到大量杀球倾向...',
    '识别到网前炒菜基因...',
    '计算搭子匹配度...',
    '结果即将揭晓！'
  ];
  var loadingTimer = null;

  function showLoading() {
    showView('loading');
    var el = document.getElementById('loading-subtext');
    var idx = 0;
    el.textContent = loadingMessages[0];
    loadingTimer = setInterval(function () {
      idx++;
      if (idx < loadingMessages.length) {
        el.style.opacity = '0';
        setTimeout(function () {
          el.textContent = loadingMessages[idx];
          el.style.opacity = '1';
        }, 150);
      }
    }, 800);
    setTimeout(function () {
      clearInterval(loadingTimer);
      loadingTimer = null;
      computeResult();
      showView('result');
    }, 800 * loadingMessages.length);
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
  // Quadrant Chart Builder
  // ============================================================
  function buildQuadrantChart() {
    var s = state.scores;
    var isPlanner = s.plan >= s.random;
    var isZen = s.zen >= s.heated;
    var dotClass = 'quadrant-dot';
    if (isZen && isPlanner) dotClass += ' zen-plan';
    else if (isZen && !isPlanner) dotClass += ' zen-random';
    else if (!isZen && isPlanner) dotClass += ' heated-plan';
    else dotClass += ' heated-random';

    var xNorm = (s.attack - s.defense) / 8;
    var yNorm = (s.skill - s.power) / 8;
    var finalLeft = (50 + xNorm * 42).toFixed(1);
    var finalTop = (50 - yNorm * 42).toFixed(1);

    var html = '';
    html += '<div class="quadrant-chart">';
    html += '<div class="quadrant-axis-x"></div>';
    html += '<div class="quadrant-axis-y"></div>';
    html += '<span class="quadrant-label label-top">🎯 技巧</span>';
    html += '<span class="quadrant-label label-bottom">💪 力量</span>';
    html += '<span class="quadrant-label label-left">🛡️ 防守</span>';
    html += '<span class="quadrant-label label-right">🗡️ 进攻</span>';
    html += '<div class="' + dotClass + '" data-left="' + finalLeft + '" data-top="' + finalTop + '"></div>';
    html += '</div>';

    // Legend
    html += '<div class="chart-legend">';
    html += '<span class="legend-item"><span class="legend-dot filled-cyan"></span> 佛系+计划</span>';
    html += '<span class="legend-item"><span class="legend-dot hollow-cyan"></span> 佛系+随性</span>';
    html += '<span class="legend-item"><span class="legend-dot filled-orange"></span> 上头+计划</span>';
    html += '<span class="legend-item"><span class="legend-dot hollow-orange"></span> 上头+随性</span>';
    html += '</div>';

    return html;
  }

  function animateChartDot(container) {
    var dot = container.querySelector('.quadrant-dot');
    if (!dot) return;
    dot.style.left = dot.dataset.left + '%';
    dot.style.top = dot.dataset.top + '%';
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
    html += '<p class="result-tagline">' + p.tagline + '</p>';
    html += '</div>';

    // Traits (moved before archetype)
    html += '<div class="result-section">';
    html += '<div class="trait-item"><span class="trait-label">🏸 核心行为</span>' + p.coreBehavior + '</div>';
    html += '<div class="trait-item"><span class="trait-label">📋 行为模式</span>' + p.behaviorPattern + '</div>';
    html += '<div class="trait-item"><span class="trait-label">💬 经典语录</span>' + p.quote + '</div>';
    html += '</div>';

    // Player archetype
    html += '<div class="result-section">';
    html += '<div class="section-title">⭐ 你的球场灵魂像</div>';
    html += '<div class="archetype-name">' + p.playerArchetype.name + '</div>';
    html += '<div class="archetype-desc">' + p.playerArchetype.desc + '</div>';
    html += '</div>';

    // Quadrant Chart
    html += '<div class="result-section">';
    html += '<div class="section-title">📊 维度坐标</div>';
    html += buildQuadrantChart();
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
    html += '<button class="share-btn primary" id="btn-share">🏸 转发找到你的搭子/宿敌</button>';
    html += '<button class="share-btn secondary" id="btn-share-card">🖼️ 生成分享卡片</button>';
    html += '</div>';

    // Footer
    html += '<div class="result-footer">';
    html += '<p class="disclaimer">本测试仅供娱乐，别拿它当选拔依据、搭子判决书或分手理由。你的球场人格不代表你的真实水平——毕竟测出「暴力美学」的人可能杀球只有 80 码。打球开心就好！</p>';
    html += '<button class="restart-btn" id="btn-restart">🔄 重新测试</button>';
    html += '<p class="author-credit">by @momo</p>';
    html += '</div>';

    container.innerHTML = html;

    // Animate quadrant chart dot after render
    setTimeout(function () {
      animateChartDot(container);
    }, 500);

    // Bind buttons
    var shareBtn = document.getElementById('btn-share');
    var shareCardBtn = document.getElementById('btn-share-card');
    var restartBtn = document.getElementById('btn-restart');

    if (shareBtn) {
      shareBtn.addEventListener('click', function () {
        handleShare('general');
      });
    }
    if (shareCardBtn) {
      shareCardBtn.addEventListener('click', function () {
        generateShareCard();
      });
    }
    if (restartBtn) {
      restartBtn.addEventListener('click', resetQuiz);
    }
  }

  // ============================================================
  // Canvas Share Card
  // ============================================================
  function generateShareCard() {
    var p = DATA.personalities[state.resultType];
    var partnerData = DATA.personalities[p.partner.code];
    var rivalData = DATA.personalities[p.rival.code];

    var canvas = document.getElementById('share-canvas');
    var dpr = Math.min(window.devicePixelRatio || 1, 3);
    var W = 360;
    var H = 640;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    var ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    // Background
    ctx.fillStyle = '#FFF9F0';
    ctx.fillRect(0, 0, W, H);

    // Court lines pattern
    ctx.strokeStyle = 'rgba(235,227,213,0.6)';
    ctx.lineWidth = 1;
    for (var i = 0; i < W; i += 60) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, H); ctx.stroke();
    }
    for (var j = 0; j < H; j += 60) {
      ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(W, j); ctx.stroke();
    }

    // Top accent bar
    var grad = ctx.createLinearGradient(0, 0, W, 0);
    grad.addColorStop(0, '#2EBD59');
    grad.addColorStop(1, '#5CD87A');
    ctx.fillStyle = grad;
    roundRect(ctx, 20, 20, W - 40, 6, 3);
    ctx.fill();

    // Title
    ctx.fillStyle = '#7A8B8C';
    ctx.font = '13px -apple-system, PingFang SC, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('BBTI 羽毛球人格测试', W / 2, 52);

    // Emoji
    ctx.font = '56px serif';
    ctx.fillText(p.emoji, W / 2, 120);

    // Code
    ctx.fillStyle = '#27AE60';
    ctx.font = 'bold 28px -apple-system, PingFang SC, sans-serif';
    ctx.fillText(p.code.split('').join('  '), W / 2, 158);

    // Name
    ctx.fillStyle = '#2C3E50';
    ctx.font = 'bold 22px -apple-system, PingFang SC, sans-serif';
    ctx.fillText(p.nameCN, W / 2, 192);

    // Tagline
    ctx.fillStyle = '#7A8B8C';
    ctx.font = 'italic 14px -apple-system, PingFang SC, sans-serif';
    ctx.fillText(p.tagline, W / 2, 218);

    // Divider
    ctx.strokeStyle = '#EBE3D5';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(40, 238); ctx.lineTo(W - 40, 238); ctx.stroke();

    // Traits section
    ctx.textAlign = 'left';
    var ty = 266;
    var traits = [
      { label: '核心行为', value: p.coreBehavior },
      { label: '行为模式', value: p.behaviorPattern },
      { label: '经典语录', value: p.quote }
    ];
    for (var t = 0; t < traits.length; t++) {
      ctx.fillStyle = '#FF6B35';
      ctx.font = 'bold 12px -apple-system, PingFang SC, sans-serif';
      ctx.fillText(traits[t].label, 30, ty);
      ctx.fillStyle = '#2C3E50';
      ctx.font = '12px -apple-system, PingFang SC, sans-serif';
      var lines = wrapText(ctx, traits[t].value, W - 60, 12);
      for (var li = 0; li < lines.length; li++) {
        ty += 18;
        ctx.fillText(lines[li], 30, ty);
      }
      ty += 24;
    }

    // Archetype
    ctx.fillStyle = '#7A8B8C';
    ctx.font = '12px -apple-system, PingFang SC, sans-serif';
    ctx.fillText('球场灵魂像', 30, ty);
    ty += 20;
    ctx.fillStyle = '#27AE60';
    ctx.font = 'bold 16px -apple-system, PingFang SC, sans-serif';
    ctx.fillText(p.playerArchetype.name, 30, ty);
    ty += 18;
    ctx.fillStyle = '#7A8B8C';
    ctx.font = '12px -apple-system, PingFang SC, sans-serif';
    var archLines = wrapText(ctx, p.playerArchetype.desc, W - 60, 12);
    for (var al = 0; al < archLines.length; al++) {
      ty += 16;
      ctx.fillText(archLines[al], 30, ty);
    }

    // Partner & Rival compact row
    ty += 32;
    // Partner
    ctx.fillStyle = 'rgba(46,189,89,0.10)';
    roundRect(ctx, 20, ty - 14, (W - 50) / 2, 50, 8);
    ctx.fill();
    ctx.fillStyle = '#2EBD59';
    ctx.font = 'bold 11px -apple-system, PingFang SC, sans-serif';
    ctx.fillText('最佳搭档', 30, ty + 2);
    ctx.fillStyle = '#2C3E50';
    ctx.font = '13px -apple-system, PingFang SC, sans-serif';
    ctx.fillText(partnerData.emoji + ' ' + partnerData.nameCN, 30, ty + 22);

    // Rival
    var rx = 20 + (W - 50) / 2 + 10;
    ctx.fillStyle = 'rgba(231,76,60,0.10)';
    roundRect(ctx, rx, ty - 14, (W - 50) / 2, 50, 8);
    ctx.fill();
    ctx.fillStyle = '#E74C3C';
    ctx.font = 'bold 11px -apple-system, PingFang SC, sans-serif';
    ctx.fillText('宿敌', rx + 10, ty + 2);
    ctx.fillStyle = '#2C3E50';
    ctx.font = '13px -apple-system, PingFang SC, sans-serif';
    ctx.fillText(rivalData.emoji + ' ' + rivalData.nameCN, rx + 10, ty + 22);

    // Footer CTA
    ctx.textAlign = 'center';
    ctx.fillStyle = '#7A8B8C';
    ctx.font = '12px -apple-system, PingFang SC, sans-serif';
    ctx.fillText('快来测测你是什么球场灵魂？', W / 2, H - 40);
    ctx.fillStyle = '#EBE3D5';
    ctx.font = '11px -apple-system, PingFang SC, sans-serif';
    ctx.fillText('BBTI · by @momo', W / 2, H - 20);

    // Show overlay
    var overlay = document.getElementById('share-overlay');
    overlay.classList.add('show');
  }

  function wrapText(ctx, text, maxWidth) {
    var result = [];
    var line = '';
    for (var i = 0; i < text.length; i++) {
      var testLine = line + text[i];
      if (ctx.measureText(testLine).width > maxWidth) {
        result.push(line);
        line = text[i];
      } else {
        line = testLine;
      }
    }
    if (line) result.push(line);
    return result;
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function saveShareCard() {
    var canvas = document.getElementById('share-canvas');
    try {
      var link = document.createElement('a');
      link.download = 'BBTI-' + state.resultType + '.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      showToast('图片已保存！');
    } catch (e) {
      // iOS Safari may block toDataURL in some contexts, try blob
      canvas.toBlob(function (blob) {
        if (!blob) {
          showToast('保存失败，请长按图片保存');
          return;
        }
        if (navigator.share) {
          var file = new File([blob], 'BBTI-' + state.resultType + '.png', { type: 'image/png' });
          navigator.share({ files: [file] }).catch(function () {
            showToast('请长按图片保存');
          });
        } else {
          showToast('请长按图片保存');
        }
      }, 'image/png');
    }
  }

  function closeShareCard() {
    document.getElementById('share-overlay').classList.remove('show');
  }

  // ============================================================
  // Sharing
  // ============================================================
  function handleShare(type) {
    var p = DATA.personalities[state.resultType];
    var partnerData = DATA.personalities[p.partner.code];
    var rivalData = DATA.personalities[p.rival.code];
    var title = '🏸 我是' + p.emoji + p.nameCN + '！';
    var text = '最佳搭档是' + partnerData.emoji + partnerData.nameCN + '，宿敌是' + rivalData.emoji + rivalData.nameCN + '！快来测测你是什么球场灵魂？';

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

    // Share card overlay buttons
    document.getElementById('btn-save-card').addEventListener('click', saveShareCard);
    document.getElementById('btn-close-card').addEventListener('click', closeShareCard);
    // Close overlay on backdrop click
    document.getElementById('share-overlay').addEventListener('click', function (e) {
      if (e.target === this) closeShareCard();
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
