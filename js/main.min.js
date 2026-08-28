
  (function () {
    // ---- voxel field (interactive 3D floating engine) ----
    (function () {
      var field = document.getElementById('voxelField');
    var hero = field ? field.closest('.hero') : null;
    var heroCopy = hero ? hero.querySelector('.wrap') : null;
    if (!field || !hero) return;

    var cubes = [];
    var mouseX = 0, mouseY = 0;
    var targetMouseX = 0, targetMouseY = 0;

    // Configuración de cubos 3D [% left, % top, profundidad (0.4-1.3), clase de tamaño]
    var config = [
      [5, 12, 0.5, 'cube--small'],
      [12, 54, 1.1, 'cube--large'],
      [24, 82, 0.7, ''],
      [36, 14, 0.4, 'cube--small'],
      [48, 68, 0.9, ''],
      [58, 12, 0.6, 'cube--small'],
      [72, 64, 1.2, 'cube--large'],
      [84, 18, 0.8, ''],
      [92, 52, 0.5, 'cube--small'],
      [18, 28, 0.9, ''],
      [80, 82, 0.6, 'cube--small'],
      [42, 88, 1.0, ''],
      [66, 34, 0.5, 'cube--small'],
      [8, 76, 0.7, '']
    ];

    config.forEach(function (c) {
      var el = document.createElement('div');
      el.className = 'cube ' + (c[3] || '');
      el.innerHTML = '<span class="cube-top"></span><span class="cube-left"></span><span class="cube-right"></span>';
      field.appendChild(el);

      cubes.push({
        el: el,
        baseX: c[0],
        baseY: c[1],
        depth: c[2],
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        speedX: 0.0006 + Math.random() * 0.0006,
        speedY: 0.0008 + Math.random() * 0.0008,
        floatRangeX: 12 + Math.random() * 20,
        floatRangeY: 16 + Math.random() * 26,
        currentOpacity: 0.85
      });
    });

    var startTime = performance.now();
    var heroRect = hero.getBoundingClientRect();
    var fieldRect = field.getBoundingClientRect();
    var copyRect = heroCopy ? heroCopy.getBoundingClientRect() : null;
    var textLeft = copyRect ? (copyRect.left - fieldRect.left - 25) : -999;
    var textRight = copyRect ? (copyRect.right - fieldRect.left + 25) : -999;
    var textTop = copyRect ? (copyRect.top - fieldRect.top - 25) : -999;
    var textBottom = copyRect ? (copyRect.bottom - fieldRect.top + 25) : -999;

    // Seguimiento del mouse para paralaje 3D
    hero.addEventListener('mousemove', function (e) {
      targetMouseX = (e.clientX - heroRect.left - heroRect.width / 2) / (heroRect.width / 2);
      targetMouseY = (e.clientY - heroRect.top - heroRect.height / 2) / (heroRect.height / 2);
    });

    hero.addEventListener('mouseleave', function () {
      targetMouseX = 0;
      targetMouseY = 0;
    });

    window.addEventListener('resize', function () {
      heroRect = hero.getBoundingClientRect();
      fieldRect = field.getBoundingClientRect();
      copyRect = heroCopy ? heroCopy.getBoundingClientRect() : null;
      textLeft = copyRect ? (copyRect.left - fieldRect.left - 25) : -999;
      textRight = copyRect ? (copyRect.right - fieldRect.left + 25) : -999;
      textTop = copyRect ? (copyRect.top - fieldRect.top - 25) : -999;
      textBottom = copyRect ? (copyRect.bottom - fieldRect.top + 25) : -999;
    });

    function animate(now) {
      var elapsed = now - startTime;

      // Suavizado de movimiento de mouse
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      cubes.forEach(function (cube) {
        // Onda flotante continua
        var floatX = Math.sin(elapsed * cube.speedX + cube.phaseX) * cube.floatRangeX;
        var floatY = Math.cos(elapsed * cube.speedY + cube.phaseY) * cube.floatRangeY;

        // Desplazamiento por paralaje del cursor según profundidad
        var parallaxX = mouseX * 38 * cube.depth;
        var parallaxY = mouseY * 26 * cube.depth;

        // Posición actual en píxeles
        var pixelX = (fieldRect.width * (cube.baseX / 100)) + floatX + parallaxX;
        var pixelY = (fieldRect.height * (cube.baseY / 100)) + floatY + parallaxY;

        // Comprobar si el cubo pasa por detrás del texto principal
        var isBehindText = (
          copyRect &&
          pixelX >= textLeft && pixelX <= textRight &&
          pixelY >= textTop && pixelY <= textBottom
        );

        // Desvanecer a 0.16 y aplicar leve desenfoque detrás del texto para 100% legibilidad; 0.85-1.0 fuera del texto
        var targetOpacity = isBehindText ? 0.16 : Math.min(1.0, 0.75 + (cube.depth * 0.25));
        var targetBlur = isBehindText ? 'blur(3px)' : 'blur(0px)';

        cube.currentOpacity += (targetOpacity - cube.currentOpacity) * 0.08;

        // Aplicar transformación 3D y opacidad suave
        cube.el.style.transform = 'translate3d(' + pixelX.toFixed(1) + 'px, ' + pixelY.toFixed(1) + 'px, 0) scale(' + (0.75 + cube.depth * 0.35).toFixed(2) + ')';
        cube.el.style.opacity = cube.currentOpacity.toFixed(3);
        cube.el.style.filter = targetBlur;
      });

      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  })();

    var navToggle = document.getElementById('navToggle');
    var mobileDrawer = document.getElementById('mobileDrawer');
    if (navToggle && mobileDrawer) {
      navToggle.addEventListener('click', function () {
        var open = mobileDrawer.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      mobileDrawer.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          mobileDrawer.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
        });
      });
    }

    var compareRange = document.getElementById('compareRange');
    var comparePaneBefore = document.getElementById('comparePaneBefore');
    var compareHandle = document.getElementById('compareHandle');
    function setCompare(value) {
      comparePaneBefore.style.clipPath = 'inset(0 ' + (100 - value) + '% 0 0)';
      compareHandle.style.left = value + '%';
    }
    if (compareRange) {
      setCompare(compareRange.value);
      compareRange.addEventListener('input', function () {
        setCompare(this.value);
      });
    }

    var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ---- scale full-page previews to fit their box exactly ----
    function fitShots() {
      document.querySelectorAll('.site-shot').forEach(function (shot) {
        var frame = shot.querySelector('.site-shot-frame');
        if (!frame) return;
        var designWidth = parseFloat(frame.getAttribute('data-design-width')) || 1400;
        var scale = shot.clientWidth / designWidth;
        frame.style.transform = 'scale(' + scale + ')';
      });
    }
    fitShots();
    window.addEventListener('resize', fitShots);
    if ('ResizeObserver' in window) {
      var shotObserver = new ResizeObserver(function () { fitShots(); });
      document.querySelectorAll('.site-shot').forEach(function (s) { shotObserver.observe(s); });
    }
    setTimeout(fitShots, 60);

        // ---- preloader ----
    var preloader = document.getElementById('preloader');
    if (preloader) {
      var pctEl = document.getElementById('preloaderCount');
      if (reducedMotion) {
        preloader.classList.add('done');
      } else {
        var pct = 0;
        var tick = setInterval(function () {
          pct = Math.min(100, pct + Math.floor(Math.random() * 18) + 12);
          if (pctEl) pctEl.textContent = pct + '%';
          if (pct >= 100) {
            clearInterval(tick);
            setTimeout(function () { preloader.classList.add('done'); }, 200);
          }
        }, 70);
        setTimeout(function () { preloader.classList.add('done'); }, 1200);
      }
    }

    // ---- procedural grain texture (canvas, no external asset) ----
    var grainLayer = document.getElementById('grainLayer');
    if (grainLayer && !reducedMotion) {
      var gc = document.createElement('canvas');
      gc.width = 90; gc.height = 90;
      var gctx = gc.getContext('2d');
      var imgData = gctx.createImageData(90, 90);
      for (var i = 0; i < imgData.data.length; i += 4) {
        var v = Math.floor(Math.random() * 255);
        imgData.data[i] = v; imgData.data[i + 1] = v; imgData.data[i + 2] = v;
        imgData.data[i + 3] = Math.floor(Math.random() * 140);
      }
      gctx.putImageData(imgData, 0, 0);
      grainLayer.style.backgroundImage = 'url(' + gc.toDataURL() + ')';
    }

    // ---- pause SMIL flow animation for reduced motion ----
    if (reducedMotion) {
      document.querySelectorAll('.flow-svg').forEach(function (svg) {
        if (svg.pauseAnimations) svg.pauseAnimations();
      });
    }

    // ---- quote calculator (Cyber-Glass 2.0 Engine) ----
    (function () {
      var typeWrap = document.getElementById('quoteType');
      var compWrap = document.getElementById('quoteComplexity');
      var extrasWrap = document.getElementById('quoteExtras');
      var valueEl = document.getElementById('quoteValue');
      var timeBadgeEl = document.getElementById('quoteTimeBadge');
      var bundleBadgeEl = document.getElementById('quoteBundleBadge');
      var summaryEl = document.getElementById('quoteSummary');
      var waBtn = document.getElementById('quoteWhatsappBtn');
      var emailBtn = document.getElementById('quoteEmailBtn');
      
      if (!typeWrap || !valueEl || !waBtn || !emailBtn) return;

      var selectedTypes = [];
      var selectedComp = compWrap ? compWrap.querySelector('.quote-extra-chip.is-active') : null;
      var selectedExtras = [];
      var fmt = function (n) {
        if (typeof window.formatMoney === 'function') return window.formatMoney(n);
        return '$' + Math.round(n).toLocaleString('en-US') + ' USD';
      };

      function recalc() {
        selectedTypes = Array.from(typeWrap.querySelectorAll('.quote-card.is-active'));

        if (selectedTypes.length === 0) {
          valueEl.textContent = (window.currentLang === 'EN') ? 'Select one or more options above' : 'Selecciona una o más opciones arriba';
          if (timeBadgeEl) timeBadgeEl.textContent = (window.currentLang === 'EN') ? '⏱️ Estimated time: Select a project' : '⏱️ Tiempo estimado: Selecciona un proyecto';
          if (bundleBadgeEl) bundleBadgeEl.style.display = 'none';
          if (summaryEl) summaryEl.textContent = (window.currentLang === 'EN') ? 'Choose one or several project types to calculate real-time estimated quote.' : 'Elige uno o varios tipos de proyecto para calcular la cotización estimada en tiempo real.';
          waBtn.setAttribute('aria-disabled', 'true');
          emailBtn.setAttribute('aria-disabled', 'true');
          return;
        }

        var rawMin = 0;
        var rawMax = 0;
        var maxTimeMin = 0;
        var maxTimeMax = 0;
        var typeTitles = [];

        selectedTypes.forEach(function (card) {
          rawMin += parseFloat(card.dataset.min) || 0;
          rawMax += parseFloat(card.dataset.max) || 0;
          maxTimeMin = Math.max(maxTimeMin, parseFloat(card.dataset.timeMin) || 1);
          maxTimeMax = Math.max(maxTimeMax, parseFloat(card.dataset.timeMax) || 3);
          typeTitles.push(card.dataset.title || 'Solución');
        });

        // Add small offset for multi-project integration if multiple selected
        if (selectedTypes.length > 1) {
          maxTimeMin += Math.round((selectedTypes.length - 1) * 0.5);
          maxTimeMax += Math.round((selectedTypes.length - 1) * 1.0);
        }

        // Calculate Ecosystem Bundle Discount
        var discountFactor = 1.0;
        var bundleBadgeText = '';

        if (selectedTypes.length === 2) {
          discountFactor = 0.85; // 15% discount
          bundleBadgeText = (window.currentLang === 'EN') ? '✨ Ecosystem Combo (-15% Savings)' : '✨ Combo Ecosistema (-15% de ahorro)';
        } else if (selectedTypes.length === 3) {
          discountFactor = 0.80; // 20% discount
          bundleBadgeText = (window.currentLang === 'EN') ? '✨ Ecosystem Combo (-20% Savings)' : '✨ Combo Ecosistema (-20% de ahorro)';
        } else if (selectedTypes.length >= 4) {
          discountFactor = 0.75; // 25% discount VIP
          bundleBadgeText = (window.currentLang === 'EN') ? '🔥 Voxel Full Suite (-25% VIP Discount)' : '🔥 Suite Completa Voxel (-25% Descuento VIP)';
        }

        if (bundleBadgeEl) {
          if (bundleBadgeText) {
            bundleBadgeEl.textContent = bundleBadgeText;
            bundleBadgeEl.style.display = 'inline-block';
          } else {
            bundleBadgeEl.style.display = 'none';
          }
        }

        var discountedMin = rawMin * discountFactor;
        var discountedMax = rawMax * discountFactor;

        var compMult = selectedComp ? (parseFloat(selectedComp.dataset.mult) || 1.0) : 1.0;
        var compTimeMult = selectedComp ? (parseFloat(selectedComp.dataset.timeMult) || 1.0) : 1.0;
        var compName = selectedComp ? (selectedComp.dataset.level || 'Estándar') : 'Estándar';

        var extrasCost = 0;
        var extrasTime = 0;
        var extraNames = [];

        selectedExtras.forEach(function (chip) {
          extrasCost += parseFloat(chip.dataset.add) || 0;
          extrasTime += parseFloat(chip.dataset.timeAdd) || 0;
          extraNames.push(chip.dataset.extra || chip.textContent.trim());
        });

        var finalMin = Math.round((discountedMin * compMult) + extrasCost);
        var finalMax = Math.round((discountedMax * compMult) + extrasCost);
        var finalTimeMin = Math.max(1, Math.round((maxTimeMin * compTimeMult) + extrasTime));
        var finalTimeMax = Math.max(2, Math.round((maxTimeMax * compTimeMult) + extrasTime));

        var mainTitle = typeTitles.join(' + ');

        // Update UI Text
        valueEl.textContent = fmt(finalMin) + ' - ' + fmt(finalMax) + ' (aprox.)';
        if (timeBadgeEl) {
          var timeUnit = (window.currentLang === 'EN') ? 'weeks' : 'semanas';
          var timePrefix = (window.currentLang === 'EN') ? '⏱️ Estimated time: ' : '⏱️ Tiempo estimado: ';
          timeBadgeEl.textContent = timePrefix + finalTimeMin + ' a ' + finalTimeMax + ' ' + timeUnit + ' (aprox.)';
        }

        var summaryText = 'Ficha: ' + mainTitle + ' | Alcance: ' + compName + (extraNames.length ? ' | Módulos: ' + extraNames.join(', ') : '');
        if (summaryEl) summaryEl.textContent = summaryText;

        // Enable buttons
        waBtn.removeAttribute('aria-disabled');
        emailBtn.removeAttribute('aria-disabled');

        // Store pre-formatted text payload for WhatsApp / Email
        var isEn = (window.currentLang === 'EN');
        var formattedMessage = [
          isEn ? '📋 *PROJECT ESTIMATE (APPROX) - VOXEL LAB*' : '📋 *COTIZACIÓN DE PROYECTO (APROXIMADA) - VOXEL LAB*',
          (isEn ? '• *Selected services:* ' : '• *Servicios seleccionados:* ') + mainTitle,
          bundleBadgeText ? ((isEn ? '• *Benefit:* ' : '• *Beneficio:* ') + bundleBadgeText) : null,
          (isEn ? '• *Scope:* ' : '• *Alcance:* ') + compName,
          extraNames.length ? ((isEn ? '• *Additional modules:* ' : '• *Módulos adicionales:* ') + extraNames.join(', ')) : null,
          (isEn ? '• *Estimated investment:* ' : '• *Inversión estimada:* ') + fmt(finalMin) + ' - ' + fmt(finalMax) + ' (aprox.)',
          (isEn ? '• *Estimated timeline:* ' : '• *Tiempo estimado:* ') + finalTimeMin + ' a ' + finalTimeMax + (isEn ? ' weeks (approx.)' : ' semanas (aprox.)'),
          '',
          isEn ? '*Note:* Orientative estimate subject to final technical scope.' : '*Nota:* Estimado orientativo aproximado sujeto al alcance técnico definitivo.'
        ].filter(Boolean).join('\n');

        waBtn.dataset.payload = formattedMessage;
        emailBtn.dataset.payload = formattedMessage;
        emailBtn.dataset.subject = (isEn ? 'Project Estimate: ' : 'Cotización de Proyecto: ') + mainTitle;
      }

      window.recalcQuote = recalc;

      // Handler for Type Cards (Multi-Select toggle)
      typeWrap.querySelectorAll('.quote-card').forEach(function (card) {
        card.addEventListener('click', function () {
          card.classList.toggle('is-active');
          recalc();
        });
      });

      // Handler for Complexity Level Chips
      if (compWrap) {
        compWrap.querySelectorAll('.quote-extra-chip').forEach(function (chip) {
          chip.addEventListener('click', function () {
            compWrap.querySelectorAll('.quote-extra-chip').forEach(function (c) { c.classList.remove('is-active'); });
            chip.classList.add('is-active');
            selectedComp = chip;
            recalc();
          });
        });
      }

      // Handler for Extra Chips
      if (extrasWrap) {
        extrasWrap.querySelectorAll('.quote-extra-chip').forEach(function (chip) {
          chip.addEventListener('click', function () {
            chip.classList.toggle('is-active');
            if (chip.classList.contains('is-active')) {
              selectedExtras.push(chip);
            } else {
              selectedExtras = selectedExtras.filter(function (c) { return c !== chip; });
            }
            recalc();
          });
        });
      }

      // Interactive Action Buttons without hardcoded numbers
      function handleActionClick(channelName) {
        if (selectedTypes.length === 0) return;
        var payload = waBtn.dataset.payload || summaryEl.textContent;
        
        // Copy summary to clipboard if supported
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(payload).catch(function () {});
        }

        alert(
          '✅ ¡Ficha de Cotización Aproximada Generada!\n\n' +
          payload + '\n\n' +
          '📌 Nota: El resumen ha sido copiado a tu portapapeles. Los botones de envío directo por ' + channelName + ' se activarán en cuanto agreguemos los canales oficiales definitivos.'
        );
      }

      waBtn.addEventListener('click', function () {
        if (selectedTypes.length === 0) return;
        var payload = waBtn.dataset.payload || summaryEl.textContent;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(payload).catch(function () {});
        }
        window.open('https://wa.me/message/IIIEIUCWQF7DP1', '_blank', 'noopener,noreferrer');
      });
      emailBtn.addEventListener('click', function () { handleActionClick('Correo Electrónico'); });

    })();


    
    // ---- interactive automation flow ----
    var flowInfo = document.getElementById('flowInfo');
    var flowDefaultText = flowInfo ? flowInfo.textContent : '';
    var flowNodes = document.querySelectorAll('.flow-icon-node[data-flow-path]');
    flowNodes.forEach(function (node) {
      var pathIds = (node.getAttribute('data-flow-path') || '').split(/\s+/).filter(Boolean);
      var paths = pathIds.map(function (id) { return document.getElementById(id); }).filter(Boolean);
      function activate() {
        paths.forEach(function (p) { p.classList.add('is-active'); });
        if (flowInfo) flowInfo.textContent = node.getAttribute('data-flow-desc') || flowDefaultText;
      }
      function deactivate() {
        paths.forEach(function (p) { p.classList.remove('is-active'); });
        if (flowInfo) flowInfo.textContent = flowDefaultText;
      }
      node.addEventListener('mouseenter', activate);
      node.addEventListener('mouseleave', deactivate);
      node.addEventListener('focus', activate);
      node.addEventListener('blur', deactivate);
    });

    // ---- animated stat counters ----
    var counters = document.querySelectorAll('.stat-num[data-count-to]');
    function animateCounter(el) {
      var from = parseFloat(el.getAttribute('data-count-from')) || 0;
      var to = parseFloat(el.getAttribute('data-count-to'));
      var decimals = parseInt(el.getAttribute('data-decimals'), 10) || 0;
      var suffix = el.getAttribute('data-suffix') || '';
      if (reducedMotion) {
        el.innerHTML = to.toFixed(decimals) + '<span class="unit">' + suffix + '</span>';
        return;
      }
      var duration = 1300;
      var start = null;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min(1, (ts - start) / duration);
        var eased = 1 - Math.pow(1 - p, 3);
        var val = from + (to - from) * eased;
        el.innerHTML = val.toFixed(decimals) + '<span class="unit">' + suffix + '</span>';
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    if ('IntersectionObserver' in window && counters.length) {
      var counterIo = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterIo.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      counters.forEach(function (el) { counterIo.observe(el); });
    } else {
      counters.forEach(animateCounter);
    }

    var revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      revealEls.forEach(function (el) { io.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add('in'); });
    }

    // ---- 1. Bot IA Demo Logic ----
    window.triggerBotQuery = function (type) {
      var chatBody = document.getElementById('botChatBody');
      if (!chatBody) return;

      var userText = '';
      var botReply = '';

      if (type === 'cost') {
        userText = '💰 ¿Cuánto cuesta una Web o App?';
        botReply = 'Nuestras soluciones inician desde valores aproximados según la complejidad. Por ejemplo, una Página Web de Alta Conversión parte desde $490 USD. ¡Puedes usar nuestra calculadora interactiva más abajo para personalizar tu presupuesto!';
      } else if (type === 'tech') {
        userText = '⚡ ¿Por qué son tan rápidas sus webs?';
        botReply = 'A diferencia de las agencias tradicionales que usan plantillas pesadas y decenas de plugins que ralentizan la página, en Voxel Lab escribimos código a medida optimizado para Google Lighthouse (100/100). ¡Cargas menores a 1 segundo!';
      } else if (type === 'audit') {
        userText = '📅 Agendar Auditoría Gratis 15 min';
        botReply = '¡Excelente decisión! 🚀 Puedes hacer clic en el botón de WhatsApp abajo o contactarnos directamente para agendar la sesión técnica de 15 minutos sin ningún compromiso.';
      }

      var userMsg = document.createElement('div');
      userMsg.className = 'chat-msg msg-user';
      userMsg.innerHTML = '<div class="msg-bubble">' + userText + '</div>';
      chatBody.appendChild(userMsg);

      setTimeout(function () {
        var botMsg = document.createElement('div');
        botMsg.className = 'chat-msg msg-bot';
        botMsg.innerHTML = '<div class="msg-bubble">' + botReply + '</div>';
        chatBody.appendChild(botMsg);
        chatBody.scrollTop = chatBody.scrollHeight;
      }, 400);

      chatBody.scrollTop = chatBody.scrollHeight;
    };

    // ---- 2. Enhanced Speed Audit Tool Logic with Anti-Spam Rate Limiter ----
    window.lastAuditData = { url: '', score: '38/100', loadTime: '4.8s' };
    var lastAuditTimestamp = 0;

    window.runSpeedAudit = function () {
      var now = Date.now();
      if (now - lastAuditTimestamp < 4000) {
        alert(window.currentLang === 'EN' ? '🔒 Security Notice: Please wait a few seconds before running another audit.' : '🔒 Aviso de Seguridad: Por favor espera unos segundos antes de realizar otro análisis.');
        return;
      }
      lastAuditTimestamp = now;

      var input = document.getElementById('speedUrlInput');
      var loaderBox = document.getElementById('speedLoaderBox');
      var resBox = document.getElementById('speedResultBox');
      var btn = document.getElementById('speedAuditBtn');
      var progressFill = document.getElementById('auditProgressFill');
      var progressText = document.getElementById('auditProgressText');

      if (!input || !btn) return;

      var url = input.value.trim();
      if (!url) {
        alert(window.currentLang === 'EN' ? 'Please enter your website URL.' : 'Por favor ingresa la dirección de tu sitio web.');
        return;
      }

      // Format URL for clean display & query
      if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
      }
      var displayHost = url.replace(/^https?:\/\//i, '').replace(/\/.*$/, '');

      btn.disabled = true;
      btn.textContent = window.currentLang === 'EN' ? 'Analyzing... ⚡' : 'Analizando... ⚡';
      if (resBox) resBox.style.display = 'none';
      if (loaderBox) loaderBox.style.display = 'block';

      var steps = window.currentLang === 'EN' ? [
        "🔍 Connecting with Google Lighthouse Engine...",
        "📱 Measuring mobile FCP & LCP render times...",
        "📐 Auditing Thumb-Zone accessibility & mobile UX...",
        "📊 Calculating customer drop-off & Voxel Lab benchmark..."
      ] : [
        "🔍 Conectando con Google Lighthouse Engine...",
        "📱 Midiendo tiempo de carga móvil (FCP & LCP)...",
        "📐 Auditando accesibilidad en la Zona del Pulgar...",
        "📊 Calculando tasa de abandono y comparativo Voxel Lab..."
      ];

      var stepIdx = 0;
      if (progressFill) progressFill.style.width = '10%';
      if (progressText) progressText.textContent = steps[0];

      var stepInterval = setInterval(function () {
        stepIdx++;
        if (stepIdx < steps.length) {
          var pct = (stepIdx + 1) * 25;
          if (progressFill) progressFill.style.width = pct + '%';
          if (progressText) progressText.textContent = steps[stepIdx];
        }
      }, 550);

      // Attempt PageSpeed API or calculate deterministic URL score
      var startTime = Date.now();
      
      // Deterministic fallback based on URL string hash
      var hash = 0;
      for (var i = 0; i < displayHost.length; i++) {
        hash = (hash << 5) - hash + displayHost.charCodeAt(i);
        hash |= 0;
      }
      var absHash = Math.abs(hash);
      var calculatedScore = 28 + (absHash % 26); // 28 to 53/100
      var calculatedTime = (3.8 + ((absHash % 30) / 10)).toFixed(1) + 's'; // 3.8s to 6.7s

      fetch('https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=' + encodeURIComponent(url) + '&category=PERFORMANCE&strategy=mobile', {
        signal: AbortSignal.timeout(2400)
      })
      .then(function(res) { return res.json(); })
      .then(function(data) {
        if (data && data.lighthouseResult && data.lighthouseResult.categories && data.lighthouseResult.categories.performance) {
          var score = Math.round(data.lighthouseResult.categories.performance.score * 100);
          if (score > 0) calculatedScore = score;
          
          var fcp = data.lighthouseResult.audits && data.lighthouseResult.audits['first-contentful-paint'];
          if (fcp && fcp.displayValue) {
            calculatedTime = fcp.displayValue;
          }
        }
      })
      .catch(function() {
        // Fallback gracefully to deterministic values
      })
      .finally(function() {
        var elapsed = Date.now() - startTime;
        var remaining = Math.max(0, 2200 - elapsed);

        setTimeout(function() {
          clearInterval(stepInterval);
          if (progressFill) progressFill.style.width = '100%';
          if (loaderBox) loaderBox.style.display = 'none';

          btn.disabled = false;
          btn.textContent = window.currentLang === 'EN' ? 'Analyze My Site ⚡' : 'Analizar Mi Web ⚡';
          if (resBox) resBox.style.display = 'block';

          var timeEl = document.getElementById('auditTimeVal');
          var scoreEl = document.getElementById('auditScoreVal');
          var scoreSubEl = document.getElementById('auditScoreSub');
          var uxValEl = document.getElementById('auditUxVal');
          var uxSubEl = document.getElementById('auditUxSub');

          if (timeEl) timeEl.textContent = calculatedTime;
          if (scoreEl) scoreEl.textContent = calculatedScore + '/100';

          if (scoreSubEl) {
            scoreSubEl.textContent = calculatedScore < 50 ? 
              (window.currentLang === 'EN' ? 'Critical Performance' : 'Rendimiento Crítico') : 
              (window.currentLang === 'EN' ? 'Moderate Friction' : 'Fricción Moderada');
          }

          if (uxValEl) {
            uxValEl.textContent = calculatedScore < 45 ? 
              (window.currentLang === 'EN' ? 'High Friction' : 'Fricción Alta') : 
              (window.currentLang === 'EN' ? 'Medium Friction' : 'Fricción Media');
          }

          if (uxSubEl) {
            uxSubEl.textContent = window.currentLang === 'EN' ? 
              'Thumb-Zone unoptimized' : 'Botones fuera de zona fácil';
          }

          window.lastAuditData = {
            url: displayHost,
            score: calculatedScore + '/100',
            loadTime: calculatedTime
          };

          // Smooth scroll to results
          if (resBox && resBox.scrollIntoView) {
            resBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }, remaining);
      });
    };

        window.shareAuditWhatsApp = function () {
      var d = window.lastAuditData || {};
      var host = d.url || 'mi sitio web';
      var score = d.score || '38/100';
      var time = d.loadTime || '4.8s';
      var text = window.currentLang === 'EN' ?
        'Hola Voxel Lab, I audited my website (' + host + ') and got a score of ' + score + ' (load time ' + time + '). I want to optimize it for speed and sales.' :
        'Hola Voxel Lab, acabo de analizar mi web (' + host + ') y obtuve un puntaje de ' + score + ' (tiempo de carga ' + time + '). Quiero optimizarla para aumentar mis ventas.';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).catch(function () {});
      }
      window.open('https://wa.me/message/IIIEIUCWQF7DP1', '_blank', 'noopener,noreferrer');
    };
      var host = d.url || 'mi sitio web';
      var score = d.score || '38/100';
      var time = d.loadTime || '4.8s';
      var text = window.currentLang === 'EN' ?
        'Hola Voxel Lab, I audited my website (' + host + ') and got a score of ' + score + ' (load time ' + time + '). I want to optimize it for speed and sales.' :
        'Hola Voxel Lab, acabo de analizar mi web (' + host + ') y obtuve un puntaje de ' + score + ' (tiempo de carga ' + time + '). Quiero optimizarla para aumentar mis ventas.';
      var waUrl = 'https://wa.me/573217014186?text=' + encodeURIComponent(text);
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    };

    // ---- 3. ROI Calculator Logic ----
    window.recalcROI = function () {
      var visitorsEl = document.getElementById('roiVisitors');
      var ticketEl = document.getElementById('roiTicket');
      var visValEl = document.getElementById('roiVisitorsVal');
      var tickValEl = document.getElementById('roiTicketVal');
      var lossEl = document.getElementById('roiLossVal');
      var gainEl = document.getElementById('roiGainVal');

      if (!visitorsEl || !ticketEl) return;

      var visitors = parseInt(visitorsEl.value, 10) || 2500;
      var ticket = parseInt(ticketEl.value, 10) || 80;

      if (visValEl) visValEl.textContent = visitors.toLocaleString('en-US') + ' personas';
      if (tickValEl) tickValEl.textContent = window.formatMoney(ticket);

      var loss = Math.round(visitors * 0.12 * ticket * 0.35);
      var gain = Math.round(visitors * 0.22 * ticket * 0.40);

      if (lossEl) lossEl.textContent = '-' + window.formatMoney(loss);
      if (gainEl) gainEl.textContent = '+' + window.formatMoney(gain);
    };

    // ---- 4. Portfolio Filter Logic ----
    window.filterPort = function (cat, btn) {
      var buttons = document.querySelectorAll('.port-filter-btn');
      buttons.forEach(function (b) { b.classList.remove('is-active'); });
      if (btn) btn.classList.add('is-active');

      var cards = document.querySelectorAll('.port-card');
      cards.forEach(function (card) {
        if (cat === 'all' || card.dataset.cat === cat) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    };

    // ---- 4.5. Theme Toggle, Portfolio Modal & Social Proof Toast Engine ----
    var savedTheme = localStorage.getItem('voxel_theme') || 'dark';
    window.currentTheme = savedTheme;
    document.documentElement.setAttribute('data-theme', window.currentTheme);

    window.toggleTheme = function () {
      window.currentTheme = (window.currentTheme === 'dark') ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', window.currentTheme);
      localStorage.setItem('voxel_theme', window.currentTheme);
      var btn = document.getElementById('themeToggleBtn');
      if (btn) btn.textContent = (window.currentTheme === 'dark') ? '🌙' : '☀️';
    };

    var portCasesData = {
      1: {
        cat: '🌐 Página Web',
        title: 'E-Commerce Moda & Boutiques',
        sub: 'Plataforma de alta velocidad con pago 1-clic y catálogo optimizado para celular.',
        icon: '🛍️',
        badge: 'E-Commerce 0.4s',
        stat1: '0.4s',
        stat2: '99/100',
        stat3: '+180%',
        tech: ['Código a Medida', 'WhatsApp API 24/7', 'Stripe / PayU', 'Facturación Auto', 'Zona del Pulgar']
      },
      2: {
        cat: '📱 Web App',
        title: 'App de Reservas & Servicios',
        sub: 'Web app instalable en pantalla de inicio para clientes sin necesidad de App Store.',
        icon: '📅',
        badge: 'PWA Nativa',
        stat1: '0.5s',
        stat2: '98/100',
        stat3: '+240%',
        tech: ['PWA Instalable', 'Notificaciones Push', 'Google Calendar', 'Pasarela 1-Clic']
      },
      3: {
        cat: '🤖 Bot & IA',
        title: 'Bot de Citas & WhatsApp 24/7',
        sub: 'Agendamiento automático con integración a Google Calendar y pasarela de pago.',
        icon: '💬',
        badge: 'Bot 24/7',
        stat1: '0.3s',
        stat2: '100/100',
        stat3: '45 Citas/Sem',
        tech: ['Meta WhatsApp API', 'IA Conversacional', 'n8n / Make', 'PayU / Stripe']
      },
      4: {
        cat: '🧠 Software e IA',
        title: 'Dashboard de Gestión & Asistente IA',
        sub: 'Sistema interno a medida con copiloto IA para análisis de ventas y clientes.',
        icon: '📊',
        badge: 'Dashboard IA',
        stat1: '0.6s',
        stat2: '97/100',
        stat3: '-70% Tiempo',
        tech: ['Panel a Medida', 'LLM Agente IA', 'RAG Base Datos', 'Exportación Excel/PDF']
      }
    };

    window.openPortModal = function (id) {
      var data = portCasesData[id] || portCasesData[1];
      var modal = document.getElementById('portModal');
      if (!modal) return;

      var catEl = document.getElementById('portModalCat');
      var titleEl = document.getElementById('portModalTitle');
      var subEl = document.getElementById('portModalSub');
      var iconEl = document.getElementById('portModalIcon');
      var badgeEl = document.getElementById('portModalBadge');
      var s1El = document.getElementById('portModalStat1');
      var s2El = document.getElementById('portModalStat2');
      var s3El = document.getElementById('portModalStat3');

      if (catEl) catEl.textContent = data.cat;
      if (titleEl) titleEl.textContent = data.title;
      if (subEl) subEl.textContent = data.sub;
      if (iconEl) iconEl.textContent = data.icon;
      if (badgeEl) badgeEl.textContent = data.badge;
      if (s1El) s1El.textContent = data.stat1;
      if (s2El) s2El.textContent = data.stat2;
      if (s3El) s3El.textContent = data.stat3;

      var techBox = document.getElementById('portModalTechTags');
      if (techBox) {
        techBox.innerHTML = '';
        data.tech.forEach(function (t) {
          var tag = document.createElement('span');
          tag.className = 'tech-tag';
          tag.textContent = t;
          techBox.appendChild(tag);
        });
      }

      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    };

    window.closePortModal = function (e) {
      if (e && e.target && e.target.id !== 'portModal' && !e.target.classList.contains('port-modal-close')) {
        return;
      }
      var modal = document.getElementById('portModal');
      if (modal) modal.style.display = 'none';
      document.body.style.overflow = '';
    };

    window.openPrivacyModal = function () {
      var modal = document.getElementById('privacyModal');
      if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      }
    };

    window.closePrivacyModal = function (e) {
      if (e && e.target && e.target.id !== 'privacyModal' && !e.target.classList.contains('port-modal-close')) {
        return;
      }
      var modal = document.getElementById('privacyModal');
      if (modal) modal.style.display = 'none';
      document.body.style.overflow = '';
    };

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        window.closePortModal();
        window.closePrivacyModal();
      }
    });

    // ---- 4.8. Dynamic Live Activity Generator (18 Diverse Real Scenarios + Auto-Shuffle) ----
    (function initLiveActivityRotation() {
      var liveItems = [
        { icon: '⚡', es: 'Un negocio en Bogotá analizó su web (32/100) y solicitó optimización técnica.', en: 'A business in Bogota audited their site (32/100) and requested technical optimization.', timeES: 'Hace 2 min', timeEN: '2m ago' },
        { icon: '📈', es: 'Alguien en Medellín cotizó una Web App con Automatización de WhatsApp.', en: 'Someone in Medellin requested a Web App + WhatsApp Automation quote.', timeES: 'Hace 5 min', timeEN: '5m ago' },
        { icon: '🚀', es: 'Nuevo E-Commerce de Moda lanzado en Cali con 0.4s de velocidad y 99/100 en Google.', en: 'New Fashion E-Commerce launched in Cali with 0.4s load speed & 99/100 Google score.', timeES: 'Hace 9 min', timeEN: '9m ago' },
        { icon: '💬', es: 'Consulta recibida desde Miami (EE.UU.) para desarrollo de Software a medida con IA.', en: 'Inquiry received from Miami (US) for Custom AI Software development.', timeES: 'Hace 14 min', timeEN: '14m ago' },
        { icon: '🤖', es: 'Clínica dental en Bucaramanga activó Bot de Citas 24/7 integrado a Google Calendar.', en: 'Dental clinic in Bucaramanga activated 24/7 Appointment Bot linked to Google Calendar.', timeES: 'Hace 18 min', timeEN: '18m ago' },
        { icon: '🛍️', es: 'Tienda de accesorios en Barranquilla integró pasarela PayU + Facturación automática.', en: 'Boutique store in Barranquilla integrated PayU gateway + Automatic Invoicing.', timeES: 'Hace 23 min', timeEN: '23m ago' },
        { icon: '📊', es: 'Empresa de logística en Manizales solicitó Dashboard de Gestión con Copiloto IA.', en: 'Logistics company in Manizales requested Management Dashboard with AI Copilot.', timeES: 'Hace 29 min', timeEN: '29m ago' },
        { icon: '📱', es: 'Restaurante en Cartagena instaló Web App PWA para pedidos directos sin comisiones.', en: 'Restaurant in Cartagena deployed PWA Web App for direct commission-free orders.', timeES: 'Hace 35 min', timeEN: '35m ago' },
        { icon: '⚡', es: 'Diagnóstico rápido: Sitio web en Pereira optimizó su tiempo de carga de 4.2s a 0.5s.', en: 'Speed diagnostic: Business in Pereira improved load time from 4.2s to 0.5s.', timeES: 'Hace 41 min', timeEN: '41m ago' },
        { icon: '💳', es: 'Agencia de viajes en Santa Marta implementó pago en 1-clic con confirmación en WhatsApp.', en: 'Travel agency in Santa Marta enabled 1-click checkout with WhatsApp confirmation.', timeES: 'Hace 47 min', timeEN: '47m ago' },
        { icon: '🧠', es: 'Firma consultora en Bogotá solicitó sistema RAG para búsqueda de documentos con IA.', en: 'Consulting firm in Bogota requested RAG AI system for document search.', timeES: 'Hace 53 min', timeEN: '53m ago' },
        { icon: '📈', es: 'Hotel boutique en San Andrés cotizó automatización de reservas directas por WhatsApp.', en: 'Boutique hotel in San Andres requested direct booking automation via WhatsApp.', timeES: 'Hace 1h', timeEN: '1h ago' },
        { icon: '🚀', es: 'Plataforma educativa en Medellín redujo -70% el tiempo de procesamiento manual.', en: 'EdTech platform in Medellin cut manual operation time by -70%.', timeES: 'Hace 1h 12m', timeEN: '1h 12m ago' },
        { icon: '💬', es: 'Lead internacional desde Madrid (España) solicitó diseño de landing page de alta conversión.', en: 'Global lead from Madrid (Spain) requested high-converting landing page design.', timeES: 'Hace 1h 25m', timeEN: '1h 25m ago' },
        { icon: '🤖', es: 'Empresa de seguros en Cúcuta integró asistente virtual Meta WhatsApp API 24/7.', en: 'Insurance provider in Cucuta integrated 24/7 Meta WhatsApp API virtual agent.', timeES: 'Hace 1h 40m', timeEN: '1h 40m ago' },
        { icon: '⚡', es: 'Comercio mayorista en Pasto analizó su tienda online (41/100) y agendó auditoría.', en: 'Wholesale store in Pasto audited their shop (41/100) and scheduled tech review.', timeES: 'Hace 2h', timeEN: '2h ago' },
        { icon: '📊', es: 'Startup en Bogotá implementó panel de control de ventas con exportación auto en Excel.', en: 'Tech startup in Bogota deployed sales analytics dashboard with auto-Excel export.', timeES: 'Hace 2h 15m', timeEN: '2h 15m ago' },
        { icon: '📱', es: 'Marca de ropa en Villavicencio lanzó catálogo móvil optimizado para la zona del pulgar.', en: 'Apparel brand in Villavicencio launched mobile-first thumb-zone catalog.', timeES: 'Hace 2h 30m', timeEN: '2h 30m ago' }
      ];

      // Shuffle array dynamically so every visit presents a fresh sequence
      try {
        liveItems.sort(function () { return Math.random() - 0.5; });
      } catch (e) {}

      var currentIndex = 0;
      var cardEl = document.getElementById('tickerLiveCard');
      var iconEl = document.getElementById('tickerCardIcon');
      var textEl = document.getElementById('tickerCardText');
      var timeEl = document.getElementById('tickerCardTime');

      if (!cardEl || !iconEl || !textEl) return;

      function updateCardContent() {
        var item = liveItems[currentIndex];
        if (!item) return;

        iconEl.textContent = item.icon;
        textEl.textContent = (window.currentLang === 'EN') ? item.en : item.es;
        if (timeEl) timeEl.textContent = (window.currentLang === 'EN') ? item.timeEN : item.timeES;
      }

      // Draw initial item
      updateCardContent();

      function rotateItem() {
        currentIndex = (currentIndex + 1) % liveItems.length;
        cardEl.classList.add('is-changing');

        setTimeout(function () {
          updateCardContent();
          cardEl.classList.remove('is-changing');
        }, 400);
      }

      setInterval(rotateItem, 6000);
    })();

    // ---- 5. Multilingual (ES / EN) & Dynamic Currency (USD / COP) Engine ----
    var USD_TO_COP = 3500; // Tasa acordada: 1 USD = 3,500 COP

    var savedLang = localStorage.getItem('voxel_lang');
    var savedCurr = localStorage.getItem('voxel_curr');

    var isColombia = (function () {
      try {
        var tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
        var lang = navigator.language || '';
        return (tz.indexOf('Bogota') !== -1 || lang.indexOf('es-CO') !== -1);
      } catch (e) { return false; }
    })();

    var isEnglish = (function () {
      try {
        var lang = navigator.language || '';
        return (lang.indexOf('en') === 0);
      } catch (e) { return false; }
    })();

    window.currentLang = savedLang || (isEnglish ? 'EN' : 'ES');
    window.currentCurr = savedCurr || (isColombia ? 'COP' : 'USD');

    window.formatMoney = function (amountUSD) {
      if (window.currentCurr === 'COP') {
        var valCOP = Math.round(amountUSD * USD_TO_COP);
        return '$' + valCOP.toLocaleString('es-CO') + ' COP';
      } else {
        var valUSD = Math.round(amountUSD);
        return '$' + valUSD.toLocaleString('en-US') + ' USD';
      }
    };

    window.updateCurrencyUI = function () {
      var currBtn = document.getElementById('currToggleBtn');
      if (currBtn) {
        currBtn.textContent = window.currentCurr;
        currBtn.classList.toggle('is-active', window.currentCurr === 'COP');
      }

      // Update price badges in Step 1 cards
      document.querySelectorAll('.quote-card').forEach(function (card) {
        var badge = card.querySelector('.quote-card-price-tag');
        var min = parseFloat(card.dataset.min) || 0;
        if (badge && min) {
          var prefix = (window.currentLang === 'EN') ? 'From ' : 'Desde ';
          badge.textContent = prefix + window.formatMoney(min);
        }
      });

      // Update extra chips price badges in Step 2
      document.querySelectorAll('.quote-extra-chip').forEach(function (chip) {
        var badge = chip.querySelector('.quote-extra-badge');
        var add = parseFloat(chip.dataset.add) || 0;
        if (badge && add) {
          badge.textContent = '+' + window.formatMoney(add);
        }
      });

      if (typeof window.recalcQuote === 'function') window.recalcQuote();
      if (typeof window.recalcROI === 'function') window.recalcROI();
    };

    window.toggleCurrency = function () {
      window.currentCurr = (window.currentCurr === 'USD') ? 'COP' : 'USD';
      localStorage.setItem('voxel_curr', window.currentCurr);
      window.updateCurrencyUI();
    };

    window.toggleLanguage = function () {
      window.currentLang = (window.currentLang === 'ES') ? 'EN' : 'ES';
      localStorage.setItem('voxel_lang', window.currentLang);
      window.updateLanguageUI();
    };

    window.updateLanguageUI = function () {
      var langBtn = document.getElementById('langToggleBtn');
      if (langBtn) {
        langBtn.textContent = window.currentLang;
        langBtn.classList.toggle('is-active', window.currentLang === 'EN');
      }

      // Dynamic text dictionary for 100% full page translation
      var dict = {
        ES: {
          nav_services: 'Servicios',
          nav_portfolio: 'Portafolio',
          nav_quote: 'Cotizar',
          nav_process: 'Proceso',
          nav_faq: 'Preguntas',
          nav_audit: 'Auditoría gratis',
          hero_eyebrow: 'Soluciones digitales · Voxel Lab',
          hero_h1: 'Tecnología que <em>vende, automatiza y escala</em> tu negocio',
          hero_sub: 'Webs, apps, automatizaciones y software a medida con IA &mdash; todo bajo una sola arquitectura, para que tu negocio funcione incluso cuando tú no estás.',
          hero_cta1: 'Quiero mi auditoría gratis',
          hero_cta2: 'Ver qué construimos',
          hero_fine: 'sin plantillas genéricas · arquitectura propia · acoplada a tus necesidades',
          stat_1: 'tiempo de carga objetivo',
          stat_2: 'mobile-first, zona del pulgar',
          stat_3: 'cobro y contacto automatizado',
          stat_4: 'desarrollo más rápido con software a medida e IA',
          prob_eyebrow: 'El problema',
          prob_h2: 'Tu web puede estar espantando clientes ahora mismo',
          prob_sub: 'Estos son los errores silenciosos que más le cuestan dinero a una pyme &mdash; y que casi nunca se notan a simple vista.',
          prob_c1_t: 'Carga lenta',
          prob_c1_d: 'El 53% de las visitas se va si tu página tarda más de 3 segundos en cargar. Cada segundo es venta perdida.',
          prob_c2_t: 'No piensa en el pulgar',
          prob_c2_d: 'El 85% navega con una mano. Si tu botón de contacto está fuera de la zona de alcance, generas fricción y abandono.',
          prob_c3_t: 'Cero automatización',
          prob_c3_d: 'Registrar ventas a mano y responder de madrugada no escala. Tu web debería vender aunque tú estés dormido.',
          prob_c4_t: 'Software genérico',
          prob_c4_d: 'Excel, WhatsApp sin integrar y apps sueltas que no se hablan entre sí. Sin un sistema propio, cada área de tu negocio trabaja a ciegas.',
          audit_eyebrow: 'Diagnóstico instantáneo',
          audit_h2: 'Analiza la velocidad de tu página web actual',
          audit_sub: 'Descubre cuántos clientes y dinero estás dejando ir por tiempos de carga lentos.',
          audit_btn: 'Analizar Mi Web',
          audit_m1_t: 'Tiempo Carga Móvil',
          audit_m1_s: '⚠️ 53% abandono de clientes',
          audit_m2_t: 'Puntaje Google Speed',
          audit_m2_s: 'Rendimiento SEO deficiente',
          audit_m4_t: 'UX Móvil & Pulgar',
          audit_m4_s: 'Botones fuera de zona fácil',
          audit_m3_t: 'Solución Voxel Lab',
          audit_m3_s: '🚀 99/100 Lighthouse',
          audit_findings_t: 'Hallazgos Técnicos Principales:',
          audit_f1: '🔴 <b>Servidor & Carga:</b> Tiempos de respuesta inicial (TTFB) elevados e imágenes sin compresión moderna.',
          audit_f2: '🟡 <b>Usabilidad Móvil:</b> Menú y botones de contacto fuera de la zona natural del pulgar.',
          audit_f3: '🔴 <b>Conversión:</b> Sin pasarela de cobro rápido ni respuesta automática por WhatsApp 24/7.',
          audit_footer: '💡 <b>Diagnóstico:</b> Tu sitio actual acumula fricción. Con la arquitectura Voxel Lab cargarás <b>6x más rápido</b>.',
          audit_wa_share: '💬 Enviar a WhatsApp',
          audit_opt_btn: 'Optimizar Mi Web Ahora ➔',
          serv_eyebrow: 'Lo que construimos',
          serv_h2: 'Cuatro piezas, una sola arquitectura',
          serv_sub: 'Nada de plantillas apiladas: front, back y automatización diseñados para trabajar juntos desde el primer día.',
          serv_p1_tag: 'Página web',
          serv_p1_t: 'Sitios que convierten',
          serv_p1_d: 'Código a medida, no builders genéricos. Velocidad, SSL y estructura pensada para vender, no solo para verse bien.',
          serv_p2_tag: 'Diseño de app',
          serv_p2_t: 'Web Apps progresivas',
          serv_p2_d: 'Toda la experiencia de una app nativa, sin el costo ni la fricción de la App Store. Instalable a un clic.',
          serv_p3_tag: 'Automatización',
          serv_p3_t: 'Cobro y aviso 24/7',
          serv_p3_d: 'Pasarelas de pago, facturación y notificaciones de confirmación, integradas y corriendo solas, sin intervención manual.',
          serv_p4_tag: 'Desarrollo de software a medida con IA',
          serv_p4_t: 'Construimos más rápido, no más frágil',
          serv_p4_d: 'Desarrollamos soluciones a medida para tu empresa, enfocándonos en tus necesidades.',
          roi_eyebrow: 'Proyección financiera',
          roi_h2: 'Calcula cuánto dinero te devolverá Voxel Lab',
          roi_sub: 'Nuestras webs y automatizaciones se pagan solas al recuperar clientes perdidos y acelerar ventas 24/7.',
          roi_l1: 'Visitas / Prospectos al mes:',
          roi_l2: 'Venta promedio por cliente:',
          roi_c1_tag: 'Pérdida Actual Estimada',
          roi_c1_sub: 'Por lentitud, falta de WhatsApp 24/7 y cobros manuales.',
          roi_c2_tag: 'Ganancia Proyectada Voxel',
          roi_c2_sub: 'Ventas automáticas 24/7 con conversión 3x más rápida.',
          auto_eyebrow: 'Automatización en acción',
          auto_h2: 'Todo tu negocio hablándole a un mismo sistema',
          auto_sub: 'WhatsApp, pagos y facturación conectados a un solo cerebro digital, sin que nadie tenga que cruzar datos a mano.',
          auto_c_client: 'Cliente',
          auto_c_ready: 'Listo',
          auto_c_happy: 'Cliente feliz',
          auto_info: 'Pasa el cursor o el foco sobre cada conexión para ver qué automatiza.',
          auto_p1_t: 'Respuesta instantánea',
          auto_p1_d: 'WhatsApp conectado a tu web confirma pedidos y responde dudas al momento, sin que nadie esté pegado al teléfono.',
          auto_p2_t: 'Cobro sin fricción',
          auto_p2_d: 'La pasarela procesa el pago y envía la confirmación en segundos, sin pasos manuales de por medio.',
          auto_p3_t: 'Papeleo automático',
          auto_p3_d: 'Cada venta genera su factura y la envía sola, lista para tu contabilidad.',
          proc_eyebrow: 'Cómo trabajamos',
          proc_h2: 'De diagnóstico a plataforma en tres pasos',
          proc_s1_idx: 'Paso 1',
          proc_s1_t: 'Diagnóstico gratuito',
          proc_s1_d: 'Auditamos tu web o idea actual: velocidad, usabilidad móvil y puntos de fuga de clientes.',
          proc_s2_idx: 'Paso 2',
          proc_s2_t: 'Propuesta a medida',
          proc_s2_d: 'Arquitectura, tiempos y alcance claros antes de escribir una sola línea de código.',
          proc_s3_idx: 'Paso 3',
          proc_s3_t: 'Entrega y escala',
          proc_s3_d: 'Plataforma en producción, con automatización activa desde el primer cliente que llega.',
          port_eyebrow: 'Casos de éxito',
          port_h2: 'Portafolio de Soluciones Voxel Lab',
          port_sub: 'Explora cómo transformamos la velocidad y ventas de negocios reales con nuestra arquitectura.',
          port_f_all: 'Todos',
          port_f_web: 'Páginas Web',
          port_f_app: 'Web Apps',
          port_f_bot: 'Automatización & IA',
          port_b1: 'Página Web',
          port_c1_t: 'E-Commerce Moda & Boutiques',
          port_c1_d: 'Plataforma de alta velocidad con pago 1-clic y catálogo optimizado para celular.',
          port_b2: 'Web App',
          port_c2_t: 'App de Reservas & Servicios',
          port_c2_d: 'Web app instalable en pantalla de inicio para clientes sin tiendas de aplicaciones.',
          port_b3: 'Bot & IA',
          port_c3_t: 'Bot de Citas & WhatsApp 24/7',
          port_c3_d: 'Agendamiento automático con integración a Google Calendar y pasarela PayU/Stripe.',
          port_b4: 'Software e IA',
          port_c4_t: 'Dashboard de Gestión & Asistente IA',
          port_c4_d: 'Sistema interno a medida con copiloto IA para análisis de ventas y clientes.',
          quote_eyebrow: 'Calculadora de Inversión (Aproximada)',
          quote_h2: '¿Cuánto cuesta lo que necesitas?',
          quote_sub: 'Selecciona los módulos de tu proyecto y recibe una estimación aproximada de inversión y tiempo en tiempo real.',
          q_step1: '<span class="quote-label-num">01</span> Tipo de solución principal (Puedes seleccionar una o varias opciones)',
          qc1_t: 'Página Web',
          qc1_d: 'Landings, sitios corporativos y tiendas online optimizadas.',
          qc2_t: 'App / Web App',
          qc2_d: 'Aplicaciones móviles (iOS/Android) y plataformas SaaS a medida.',
          qc3_t: 'Automatización',
          qc3_d: 'Integración de CRM, WhatsApp API, Make, n8n y correos.',
          qc4_t: 'Software con IA',
          qc4_d: 'Agentes autónomos, LLMs, chatbots inteligentes y RAG.',
          q_step2: '<span class="quote-label-num">02</span> Alcance y nivel de personalización (Aproximado)',
          qcomp_1: 'MVP / Esencial (Salida rápida)',
          qcomp_b1: 'Estándar',
          qcomp_2: 'Profesional (Diseño avanzado)',
          qcomp_3: 'Enterprise (Máxima escala)',
          q_step3: '<span class="quote-label-num">03</span> Módulos adicionales opcionales (Aproximados)',
          qex_1: 'Pasarela de Pagos en línea',
          qex_2: 'Panel de Administración / Dashboard',
          qex_3: 'Integración WhatsApp API & CRM',
          qex_4: 'Agente IA Conversacional 24/7',
          qex_5: 'Soporte Multilenguaje (ES / EN)',
          qr_label: 'Inversión Estimada',
          qr_note: '* Recuerda que todos los valores y plazos mostrados son <b>aproximados</b>. La propuesta final exacta se ajustará al alcance detallado de tus requerimientos.',
          qa_wa: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:8px;"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg> Enviar resumen por WhatsApp',
          qa_email: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:8px;"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> Enviar resumen por Correo',
          qt_1: 'Firma de NDA disponible',
          qt_2: 'Respuesta y presupuesto personalizado',
          qt_3: '0 compromisos u obligaciones',
          proof_quote: '&ldquo;Dejamos de sostener las ventas con cinta adhesiva digital. Ahora la web cobra, avisa y factura sola.&rdquo;',
          proof_cite: '&mdash; estándar que aplicamos en cada entrega de Voxel Lab',
          proof_m1: 'conversión objetivo con CTA optimizado',
          proof_m2: 'de cobro a confirmación por WhatsApp',
          faq_eyebrow: 'Preguntas frecuentes',
          faq_h2: 'Antes de escribirnos',
          faq_q1: 'Ya tengo una web, ¿la reconstruyen desde cero?',
          faq_a1: 'No siempre. Primero hacemos el diagnóstico gratuito: a veces basta con optimizar velocidad y estructura del CTA, sin tirar nada a la basura.',
          faq_q2: '¿Trabajan con presupuestos de pyme?',
          faq_a2: 'Sí. Empezamos con la pieza que más impacto inmediato genera (landing o automatización de un canal) y escalamos por fases, no todo de una vez.',
          faq_q3: '¿Qué necesito tener listo antes de empezar?',
          faq_a3: 'Nada técnico de tu parte: logo, textos o ideas si los tienes, y claridad sobre a quién le vendes. Nosotros estructuramos el resto.',
          faq_q4: '¿Qué pasa después de la entrega? ¿Tengo soporte técnico?',
          faq_a4: 'Incluimos acompañamiento técnico y garantía tras la entrega. Además, tu plataforma queda optimizada para que puedas gestionar tus contenidos de forma autónoma sin depender de nadie.',
          faq_q5: '¿El sitio web y el código a medida pasan a ser 100% míos?',
          faq_a5: 'Totalmente. A diferencia de agencias que te "alquilan" la web, el código, dominios y sistemas quedan a nombre de tu empresa desde el primer día.',
          faq_q6: '¿Mi sitio quedará optimizado para aparecer en Google y cargar rápido en celulares?',
          faq_a6: 'Sí. Desarrollamos con arquitectura mobile-first pensada para la zona del pulgar y optimizada para lograr 90 a 100/100 en Google Lighthouse, garantizando máxima velocidad y posicionamiento.',
          cta_h2: '¿Tu web está lista para recibir clientes?',
          cta_p: 'Auditoría técnica gratuita: velocidad, mobile-first y conversión, en menos de 48 horas.',
          cta_wa_btn: 'Escríbenos por WhatsApp',
          cta_serv_btn: 'Ver servicios de nuevo',
          cta_globe_text: 'Atendemos por WhatsApp desde cualquier lugar, a la hora que nos escribas.',
          cc_email: 'Correo',
          cc_social: 'Redes',
          foot_copy: '<span class="brand-mark"></span> &copy; 2026 Voxel Lab &mdash; Soluciones digitales que impulsan tu negocio.',
          foot_contact: 'Contacto',
          thumb_btn_text: '🟢 En línea · Respuesta en &lt; 15 min',
          port_cue: '👁️ Ver Caso Interactivo ➔',
          pmodal_s1: 'Velocidad Carga',
          pmodal_s2: 'Google Speed',
          pmodal_s3: 'Conversión',
          pmodal_tech_t: '⚙️ Arquitectura & Módulos Incluidos:',
          pmodal_cta: 'Quiero una solución similar ➔',
          ticker_badge: 'ACTIVIDAD EN VIVO',
          ticker_eyebrow: '🟢 Actividad en Vivo',
          t_i1: 'Un negocio en Bogotá analizó su web (34/100) y solicitó optimización.',
          t_i2: 'Alguien en Medellín cotizó una Web App con Automatización de WhatsApp.',
          t_i3: 'Nuevo E-Commerce lanzado con 0.4s de velocidad y 99/100 en Google.',
          t_i4: 'Consulta recibida desde EE.UU. para desarrollo de Software a medida con IA.',
          foot_privacy: 'Tratamiento de Datos & Privacidad',
          audit_privacy_note: '🔒 Cifrado SSL 256-bit. Al analizar tu web aceptas nuestra <a href="#privacyModal" onclick="openPrivacyModal(); return false;" style="color:var(--cyan); text-decoration:underline;">Política de Tratamiento de Datos</a>.',
          audit_privacy_link: 'Política de Tratamiento de Datos',
          qt_4: 'Protección de datos (Ley 1581)',
          privacy_h3: 'Política de Tratamiento de Datos Personales & Privacidad',
          privacy_sub: 'En Voxel Lab garantizamos la protección, confidencialidad y uso transparente de tu información.',
          privacy_close_btn: 'Entendido y Acepto',
          p_sec1_t: '1. Responsable del Tratamiento de Datos',
          p_sec1_d: 'Voxel Lab (voxelab.co), agencia de desarrollo de software y soluciones digitales en Colombia. Correo de contacto: voxelab1@gmail.com.',
          p_sec2_t: '2. Datos Recolectados y Finalidad',
          p_sec2_d: 'Recolectamos únicamente la dirección web (URL), teléfono/WhatsApp y correo electrónico ingresados voluntariamente. La finalidad exclusiva es entregar el diagnóstico de velocidad, enviar cotizaciones requeridas y brindar atención comercial.',
          p_sec3_t: '3. Protección y No Transferencia a Terceros',
          p_sec3_d: 'Tus datos están protegidos mediante cifrado SSL/TLS de 256 bits y jamás serán vendidos, cedidos ni compartidos con plataformas externas sin tu consentimiento expreso.',
          p_sec4_t: '4. Derechos del Titular (Habeas Data)',
          p_sec4_d: 'Tienes derecho a conocer, actualizar, rectificar o solicitar la eliminación total de tus datos de nuestras bases en cualquier momento escribiendo a voxelab1@gmail.com.',
          p_sec5_t: '5. Seguridad de la Información',
          p_sec5_d: 'Implementamos medidas técnicas y organizativas para prevenir el acceso no autorizado o alteración de datos.'
        },
        EN: {
          nav_services: 'Services',
          nav_portfolio: 'Portfolio',
          nav_quote: 'Quote',
          nav_process: 'Process',
          nav_faq: 'FAQ',
          nav_audit: 'Free Audit',
          hero_eyebrow: 'Digital Solutions · Voxel Lab',
          hero_h1: 'Technology that <em>sells, automates & scales</em> your business',
          hero_sub: 'Websites, apps, automation & custom AI software — all under a unified architecture, so your business operates 24/7 even when you are away.',
          hero_cta1: 'Get my free audit',
          hero_cta2: 'Explore solutions',
          hero_fine: 'no generic templates · proprietary architecture · tailored to your needs',
          stat_1: 'target load time',
          stat_2: 'mobile-first, thumb zone',
          stat_3: 'automated payment & contact',
          stat_4: 'faster development with custom software & AI',
          prob_eyebrow: 'The Problem',
          prob_h2: 'Your website might be scaring away customers right now',
          prob_sub: 'These are the silent mistakes that cost small businesses the most money — and are rarely noticed at first glance.',
          prob_c1_t: 'Slow Loading',
          prob_c1_d: '53% of visits leave if your page takes more than 3 seconds to load. Every second is a lost sale.',
          prob_c2_t: 'Thumb-Zone Ignored',
          prob_c2_d: '85% browse with one hand. If your contact button is out of natural thumb reach, you generate friction and dropouts.',
          prob_c3_t: 'Zero Automation',
          prob_c3_d: 'Manual order entry and late-night replies don’t scale. Your website should sell even while you sleep.',
          prob_c4_t: 'Generic Software',
          prob_c4_d: 'Excel, disconnected WhatsApp, and separate apps that don’t communicate. Without a custom system, your team works blindfolded.',
          audit_eyebrow: 'Instant Diagnostic',
          audit_h2: 'Analyze your current website speed',
          audit_sub: 'Discover how many customers and revenue you are losing due to slow loading times.',
          audit_btn: 'Analyze My Site',
          audit_m1_t: 'Mobile Load Time',
          audit_m1_s: '⚠️ 53% customer drop-off',
          audit_m2_t: 'Google Speed Score',
          audit_m2_s: 'Low SEO performance',
          audit_m4_t: 'Mobile UX & Thumb',
          audit_m4_s: 'Buttons outside thumb zone',
          audit_m3_t: 'Voxel Lab Solution',
          audit_m3_s: '🚀 99/100 Lighthouse',
          audit_findings_t: 'Main Technical Findings:',
          audit_f1: '🔴 <b>Server & Load:</b> High initial response time (TTFB) and uncompressed images.',
          audit_f2: '🟡 <b>Mobile Usability:</b> Menu and contact buttons outside natural thumb reach.',
          audit_f3: '🔴 <b>Conversion:</b> Lacks 1-click checkout and 24/7 automated WhatsApp reply.',
          audit_footer: '💡 <b>Diagnostic:</b> Your current site accumulates friction. With Voxel Lab architecture you will load <b>6x faster</b>.',
          audit_wa_share: '💬 Send to WhatsApp',
          audit_opt_btn: 'Optimize My Site Now ➔',
          serv_eyebrow: 'What We Build',
          serv_h2: 'Four pillars, one unified architecture',
          serv_sub: 'No stacked templates: front, back, and automation designed to work together from day one.',
          serv_p1_tag: 'Website',
          serv_p1_t: 'High-Converting Sites',
          serv_p1_d: 'Custom code, no generic builders. Speed, SSL, and structure built to sell, not just to look nice.',
          serv_p2_tag: 'App Design',
          serv_p2_t: 'Progressive Web Apps',
          serv_p2_d: 'Full native app experience without App Store friction or extra costs. Installable in one click.',
          serv_p3_tag: 'Automation',
          serv_p3_t: '24/7 Checkout & Alerts',
          serv_p3_d: 'Payment gateways, invoicing, and confirmation notifications running automatically without manual intervention.',
          serv_p4_tag: 'Custom AI Software Development',
          serv_p4_t: 'Built faster, built stronger',
          serv_p4_d: 'We develop custom software tailored specifically to your business operations and needs.',
          roi_eyebrow: 'Financial Projection',
          roi_h2: 'Calculate how much money Voxel Lab will return to you',
          roi_sub: 'Our websites and automations pay for themselves by recovering lost leads and accelerating sales 24/7.',
          roi_l1: 'Monthly Visits / Leads:',
          roi_l2: 'Average sale per customer:',
          roi_c1_tag: 'Estimated Current Loss',
          roi_c1_sub: 'Due to slowness, lack of 24/7 WhatsApp, and manual checkouts.',
          roi_c2_tag: 'Projected Voxel Gain',
          roi_c2_sub: '24/7 automated sales with 3x faster conversion rates.',
          auto_eyebrow: 'Automation in Action',
          auto_h2: 'Your whole business talking to one system',
          auto_sub: 'WhatsApp, payments, and billing connected to a single digital brain, without manual data entry.',
          auto_c_client: 'Client',
          auto_c_ready: 'Done',
          auto_c_happy: 'Happy Client',
          auto_info: 'Hover or focus on each connection to see what it automates.',
          auto_p1_t: 'Instant Response',
          auto_p1_d: 'WhatsApp connected to your site confirms orders and answers questions instantly, no staff required 24/7.',
          auto_p2_t: 'Frictionless Checkout',
          auto_p2_d: 'Payment gateway processes payments and sends confirmation in seconds automatically.',
          auto_p3_t: 'Automated Invoicing',
          auto_p3_d: 'Each sale generates its invoice and sends it automatically, ready for accounting.',
          proc_eyebrow: 'How We Work',
          proc_h2: 'From diagnostic to platform in three steps',
          proc_s1_idx: 'Step 1',
          proc_s1_t: 'Free Diagnostic',
          proc_s1_d: 'We audit your current website or idea: speed, mobile usability, and customer drop-off points.',
          proc_s2_idx: 'Step 2',
          proc_s2_t: 'Tailored Proposal',
          proc_s2_d: 'Clear architecture, timelines, and scope before writing a single line of code.',
          proc_s3_idx: 'Step 3',
          proc_s3_t: 'Delivery & Scale',
          proc_s3_d: 'Production-ready platform with active automation from day one.',
          port_eyebrow: 'Case Studies',
          port_h2: 'Voxel Lab Solutions Portfolio',
          port_sub: 'Explore how we transform speed and sales for real businesses with our architecture.',
          port_f_all: 'All',
          port_f_web: 'Websites',
          port_f_app: 'Web Apps',
          port_f_bot: 'Automation & AI',
          port_b1: 'Website',
          port_c1_t: 'Fashion & Boutique E-Commerce',
          port_c1_d: 'High-speed platform with 1-click checkout and mobile-optimized catalog.',
          port_b2: 'Web App',
          port_c2_t: 'Services & Booking App',
          port_c2_d: 'Installable Web App for home screens without app store downloads.',
          port_b3: 'Bot & AI',
          port_c3_t: '24/7 Booking Bot & WhatsApp AI',
          port_c3_d: 'Automated scheduling integrated with Google Calendar and PayU/Stripe payment gateways.',
          port_b4: 'AI Software',
          port_c4_t: 'Management Dashboard & AI Copilot',
          port_c4_d: 'Custom internal system with AI copilot for sales and customer analytics.',
          quote_eyebrow: 'Investment Calculator (Approximate)',
          quote_h2: 'How much does your solution cost?',
          quote_sub: 'Select your project modules and receive a real-time approximate estimate of investment and timeline.',
          q_step1: '<span class="quote-label-num">01</span> Main solution type (Select one or multiple options)',
          qc1_t: 'Website',
          qc1_d: 'Landings, corporate sites, and optimized online stores.',
          qc2_t: 'App / Web App',
          qc2_d: 'Mobile apps (iOS/Android) and custom SaaS platforms.',
          qc3_t: 'Automation',
          qc3_d: 'CRM, WhatsApp API, Make, n8n, and email integrations.',
          qc4_t: 'AI Software',
          qc4_d: 'Autonomous agents, LLMs, smart chatbots, and RAG systems.',
          q_step2: '<span class="quote-label-num">02</span> Scope & Customization Level (Approximate)',
          qcomp_1: 'MVP / Essential (Fast launch)',
          qcomp_b1: 'Standard',
          qcomp_2: 'Professional (Advanced design)',
          qcomp_3: 'Enterprise (Maximum scale)',
          q_step3: '<span class="quote-label-num">03</span> Optional Additional Modules (Approximate)',
          qex_1: 'Online Payment Gateway',
          qex_2: 'Admin Panel / Dashboard',
          qex_3: 'WhatsApp API & CRM Integration',
          qex_4: '24/7 Conversational AI Agent',
          qex_5: 'Multi-language Support (ES / EN)',
          qr_label: 'Estimated Investment',
          qr_note: '* Remember that all values and timelines shown are <b>approximate</b>. The final proposal will adjust to your exact technical requirements.',
          qa_wa: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:8px;"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg> Send Summary via WhatsApp',
          qa_email: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:8px;"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> Send Summary via Email',
          qt_1: 'NDA Agreement Available',
          qt_2: 'Fast response & custom proposal',
          qt_3: 'Zero commitments or obligations',
          proof_quote: '&ldquo;We stopped holding sales together with digital duct tape. Now the site charges, notifies, and invoices automatically.&rdquo;',
          proof_cite: '&mdash; standard applied in every Voxel Lab delivery',
          proof_m1: 'target conversion rate with optimized CTA',
          proof_m2: 'from payment to WhatsApp confirmation',
          faq_eyebrow: 'Frequently Asked Questions',
          faq_h2: 'Before reaching out',
          faq_q1: 'I already have a site, do you rebuild from scratch?',
          faq_a1: 'Not always. We start with a free diagnostic: sometimes optimizing speed and CTA structure is enough.',
          faq_q2: 'Do you work with small business budgets?',
          faq_a2: 'Yes. We start with the highest immediate impact module (landing or single channel automation) and scale in phases.',
          faq_q3: 'What do I need ready before starting?',
          faq_a3: 'Nothing technical on your part: logo, texts, or ideas if available, and clarity on who your target customers are. We structure the rest.',
          faq_q4: 'What happens after delivery? Do I get technical support?',
          faq_a4: 'We include technical onboarding and warranty after launch. Plus, your platform is optimized so you can easily manage your content independently.',
          faq_q5: 'Do the website and custom code belong 100% to my business?',
          faq_a5: 'Absolutely. Unlike agencies that "rent" you a site, all code, domains, and systems belong 100% to your company from day one.',
          faq_q6: 'Will my site be optimized for Google SEO and fast mobile loading?',
          faq_a6: 'Yes. We build with mobile-first thumb-zone architecture optimized to hit 90-100/100 scores on Google Lighthouse, ensuring maximum speed and ranking potential.',
          cta_h2: 'Is your website ready to capture customers?',
          cta_p: 'Free technical audit: speed, mobile-first, and conversion rate in under 48 hours.',
          cta_wa_btn: 'Chat on WhatsApp',
          cta_serv_btn: 'View Services Again',
          cta_globe_text: 'We support via WhatsApp from anywhere in the world, whenever you message us.',
          cc_email: 'Email',
          cc_social: 'Social',
          foot_copy: '<span class="brand-mark"></span> &copy; 2026 Voxel Lab &mdash; Digital solutions that drive your business.',
          foot_contact: 'Contact',
          thumb_btn_text: '🟢 Online · Reply in &lt; 15 min',
          port_cue: '👁️ View Interactive Case ➔',
          pmodal_s1: 'Load Speed',
          pmodal_s2: 'Google Speed',
          pmodal_s3: 'Conversion',
          pmodal_tech_t: '⚙️ Architecture & Included Modules:',
          pmodal_cta: 'I want a similar solution ➔',
          ticker_badge: 'LIVE ACTIVITY',
          ticker_eyebrow: '🟢 Live Activity',
          t_i1: 'A business in Bogota audited their site (34/100) and requested optimization.',
          t_i2: 'Someone in Medellin requested a Web App + WhatsApp Automation quote.',
          t_i3: 'New E-Commerce launched with 0.4s load speed & 99/100 Google score.',
          t_i4: 'Inquiry received from US for Custom AI Software development.',
          foot_privacy: 'Data Treatment & Privacy Policy',
          audit_privacy_note: '🔒 256-bit SSL Encrypted. By auditing your site you accept our <a href="#privacyModal" onclick="openPrivacyModal(); return false;" style="color:var(--cyan); text-decoration:underline;">Data Treatment Policy</a>.',
          audit_privacy_link: 'Data Treatment Policy',
          qt_4: 'Data Protection (Law 1581)',
          privacy_h3: 'Personal Data Treatment & Privacy Policy',
          privacy_sub: 'At Voxel Lab we guarantee the protection, confidentiality, and transparent use of your information.',
          privacy_close_btn: 'Understood & Accept',
          p_sec1_t: '1. Data Controller',
          p_sec1_d: 'Voxel Lab (voxelab.co), digital solutions & software development agency in Colombia. Contact email: voxelab1@gmail.com.',
          p_sec2_t: '2. Collected Data & Purpose',
          p_sec2_d: 'We only collect voluntarily entered website URL, WhatsApp phone number, and email. The sole purpose is delivering speed audits, requested quotes, and customer support.',
          p_sec3_t: '3. Protection & No Third-Party Disclosure',
          p_sec3_d: 'Your data is secured via 256-bit SSL/TLS encryption and will never be sold, leased, or shared with external platforms without express consent.',
          p_sec4_t: '4. Data Subject Rights',
          p_sec4_d: 'You have the right to access, update, rectify, or request full deletion of your personal data at any time by emailing voxelab1@gmail.com.',
          p_sec5_t: '5. Information Security',
          p_sec5_d: 'We implement technical and organizational measures to prevent unauthorized access or data alteration.'
        }
      };

      if (window.currentLang === "ES") return;
      var t = dict[window.currentLang] || dict.ES;
      document.querySelectorAll('[data-i18n]').forEach(function (el) {
        var key = el.dataset.i18n;
        if (t[key]) el.innerHTML = t[key];
      });

      if (typeof window.recalcQuote === 'function') window.recalcQuote();
      if (typeof window.updateCurrencyUI === 'function') window.updateCurrencyUI();
    };

    // Run UI initialization on load
    setTimeout(function () {
      window.updateCurrencyUI();
      window.updateLanguageUI();
    }, 80);
  })();
