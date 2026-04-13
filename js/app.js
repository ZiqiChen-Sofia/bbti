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
    var hasImg = q.options.some(function(o) { return !!o.img; });
    var html = '';
    if (q.scene) {
      html += '<p class="scene-text">' + q.scene + '</p>';
    }
    html += '<h2 class="question-text">Q' + q.id + '. ' + q.text + '</h2>';
    html += '<div class="options-list' + (hasImg ? ' options-grid' : '') + '">';
    for (var i = 0; i < q.options.length; i++) {
      var opt = q.options[i];
      var selectedClass = (state.answers[qIndex] === i) ? ' selected' : '';
      html += '<button class="option-btn' + (hasImg ? ' option-img-btn' : '') + selectedClass + '" data-question="' + qIndex + '" data-option="' + i + '">';
      if (opt.img) {
        html += '<img class="option-img" src="' + opt.img + '" alt="' + opt.text + '">';
        html += '<span class="option-img-label">' + opt.label + '. ' + opt.text.replace('.png', '') + '</span>';
      } else {
        html += '<span class="option-label">' + opt.label + '.</span>';
        html += '<span>' + opt.text + '</span>';
      }
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
    var p = DATA.personalities[state.resultType];
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
    html += '<span class="quadrant-corner corner-tl">技巧·防守</span>';
    html += '<span class="quadrant-corner corner-tr">技巧·进攻</span>';
    html += '<span class="quadrant-corner corner-bl">力量·防守</span>';
    html += '<span class="quadrant-corner corner-br">力量·进攻</span>';
    html += '<div class="quadrant-axis-x"></div>';
    html += '<div class="quadrant-axis-y"></div>';
    html += '<span class="quadrant-label label-top">🎯 技巧</span>';
    html += '<span class="quadrant-label label-bottom">💪 力量</span>';
    html += '<span class="quadrant-label label-left">🛡️ 防守</span>';
    html += '<span class="quadrant-label label-right">🗡️ 进攻</span>';
    html += '<div class="' + dotClass + '" data-left="' + finalLeft + '" data-top="' + finalTop + '"></div>';
    html += '<div class="dot-label">' + (p ? p.dotLabel : '') + '</div>';
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

    // Position and show dot interpretation label
    var label = container.querySelector('.dot-label');
    if (label) {
      label.style.left = dot.dataset.left + '%';
      label.style.top = 'calc(' + dot.dataset.top + '% + 18px)';
      setTimeout(function () {
        label.classList.add('show');
      }, 100);
    }

    // Add breathing animation after bounce settles
    setTimeout(function () {
      dot.style.animation = 'dotBreathe 2s ease-in-out infinite';
    }, 900);
  }

  // ============================================================
  // Result Page Rendering
  // ============================================================
  function renderResultPage() {
    var p = DATA.personalities[state.resultType];
    if (!p) return;

    var container = $('#result-container');
    var html = '';

    // ── Hero section ──
    var avatarSrc = 'img/' + state.resultType.toLowerCase() + '.png';
    html += '<div class="result-hero">';
    html += '<img class="result-avatar" src="' + avatarSrc + '" alt="' + p.nameCN + '">';
    html += '<div class="result-code">' + p.code.split('').join(' ') + '</div>';
    html += '<h1 class="result-name">' + p.nameCN + '</h1>';
    html += '<div class="result-slogan">' + p.slogan + '</div>';
    html += '<div class="dimension-tags">';
    for (var d = 0; d < p.dimensions.length; d++) {
      html += '<span class="dim-tag">' + p.dimensions[d] + '</span>';
    }
    html += '</div>';
    html += '<p class="result-tagline">' + p.tagline + '</p>';
    html += '</div>';

    // ── Quadrant Chart ──
    html += '<div class="result-section">';
    html += buildQuadrantChart();
    html += '</div>';

    // ── Traits (行为卡片) ──
    html += '<div class="result-section">';
    html += '<div class="trait-item"><span class="trait-label">🏸 核心行为</span>' + p.coreBehavior + '</div>';
    html += '<div class="trait-item"><span class="trait-label">🏸 行为模式</span>' + p.behaviorPattern + '</div>';
    html += '<div class="trait-item"><span class="trait-label">🏸 经典语录</span><span class="quote-copyable" data-quote="' + p.quote.replace(/"/g, '&quot;') + '">' + p.quote + '</span></div>';
    html += '</div>';

    // ── Player archetype (灵魂像) ──
    html += '<div class="result-section">';
    html += '<div class="section-title">⭐ 你的球场灵魂像</div>';
    html += '<div class="archetype-name">' + p.playerArchetype.name + '</div>';
    html += '<div class="archetype-desc">' + p.playerArchetype.desc + '</div>';
    html += '</div>';

    // ── Partner & Rival cards (side by side, horizontal layout) ──
    var partnerData = DATA.personalities[p.partner.code];
    var partnerAvatar = 'img/' + p.partner.code.toLowerCase() + '.png';
    var rivalData = DATA.personalities[p.rival.code];
    var rivalAvatar = 'img/' + p.rival.code.toLowerCase() + '.png';

    html += '<div class="match-row">';

    html += '<div class="result-section match-card partner">';
    html += '<div class="match-type-header">🏸 最佳搭档</div>';
    html += '<div class="match-body">';
    html += '<img class="match-avatar" src="' + partnerAvatar + '" alt="' + partnerData.nameCN + '">';
    html += '<div class="match-text"><div class="match-type-name">' + partnerData.nameCN + '</div>';
    html += '<div class="match-reason">' + p.partner.shortTag + '</div></div>';
    html += '</div></div>';

    html += '<div class="result-section match-card rival">';
    html += '<div class="match-type-header">⚔️ 宿敌</div>';
    html += '<div class="match-body">';
    html += '<img class="match-avatar" src="' + rivalAvatar + '" alt="' + rivalData.nameCN + '">';
    html += '<div class="match-text"><div class="match-type-name">' + rivalData.nameCN + '</div>';
    html += '<div class="match-reason">' + p.rival.shortTag + '</div></div>';
    html += '</div></div>';

    html += '</div>';

    // ── Share section ──
    html += '<div class="share-section">';
    html += '<button class="share-btn primary" id="btn-share">🏸 转发找到你的搭子/宿敌</button>';
    html += '<button class="share-btn secondary" id="btn-share-card">🖼️ 生成分享卡片</button>';
    html += '</div>';

    // ── Footer ──
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

    // Quote click-to-copy
    var quoteEl = container.querySelector('.quote-copyable');
    if (quoteEl) {
      quoteEl.addEventListener('click', function () {
        var text = quoteEl.dataset.quote;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function () {
            showToast('语录已复制！');
          }).catch(function () {
            showToast('语录已复制！');
          });
        } else {
          var ta = document.createElement('textarea');
          ta.value = text;
          ta.style.cssText = 'position:fixed;left:-9999px;top:-9999px';
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand('copy'); } catch (e) { /* ignore */ }
          document.body.removeChild(ta);
          showToast('语录已复制！');
        }
      });
    }
  }

  // ============================================================
  // Canvas Share Card
  // ============================================================
  function generateShareCard() {
    var p = DATA.personalities[state.resultType];
    var partnerData = DATA.personalities[p.partner.code];
    var rivalData = DATA.personalities[p.rival.code];

    // Preload 3 avatar images, then draw
    var srcs = [
      'img/' + state.resultType.toLowerCase() + '.png',
      'img/' + p.partner.code.toLowerCase() + '.png',
      'img/' + p.rival.code.toLowerCase() + '.png'
    ];
    var imgs = [];
    var loaded = 0;
    for (var si = 0; si < srcs.length; si++) {
      (function (idx) {
        var img = new Image();
        img.onload = img.onerror = function () {
          imgs[idx] = img;
          loaded++;
          if (loaded === srcs.length) drawCard(p, partnerData, rivalData, imgs);
        };
        img.src = srcs[idx];
      })(si);
    }
  }

  function drawRoundedImage(ctx, img, x, y, size, radius) {
    ctx.save();
    roundRect(ctx, x, y, size, size, radius);
    ctx.clip();
    ctx.drawImage(img, x, y, size, size);
    ctx.restore();
    ctx.strokeStyle = '#EBE3D5';
    ctx.lineWidth = 2;
    roundRect(ctx, x, y, size, size, radius);
    ctx.stroke();
  }

  function drawCard(p, partnerData, rivalData, imgs) {
    var canvas = document.getElementById('share-canvas');
    var dpr = Math.min(window.devicePixelRatio || 1, 3);
    var W = 360;

    // --- Phase 1: measure content height ---
    var offscreen = document.createElement('canvas');
    offscreen.width = W;
    offscreen.height = 1;
    var mctx = offscreen.getContext('2d');
    mctx.font = '12px -apple-system, PingFang SC, sans-serif';

    var ty = 282; // starting Y after code/name/tagline/divider (fixed part)
    var traits = [
      { label: '核心行为', value: p.coreBehavior },
      { label: '行为模式', value: p.behaviorPattern },
      { label: '经典语录', value: p.quote }
    ];
    for (var mt = 0; mt < traits.length; mt++) {
      var mlines = wrapText(mctx, traits[mt].value, W - 60);
      ty += mlines.length * 18 + 24;
    }
    // Archetype
    ty += 20; // label
    ty += 18; // name
    var marchLines = wrapText(mctx, p.playerArchetype.desc, W - 60);
    ty += marchLines.length * 16;
    ty += 32; // gap before match cards
    ty += 58; // match card height
    ty += 60; // footer CTA + padding

    var H = Math.max(ty, 480);

    // --- Phase 2: draw ---
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

    // Main avatar
    if (imgs[0] && imgs[0].complete && imgs[0].naturalWidth > 0) {
      drawRoundedImage(ctx, imgs[0], W / 2 - 48, 64, 96, 12);
    }

    // Code
    ctx.fillStyle = '#27AE60';
    ctx.font = 'bold 28px -apple-system, PingFang SC, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(p.code.split('').join('  '), W / 2, 186);

    // Name
    ctx.fillStyle = '#2C3E50';
    ctx.font = 'bold 22px -apple-system, PingFang SC, sans-serif';
    ctx.fillText(p.nameCN, W / 2, 216);

    // Tagline
    ctx.fillStyle = '#7A8B8C';
    ctx.font = 'italic 14px -apple-system, PingFang SC, sans-serif';
    ctx.fillText(p.tagline, W / 2, 240);

    // Divider
    ctx.strokeStyle = '#EBE3D5';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(40, 258); ctx.lineTo(W - 40, 258); ctx.stroke();

    // Traits section
    ctx.textAlign = 'left';
    var dy = 282;
    for (var t = 0; t < traits.length; t++) {
      ctx.fillStyle = '#FF6B35';
      ctx.font = 'bold 12px -apple-system, PingFang SC, sans-serif';
      ctx.fillText(traits[t].label, 30, dy);
      ctx.fillStyle = '#2C3E50';
      ctx.font = '12px -apple-system, PingFang SC, sans-serif';
      var lines = wrapText(ctx, traits[t].value, W - 60);
      for (var li = 0; li < lines.length; li++) {
        dy += 18;
        ctx.fillText(lines[li], 30, dy);
      }
      dy += 24;
    }

    // Archetype
    ctx.fillStyle = '#7A8B8C';
    ctx.font = '12px -apple-system, PingFang SC, sans-serif';
    ctx.fillText('球场灵魂像', 30, dy);
    dy += 20;
    ctx.fillStyle = '#27AE60';
    ctx.font = 'bold 16px -apple-system, PingFang SC, sans-serif';
    ctx.fillText(p.playerArchetype.name, 30, dy);
    dy += 18;
    ctx.fillStyle = '#7A8B8C';
    ctx.font = '12px -apple-system, PingFang SC, sans-serif';
    var archLines = wrapText(ctx, p.playerArchetype.desc, W - 60);
    for (var al = 0; al < archLines.length; al++) {
      dy += 16;
      ctx.fillText(archLines[al], 30, dy);
    }

    // Partner & Rival compact row
    dy += 32;
    var cardH = 58;
    var cardW = (W - 50) / 2;
    ctx.fillStyle = 'rgba(46,189,89,0.10)';
    roundRect(ctx, 20, dy - 14, cardW, cardH, 8);
    ctx.fill();
    if (imgs[1] && imgs[1].complete && imgs[1].naturalWidth > 0) {
      drawRoundedImage(ctx, imgs[1], 30, dy - 4, 32, 6);
    }
    ctx.fillStyle = '#2EBD59';
    ctx.font = 'bold 11px -apple-system, PingFang SC, sans-serif';
    ctx.fillText('最佳搭档', 68, dy + 4);
    ctx.fillStyle = '#2C3E50';
    ctx.font = '13px -apple-system, PingFang SC, sans-serif';
    ctx.fillText(partnerData.nameCN, 68, dy + 24);

    var rx = 20 + cardW + 10;
    ctx.fillStyle = 'rgba(231,76,60,0.10)';
    roundRect(ctx, rx, dy - 14, cardW, cardH, 8);
    ctx.fill();
    if (imgs[2] && imgs[2].complete && imgs[2].naturalWidth > 0) {
      drawRoundedImage(ctx, imgs[2], rx + 10, dy - 4, 32, 6);
    }
    ctx.fillStyle = '#E74C3C';
    ctx.font = 'bold 11px -apple-system, PingFang SC, sans-serif';
    ctx.fillText('宿敌', rx + 48, dy + 4);
    ctx.fillStyle = '#2C3E50';
    ctx.font = '13px -apple-system, PingFang SC, sans-serif';
    ctx.fillText(rivalData.nameCN, rx + 48, dy + 24);

    // Footer CTA
    ctx.textAlign = 'center';
    ctx.fillStyle = '#7A8B8C';
    ctx.font = '12px -apple-system, PingFang SC, sans-serif';
    ctx.fillText('快来测测你是什么球场灵魂？', W / 2, H - 40);
    ctx.fillStyle = '#EBE3D5';
    ctx.font = '11px -apple-system, PingFang SC, sans-serif';
    ctx.fillText('BBTI · by @momo', W / 2, H - 20);

    // Convert canvas to <img> for long-press saving
    var imgEl = document.getElementById('share-card-img');
    if (!imgEl) {
      imgEl = document.createElement('img');
      imgEl.id = 'share-card-img';
      imgEl.className = 'share-card-img';
      canvas.parentNode.insertBefore(imgEl, canvas);
    }
    imgEl.src = canvas.toDataURL('image/png');
    imgEl.style.display = 'block';
    canvas.style.display = 'none';

    // Show overlay
    document.getElementById('share-overlay').classList.add('show');
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
    showToast('长按上方图片即可保存到相册');
  }

  function closeShareCard() {
    document.getElementById('share-overlay').classList.remove('show');
    // Reset: hide img, show canvas for next generation
    var imgEl = document.getElementById('share-card-img');
    if (imgEl) imgEl.style.display = 'none';
    var canvas = document.getElementById('share-canvas');
    canvas.style.display = '';
  }

  // ============================================================
  // Sharing
  // ============================================================
  function handleShare(type) {
    var p = DATA.personalities[state.resultType];
    var partnerData = DATA.personalities[p.partner.code];
    var rivalData = DATA.personalities[p.rival.code];
    var text = '🏸 我是' + p.emoji + ' ' + p.nameCN + '！\n'
      + p.slogan + '\n'
      + '最佳搭档 ' + partnerData.emoji + ' ' + partnerData.nameCN + '：' + p.partner.shortTag + '\n'
      + '宿敌 ' + rivalData.emoji + ' ' + rivalData.nameCN + '：' + p.rival.shortTag + '\n'
      + '快来测测你是什么球场灵魂？\n'
      + window.location.href.split('#')[0];

    // Copy to clipboard, then show guide overlay
    var onCopied = function () {
      showShareGuide(text);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(onCopied).catch(function () {
        fallbackCopy(text);
        onCopied();
      });
    } else {
      fallbackCopy(text);
      onCopied();
    }
  }

  function showShareGuide(text) {
    var overlay = document.getElementById('share-guide-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'share-guide-overlay';
      overlay.className = 'share-guide-overlay';
      overlay.innerHTML =
        '<div class="share-guide-card">' +
          '<div class="share-guide-icon">✅</div>' +
          '<div class="share-guide-title">分享文案已复制</div>' +
          '<div class="share-guide-text" id="share-guide-text"></div>' +
          '<div class="share-guide-hint">打开微信 → 选择好友 → 长按粘贴发送</div>' +
          '<button class="share-guide-btn" id="share-guide-close">知道了</button>' +
        '</div>';
      document.body.appendChild(overlay);
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay || e.target.id === 'share-guide-close') {
          overlay.classList.remove('show');
        }
      });
    }
    document.getElementById('share-guide-text').textContent = text;
    // Force reflow then show
    overlay.offsetHeight;
    overlay.classList.add('show');
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        showToast('已复制到剪贴板');
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
    } catch (e) { /* silent */ }
    document.body.removeChild(ta);
  }

  function showToast(msg) {
    var toast = $('#toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(function () {
      toast.classList.remove('show');
    }, 3500);
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
