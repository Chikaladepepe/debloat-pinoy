/* ============================================
   DEBLOAT PINOY - App Logic
   Complete SPA with localStorage persistence
   ============================================ */

(function () {
  'use strict';

  /* ==========================================
     CONSTANTS & CONFIGURATION
     ========================================== */
  const STORAGE_KEY = 'debulatPinoy';
  const TODAY = getToday();
  const TOTAL_TASKS = 6;
  const CIRCUMFERENCE = 2 * Math.PI * 58; // progress ring
  const TIMER_TOTAL = 180; // 3 minutes in seconds

  const TASK_DEFS = [
    { key: 'water', title: 'Drink 2-3L water', sub: 'Spread throughout the day', icon: 'fa-solid fa-droplet' },
    { key: 'massage', title: '3-min facial massage', sub: 'Step-by-step guide available', icon: 'fa-solid fa-hand-sparkles' },
    { key: 'pillows', title: 'Sleep with 2 pillows', sub: 'Elevated head for drainage', icon: 'fa-solid fa-bed' },
    { key: 'coldCompress', title: 'Cold compress / under-eye care', sub: 'AM routine', icon: 'fa-solid fa-snowflake' },
    { key: 'halfRice', title: 'Half-rice or less', sub: "Today's meals", icon: 'fa-solid fa-bowl-rice' },
    { key: 'potassium', title: 'Potassium food / extra water', sub: 'After salty meals', icon: 'fa-solid fa-apple-whole' }
  ];

  const MASSAGE_STEPS = [
    { time: '0:00-0:30', title: 'Knuckles under jaw', desc: '10x each side — use knuckles, start from chin and move outward' },
    { time: '0:30-1:00', title: 'Under cheekbones', desc: '10x each side — press gently under cheekbone and sweep outward' },
    { time: '1:00-1:30', title: 'Under chin to neck', desc: '10x — sweep from under chin down to neck for drainage' },
    { time: '1:30-2:00', title: 'Flat palms on cheeks', desc: '10x — press flat palms gently on cheeks and hold 2 sec each' },
    { time: '2:00-2:30', title: 'Repeat Step 1', desc: '10x each side — knuckles under jaw again' },
    { time: '2:30-3:00', title: 'Repeat Step 3', desc: '10x — under chin to neck, finish strong!' }
  ];

  const UNDER_EYE_METHODS = [
    { icon: 'fa-solid fa-spoon', title: 'Cold Spoons', desc: 'Put 2 metal spoons in the freezer for 5 minutes. Press the backs gently under your eyes for 30 seconds each side. The cold constricts blood vessels and reduces puffiness immediately.' },
    { icon: 'fa-solid fa-cube', title: 'Ice Cubes', desc: 'Wrap ice in a thin plastic or tissue. Press under eyes for 10-15 seconds. Never put ice directly on skin — always use a barrier.' },
    { icon: 'fa-solid fa-droplet', title: 'Cold Water Splash', desc: 'Splash cold water on your face for 15 seconds, 3x every morning. Simple, free, and surprisingly effective.' },
    { icon: 'fa-solid fa-lemon', title: 'Cold Calamansi', desc: 'Rub calamansi juice AROUND (not in) your eyes for 5 minutes, then rinse. The vitamin C and cold help brighten the area.' },
    { icon: 'fa-solid fa-leaf', title: 'Cucumber Slices', desc: 'Chill cucumber slices and place on eyes for 10 minutes. The hydration + cold combo is classic for a reason.' },
    { icon: 'fa-solid fa-seedling', title: 'Aloe Vera Gel', desc: 'Chill aloe vera gel, then dab a thin layer under your eyes. Anti-inflammatory and hydrating.' }
  ];

  const UNDER_EYE_HABITS = [
    'Drink extra water in the morning',
    'Get at least 5 minutes of sunlight daily',
    'Don\'t rub your eyes',
    'Eat iron-rich foods (spinach, kangkong)',
    'Use sunscreen SPF 30+ to prevent darkening'
  ];

  const UNDER_EYE_AVOID = [
    'Expensive eye creams — they don\'t fix genetics',
    'Cucumber alone — needs to be chilled to work',
    'Potato slices — no proven benefit'
  ];

  const FOOD_AVOID = [
    { title: 'Dairy', items: 'Milk, cheese, yogurt, whey protein' },
    { title: 'Gluten & Heavy Carbs', items: 'Bread, pasta, rice, oats, cereal' },
    { title: 'Sugar', items: 'Soda, juice, candy, artificial sweeteners' },
    { title: 'Alcohol', items: 'All types — causes water retention' },
    { title: 'Caffeine', items: 'Max 1 cup black coffee AM only, none after 12 PM' },
    { title: 'Processed Meats', items: 'Bacon, sausage, spam, longganisa, tocino' },
    { title: 'Cruciferous Veggies', items: 'Broccoli, cauliflower, cabbage — cause bloating' },
    { title: 'Chewing Gum', items: 'Swallows air = facial tension and puffiness' }
  ];

  const FOOD_EAT = [
    { title: 'Lean Protein', items: 'Chicken breast, eggs, salmon, turkey, bangus, tilapia' },
    { title: 'Veggies', items: 'Cucumber, celery, asparagus, spinach, kangkong, pechay' },
    { title: 'Healthy Fats', items: 'Avocado, olive oil, handful of almonds' },
    { title: 'Drinks', items: 'Water, buko juice, calamansi juice, peppermint tea, lemon water' },
    { title: 'Pinoy Ulam', items: 'Adobo (less soy sauce), grilled liempo, tinola, sinigang (less mix), tuyo/dilis (rinse salt)' },
    { title: 'Potassium-Rich', items: 'Saging, buko, kamote, gabi, pechay, kangkong, calamansi, pineapple, papaya, unsalted nuts' },
    { title: 'No Options Available?', items: 'Double your water + use salt substitute. Still better than normal!' }
  ];

  const NANAY_STRATEGIES = [
    { title: 'Half-Rice Move', desc: 'Take half portion on your plate. If Nanay asks, just say:', dialogue: '"Ma, busog pa ko kanina, kalahati lang muna."' },
    { title: 'Load Up on Sabaw', desc: 'Sinigang, bulalo, tinola — these fill you up naturally without the rice. Ask for extra soup!', dialogue: null },
    { title: 'Ask for More Gulay', desc: 'Showing interest in vegetables makes Nanay happy. Bonus: it\'s actually good for you!', dialogue: '"Ma, pwedeng dagdagan yung kangkong/pechay?"' },
    { title: 'The Baon Move', desc: 'Pack less rice in your school baon. If you make it yourself, Nanay won\'t even notice.', dialogue: null },
    { title: 'The Dinner Loophole', desc: 'Cut rice at dinner. Your body doesn\'t need it that late anyway.', dialogue: '"Ma, busog pa ko sa merienda, rice na lang bukas."' },
    { title: 'Blame It on School', desc: 'Parents love hearing it\'s for school. Use it!', dialogue: '"Ma, sabi sa PE/health class, half-rice for athletic performance daw."' },
    { title: 'Drink Water Before Meals', desc: '2 glasses before eating = genuinely full. You\'ll naturally eat less rice. Genius move.', dialogue: null }
  ];

  const BADGES_DEF = [
    { key: '7day', icon: 'fa-solid fa-fire', name: 'Dedicated', desc: '7-day streak' },
    { key: '14day', icon: 'fa-solid fa-face-grin-beam', name: 'Jawline Warrior', desc: '14-day streak' },
    { key: '30day', icon: 'fa-solid fa-crown', name: 'Debloat Master', desc: '30-day streak' },
    { key: '50rice', icon: 'fa-solid fa-bowl-rice', name: 'Half-Rice King', desc: '50 rice logs' },
    { key: '100massage', icon: 'fa-solid fa-hand-sparkles', name: 'Lymphatic Legend', desc: '100 massages logged' }
  ];

  /* ==========================================
     DEFAULT DATA STRUCTURE
     ========================================== */
  function defaultData() {
    return {
      user: { name: 'Pre', age: 15, currentWeight: 60, startWeight: 90, startDate: TODAY },
      dailyLogs: {},
      streak: { current: 0, best: 0, lastDate: null },
      badges: { '7day': false, '14day': false, '30day': false, '50rice': false, '100massage': false },
      settings: {
        notifications: { morning: true, water: true, lunch: true, merienda: true, dinner: true, sleep: true },
        darkMode: true,
        fontSize: 'medium'
      },
      weightHistory: []
    };
  }

  function defaultDayLog() {
    return {
      tasks: { water: false, massage: false, pillows: false, coldCompress: false, halfRice: false, potassium: false },
      riceLog: { breakfast: null, lunch: null, dinner: null },
      waterGlasses: 0,
      notes: '',
      mood: '',
      timestamp: null
    };
  }

  /* ==========================================
     UTILITY FUNCTIONS
     ========================================== */
  function getToday() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr + 'T12:00:00');
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return d.toLocaleDateString('en-US', options);
  }

  function formatDateShort(dateStr) {
    const d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  }

  function isToday(dateStr) {
    return dateStr === TODAY;
  }

  function isFuture(dateStr) {
    return dateStr > TODAY;
  }

  function daysBetween(a, b) {
    const da = new Date(a + 'T12:00:00');
    const db = new Date(b + 'T12:00:00');
    return Math.round((db - da) / (1000 * 60 * 60 * 24));
  }

  function addDays(dateStr, n) {
    const d = new Date(dateStr + 'T12:00:00');
    d.setDate(d.getDate() + n);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  function debounce(fn, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  /* ==========================================
     DATA PERSISTENCE
     ========================================== */
  let appData = null;

  function loadData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Merge with defaults for missing keys
        appData = Object.assign(defaultData(), parsed);
        appData.user = Object.assign(defaultData().user, parsed.user || {});
        appData.streak = Object.assign(defaultData().streak, parsed.streak || {});
        appData.badges = Object.assign(defaultData().badges, parsed.badges || {});
        appData.settings = Object.assign(defaultData().settings, parsed.settings || {});
        appData.settings.notifications = Object.assign(
          defaultData().settings.notifications,
          (parsed.settings && parsed.settings.notifications) || {}
        );
        if (!appData.weightHistory) appData.weightHistory = [];
        return true;
      }
    } catch (e) {
      console.warn('Data load failed, using defaults:', e);
    }
    appData = defaultData();
    return false;
  }

  function saveData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
    } catch (e) {
      console.warn('Save failed:', e);
      showToast('Storage full! Export your data.', 'error');
    }
  }

  /* ==========================================
     DATA FUNCTIONS (as specified)
     ========================================== */
  function saveLog(date, data) {
    appData.dailyLogs[date] = Object.assign(defaultDayLog(), data);
    saveData();
  }

  function getLog(date) {
    return appData.dailyLogs[date] || defaultDayLog();
  }

  function calculateStreak() {
    let current = 0;
    let best = 0;
    let checkDate = TODAY;
    const dates = Object.keys(appData.dailyLogs).sort();

    // Calculate current streak (count back from yesterday, since today may be incomplete)
    // Actually: count consecutive complete days ending today or yesterday
    // First check if today is complete
    const todayLog = getLog(TODAY);
    const todayComplete = isAllComplete(todayLog);

    if (todayComplete) {
      // Count back from today
      checkDate = TODAY;
      while (isAllComplete(getLog(checkDate))) {
        current++;
        checkDate = addDays(checkDate, -1);
      }
    } else {
      // Count back from yesterday
      checkDate = addDays(TODAY, -1);
      while (isAllComplete(getLog(checkDate))) {
        current++;
        checkDate = addDays(checkDate, -1);
      }
    }

    // Calculate best streak from all data
    const allDates = dates.filter(d => isAllComplete(getLog(d))).sort();
    let tempBest = 0;
    let tempStreak = 0;
    for (let i = 0; i < allDates.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        if (daysBetween(allDates[i - 1], allDates[i]) === 1) {
          tempStreak++;
        } else {
          tempStreak = 1;
        }
      }
      tempBest = Math.max(tempBest, tempStreak);
    }

    best = Math.max(current, tempBest, appData.streak.best);
    appData.streak.current = current;
    appData.streak.best = best;
    return { current, best };
  }

  function isAllComplete(log) {
    if (!log || !log.tasks) return false;
    return Object.values(log.tasks).every(v => v === true);
  }

  function getCompletionRate(date) {
    const log = getLog(date);
    if (!log || !log.tasks) return 0;
    const done = Object.values(log.tasks).filter(v => v === true).length;
    return Math.round((done / TOTAL_TASKS) * 100);
  }

  function getMonthlyData(month, year) {
    const data = {};
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      if (appData.dailyLogs[dateStr]) {
        data[d] = getLog(dateStr);
      }
    }
    return data;
  }

  function toggleTask(date, taskName) {
    const log = getLog(date);
    log.tasks[taskName] = !log.tasks[taskName];
    saveLog(date, log);
    updateStreak();
    badgeChecker();
    return log;
  }

  function updateStreak() {
    const streak = calculateStreak();
    saveData();
    return streak;
  }

  function badgeChecker() {
    const streak = appData.streak;

    // Streak badges
    if (streak.current >= 7 || streak.best >= 7) appData.badges['7day'] = true;
    if (streak.current >= 14 || streak.best >= 14) appData.badges['14day'] = true;
    if (streak.current >= 30 || streak.best >= 30) appData.badges['30day'] = true;

    // Rice log count
    let riceCount = 0;
    Object.values(appData.dailyLogs).forEach(log => {
      if (log.riceLog) {
        if (log.riceLog.breakfast) riceCount++;
        if (log.riceLog.lunch) riceCount++;
        if (log.riceLog.dinner) riceCount++;
      }
    });
    if (riceCount >= 50) appData.badges['50rice'] = true;

    // Massage count
    let massageCount = 0;
    Object.values(appData.dailyLogs).forEach(log => {
      if (log.tasks && log.tasks.massage) massageCount++;
    });
    if (massageCount >= 100) appData.badges['100massage'] = true;

    saveData();
  }

  function getRiceScore(riceLog) {
    if (!riceLog) return 'none';
    const vals = [riceLog.breakfast, riceLog.lunch, riceLog.dinner].filter(Boolean);
    if (vals.length === 0) return 'none';
    const normals = vals.filter(v => v === 'normal').length;
    if (normals >= 3) return 'high';
    if (normals === 2) return 'okay';
    if (normals <= 1) return 'good';
    return 'good';
  }

  /* ==========================================
     TOAST NOTIFICATIONS
     ========================================== */
  function showToast(message, type) {
    type = type || 'info';
    const container = document.getElementById('toast-container');
    const icons = {
      success: 'fa-solid fa-check-circle',
      error: 'fa-solid fa-exclamation-circle',
      info: 'fa-solid fa-info-circle',
      warning: 'fa-solid fa-triangle-exclamation'
    };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="${icons[type]}" aria-hidden="true"></i><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('removing');
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  /* ==========================================
     CONFIRMATION DIALOG
     ========================================== */
  function showConfirm(title, message, onConfirm, btnText) {
    btnText = btnText || 'Confirm';
    const overlay = document.getElementById('confirm-dialog');
    document.getElementById('confirm-title').textContent = title;
    document.getElementById('confirm-message').textContent = message;
    document.getElementById('confirm-ok').textContent = btnText;
    const okBtn = document.getElementById('confirm-ok');
    const cancelBtn = document.getElementById('confirm-cancel');

    overlay.style.display = 'flex';

    function close() {
      overlay.style.display = 'none';
      okBtn.removeEventListener('click', handleOk);
      cancelBtn.removeEventListener('click', close);
    }

    function handleOk() {
      close();
      onConfirm();
    }

    okBtn.addEventListener('click', handleOk);
    cancelBtn.addEventListener('click', close);
  }

  /* ==========================================
     SCREEN NAVIGATION
     ========================================== */
  let currentScreen = 'home';

  function switchScreen(name) {
    currentScreen = name;

    // Close any overlays first
    var dayDetail = document.getElementById('day-detail');
    if (dayDetail) dayDetail.style.display = 'none';

    document.querySelectorAll('.screen').forEach(s => {
      s.style.display = 'none';
      s.classList.remove('active');
    });
    var target = document.getElementById('screen-' + name);
    if (target) {
      target.style.display = 'block';
      target.classList.add('active');
    }

    // Scroll to top
    window.scrollTo(0, 0);

    // Update bottom nav
    document.querySelectorAll('.nav-item').forEach(n => {
      n.classList.toggle('active', n.dataset.screen === name);
      if (n.dataset.screen === name) {
        n.setAttribute('aria-current', 'page');
      } else {
        n.removeAttribute('aria-current');
      }
    });

    // Render screen-specific content
    try {
      if (name === 'home') renderHome();
      if (name === 'calendar') renderCalendar();
      if (name === 'stats') renderStats();
      if (name === 'settings') renderSettings();
    } catch (e) {
      console.warn('Screen render error:', e);
    }
  }

  /* ==========================================
     HOME SCREEN
     ========================================== */
  function renderHome() {
    const log = getLog(TODAY);
    const streak = calculateStreak();

    // Streak
    document.getElementById('streak-current').textContent = streak.current;
    document.getElementById('streak-best').textContent = streak.best;

    // Greeting
    document.getElementById('greeting-text').textContent =
      `${getGreeting()}, ${appData.user.name}!`;
    document.getElementById('date-text').textContent = formatDate(TODAY);

    // Progress ring
    const done = Object.values(log.tasks).filter(v => v === true).length;
    const pct = Math.round((done / TOTAL_TASKS) * 100);
    const offset = CIRCUMFERENCE - (pct / 100) * CIRCUMFERENCE;
    document.getElementById('progress-ring-fill').style.strokeDashoffset = offset;
    document.getElementById('progress-text').textContent = `${done}/${TOTAL_TASKS}`;
    document.getElementById('progress-percent').textContent = `${pct}% complete`;

    // Change ring color based on completion
    const ringFill = document.getElementById('progress-ring-fill');
    if (pct === 100) ringFill.style.stroke = '#34D399';
    else if (pct >= 60) ringFill.style.stroke = '#1A8B5A';
    else ringFill.style.stroke = '#FF6B35';

    // Checklist
    renderChecklist(log);

    // Rice log
    renderRiceLog(log);

    // Water tracker
    renderWaterTracker(log);

    // Notes
    const notesEl = document.getElementById('daily-notes');
    notesEl.value = log.notes || '';
    const tsEl = document.getElementById('notes-timestamp');
    tsEl.textContent = log.timestamp ? `Last saved: ${new Date(log.timestamp).toLocaleTimeString()}` : '';
  }

  function renderChecklist(log) {
    const container = document.getElementById('checklist');
    container.innerHTML = '';

    TASK_DEFS.forEach(task => {
      const done = log.tasks[task.key] === true;
      const card = document.createElement('div');
      card.className = `task-card ${done ? 'completed' : ''}`;
      card.setAttribute('role', 'checkbox');
      card.setAttribute('aria-checked', done);
      card.setAttribute('aria-label', task.title);
      card.setAttribute('tabindex', '0');
      card.innerHTML = `
        <div class="task-checkbox" aria-hidden="true">
          <i class="fa-solid fa-check" aria-hidden="true"></i>
        </div>
        <div class="task-info">
          <div class="task-title">${task.title}</div>
          <div class="task-subtitle">${task.sub}</div>
        </div>
        <div class="task-icon"><i class="${task.icon}" aria-hidden="true"></i></div>
      `;

      function handleToggle() {
        toggleTask(TODAY, task.key);
        const newLog = getLog(TODAY);
        renderChecklist(newLog);
        renderHome(); // Update progress ring
        // Haptic feedback simulation
        if (navigator.vibrate) navigator.vibrate(10);
        showToast(
          newLog.tasks[task.key] ? `${task.title} - done!` : `${task.title} - unchecked`,
          newLog.tasks[task.key] ? 'success' : 'info'
        );
      }

      card.addEventListener('click', handleToggle);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleToggle();
        }
      });

      container.appendChild(card);
    });
  }

  function renderRiceLog(log) {
    ['breakfast', 'lunch', 'dinner'].forEach(meal => {
      const options = document.querySelector(`.rice-options[data-meal="${meal}"]`);
      if (!options) return;
      const currentVal = log.riceLog[meal];
      options.querySelectorAll('.rice-btn').forEach(btn => {
        btn.classList.toggle('selected', btn.dataset.value === currentVal);
      });
    });

    // Score
    const scoreEl = document.getElementById('rice-score');
    const score = getRiceScore(log.riceLog);
    if (score === 'good') {
      scoreEl.textContent = 'Good! Low bloat risk today';
      scoreEl.className = 'rice-score good';
    } else if (score === 'okay') {
      scoreEl.textContent = 'Okay — watch out for the next meal';
      scoreEl.className = 'rice-score okay';
    } else if (score === 'high') {
      scoreEl.textContent = 'High bloat risk — drink extra water';
      scoreEl.className = 'rice-score high';
    } else {
      scoreEl.textContent = 'Log your meals above';
      scoreEl.className = 'rice-score';
    }
  }

  function renderWaterTracker(log) {
    const container = document.getElementById('water-glasses');
    const count = log.waterGlasses || 0;
    container.innerHTML = '';

    for (let i = 0; i < 8; i++) {
      const glass = document.createElement('button');
      glass.className = `water-glass ${i < count ? 'filled' : ''}`;
      glass.setAttribute('aria-label', `Glass ${i + 1}${i < count ? ' filled' : ''}`);
      glass.innerHTML = '<i class="fa-solid fa-droplet" aria-hidden="true"></i>';
      glass.addEventListener('click', () => {
        const newLog = getLog(TODAY);
        if (i < count) {
          // Clicked on a filled glass — unfill up to here
          newLog.waterGlasses = i;
        } else {
          // Click on empty glass — fill up to here
          newLog.waterGlasses = i + 1;
        }
        saveLog(TODAY, newLog);
        renderWaterTracker(newLog);
        if (navigator.vibrate) navigator.vibrate(10);
      });
      container.appendChild(glass);
    }

    document.getElementById('water-count-text').textContent = count;
    document.getElementById('water-liters').textContent = `(${(count * 0.25).toFixed(1)}L)`;
  }

  /* ==========================================
     CALENDAR SCREEN
     ========================================== */
  let calMonth, calYear;

  function initCalendar() {
    const now = new Date();
    calMonth = now.getMonth();
    calYear = now.getFullYear();
  }

  function renderCalendar() {
    if (!calMonth && calMonth !== 0) initCalendar();

    const streak = calculateStreak();
    document.getElementById('cal-streak').textContent = streak.current;
    document.getElementById('cal-best-streak').textContent = streak.best;

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    document.getElementById('cal-month-label').textContent = `${monthNames[calMonth]} ${calYear}`;

    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const todayDate = new Date();
    const todayMonth = todayDate.getMonth();
    const todayYear = todayDate.getFullYear();

    const container = document.getElementById('cal-days');
    container.innerHTML = '';

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement('div');
      empty.className = 'cal-day empty';
      container.appendChild(empty);
    }

    // Day cells
    let completeCount = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const cell = document.createElement('div');
      cell.className = 'cal-day';
      cell.setAttribute('tabindex', '0');
      cell.setAttribute('aria-label', `${formatDate(dateStr)}`);

      const num = document.createElement('span');
      num.textContent = d;
      cell.appendChild(num);

      const isTodaysDate = (d === todayDate.getDate() && calMonth === todayMonth && calYear === todayYear);
      const isFutureDate = isFuture(dateStr);
      const hasData = appData.dailyLogs[dateStr];

      if (isTodaysDate) cell.classList.add('today');
      if (isFutureDate) cell.classList.add('future');

      // Colored dot
      if (hasData && !isFutureDate) {
        const rate = getCompletionRate(dateStr);
        const dot = document.createElement('span');
        dot.className = 'dot';
        if (rate >= 100) { dot.classList.add('green'); completeCount++; }
        else if (rate >= 67) { dot.classList.add('yellow'); }
        else { dot.classList.add('red'); }
        cell.appendChild(dot);
      } else if (!isFutureDate && !hasData) {
        const dot = document.createElement('span');
        dot.className = 'dot gray';
        cell.appendChild(dot);
      }

      // Tap to see detail
      if (!isFutureDate && hasData) {
        cell.addEventListener('click', () => showDayDetail(dateStr));
        cell.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') showDayDetail(dateStr);
        });
        cell.style.cursor = 'pointer';
      }

      container.appendChild(cell);
    }

    // Monthly stats
    const logsThisMonth = Object.keys(appData.dailyLogs)
      .filter(d => {
        const dd = new Date(d + 'T12:00:00');
        return dd.getMonth() === calMonth && dd.getFullYear() === calYear;
      });

    const completeDays = logsThisMonth.filter(d => isAllComplete(getLog(d))).length;
    const totalDaysWithLogs = logsThisMonth.length;
    const rate = totalDaysWithLogs > 0 ? Math.round((completeDays / daysInMonth) * 100) : 0;

    document.getElementById('cal-stats').innerHTML = `
      <div class="stat-row"><span>Days with data</span><strong>${totalDaysWithLogs}</strong></div>
      <div class="stat-row"><span>Days fully complete</span><strong>${completeDays}</strong></div>
      <div class="stat-row"><span>Completion rate</span><strong>${rate}%</strong></div>
    `;
  }

  function showDayDetail(dateStr) {
    const detail = document.getElementById('day-detail');
    const content = document.getElementById('day-detail-content');
    document.getElementById('day-detail-date').textContent = formatDate(dateStr);

    const log = getLog(dateStr);
    const done = Object.values(log.tasks).filter(v => v === true).length;
    const pct = Math.round((done / TOTAL_TASKS) * 100);

    const morningTasks = [
      { label: 'Cold water splash', done: log.tasks.coldCompress },
      { label: '3-min facial massage', done: log.tasks.massage },
      { label: 'Cold compress', done: log.tasks.coldCompress },
      { label: '1 glass water', done: log.waterGlasses > 0 }
    ];

    const dayTasks = [
      { label: `${log.waterGlasses || 0}/8+ glasses of water`, done: (log.waterGlasses || 0) >= 8 },
      { label: 'Half rice or less', done: log.tasks.halfRice },
      { label: 'No sodium snacks', done: log.tasks.potassium }
    ];

    const nightTasks = [
      { label: '2 pillows for sleeping', done: log.tasks.pillows },
      { label: 'Ate potassium-rich food', done: log.tasks.potassium },
      { label: 'Rice log checked', done: Object.values(log.riceLog).some(Boolean) }
    ];

    let html = '';
    html += '<div class="detail-section"><h3>AM Routine</h3>';
    morningTasks.forEach(t => {
      html += `<div class="detail-task ${t.done ? 'done' : 'not-done'}">
        <i class="fa-solid ${t.done ? 'fa-check-circle' : 'fa-circle'}" aria-hidden="true"></i>
        <span>${t.label}</span></div>`;
    });
    html += '</div>';

    html += '<div class="detail-section"><h3>Throughout Day</h3>';
    dayTasks.forEach(t => {
      html += `<div class="detail-task ${t.done ? 'done' : 'not-done'}">
        <i class="fa-solid ${t.done ? 'fa-check-circle' : 'fa-circle'}" aria-hidden="true"></i>
        <span>${t.label}</span></div>`;
    });
    html += '</div>';

    html += '<div class="detail-section"><h3>Evening / Night</h3>';
    nightTasks.forEach(t => {
      html += `<div class="detail-task ${t.done ? 'done' : 'not-done'}">
        <i class="fa-solid ${t.done ? 'fa-check-circle' : 'fa-circle'}" aria-hidden="true"></i>
        <span>${t.label}</span></div>`;
    });
    html += '</div>';

    // Overall
    html += `<div class="detail-section">
      <h3>Overall: ${done}/${TOTAL_TASKS} tasks completed</h3>
      <div class="detail-progress-bar">
        <div class="detail-progress-fill" style="width: ${pct}%"></div>
      </div>
    </div>`;

    if (log.notes) {
      html += `<div class="detail-section"><h3>Notes</h3>
        <div class="detail-task done"><i class="fa-solid fa-note-sticky" aria-hidden="true"></i>
        <span>${log.notes}</span></div></div>`;
    }

    content.innerHTML = html;
    detail.style.display = 'block';
    detail.style.overflowY = 'auto';
  }

  /* ==========================================
     STATS SCREEN
     ========================================== */
  function renderStats() {
    const streak = calculateStreak();

    // Summary cards
    let totalTracked = Object.keys(appData.dailyLogs).length;
    document.getElementById('stats-summary').innerHTML = `
      <div class="stats-card">
        <div class="stats-icon"><i class="fa-solid fa-fire" aria-hidden="true"></i></div>
        <div class="stats-value">${streak.current}</div>
        <div class="stats-label">Current Streak</div>
      </div>
      <div class="stats-card">
        <div class="stats-icon" style="color:var(--accent)"><i class="fa-solid fa-trophy" aria-hidden="true"></i></div>
        <div class="stats-value">${streak.best}</div>
        <div class="stats-label">Best Streak</div>
      </div>
      <div class="stats-card">
        <div class="stats-icon" style="color:var(--secondary)"><i class="fa-solid fa-calendar-check" aria-hidden="true"></i></div>
        <div class="stats-value">${totalTracked}</div>
        <div class="stats-label">Days Tracked</div>
      </div>
      <div class="stats-card">
        <div class="stats-icon" style="color:var(--success)"><i class="fa-solid fa-bullseye" aria-hidden="true"></i></div>
        <div class="stats-value">${calculateOverallRate()}%</div>
        <div class="stats-label">Completion Rate</div>
      </div>
    `;

    // Charts
    drawCompletionChart();
    drawRiceChart();

    // Badges
    renderBadges();

    // Weight
    renderWeightChart();
  }

  function calculateOverallRate() {
    const logs = Object.values(appData.dailyLogs);
    if (logs.length === 0) return 0;
    const total = logs.reduce((sum, log) => {
      return sum + Object.values(log.tasks).filter(v => v === true).length;
    }, 0);
    return Math.round((total / (logs.length * TOTAL_TASKS)) * 100);
  }

  function drawCompletionChart() {
    const canvas = document.getElementById('chart-completion');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = 200 * dpr;
    ctx.scale(dpr, dpr);
    const w = canvas.offsetWidth;
    const h = 200;

    ctx.clearRect(0, 0, w, h);

    // Last 30 days
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const d = addDays(TODAY, -i);
      days.push({
        date: d,
        rate: getCompletionRate(d),
        hasData: !!appData.dailyLogs[d]
      });
    }

    const barWidth = Math.max(4, (w - 20) / 30 - 2);
    const maxH = h - 40;

    days.forEach((day, i) => {
      const x = 10 + i * ((w - 20) / 30);
      const barH = (day.rate / 100) * maxH;
      const y = h - 20 - barH;

      if (day.hasData) {
        if (day.rate >= 100) ctx.fillStyle = '#34D399';
        else if (day.rate >= 67) ctx.fillStyle = '#1A8B5A';
        else if (day.rate > 0) ctx.fillStyle = '#FF6B35';
        else ctx.fillStyle = '#F87171';
      } else {
        ctx.fillStyle = '#334155';
      }

      // Rounded top corners
      const radius = Math.min(3, barWidth / 2);
      if (barH > radius) {
        ctx.beginPath();
        ctx.moveTo(x, y + radius);
        ctx.arcTo(x, y, x + barWidth, y, radius);
        ctx.arcTo(x + barWidth, y, x + barWidth, y + barH, radius);
        ctx.lineTo(x + barWidth, h - 20);
        ctx.lineTo(x, h - 20);
        ctx.closePath();
        ctx.fill();
      } else if (day.hasData) {
        ctx.fillRect(x, y, barWidth, Math.max(barH, 2));
      } else {
        ctx.fillRect(x, y, barWidth, 2);
      }
    });

    // X-axis labels
    ctx.fillStyle = '#94A3B8';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    [0, 7, 14, 21, 29].forEach(i => {
      const d = new Date(days[i].date + 'T12:00:00');
      ctx.fillText(`${d.getMonth() + 1}/${d.getDate()}`, 10 + i * ((w - 20) / 30) + barWidth / 2, h - 4);
    });
  }

  function drawRiceChart() {
    const canvas = document.getElementById('chart-rice');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = 200 * dpr;
    ctx.scale(dpr, dpr);
    const w = canvas.offsetWidth;
    const h = 200;

    ctx.clearRect(0, 0, w, h);

    // Count rice types over last 14 days
    let counts = { normal: 0, half: 0, none: 0, alt: 0 };
    for (let i = 13; i >= 0; i--) {
      const d = addDays(TODAY, -i);
      const log = getLog(d);
      if (log.riceLog) {
        ['breakfast', 'lunch', 'dinner'].forEach(meal => {
          const v = log.riceLog[meal];
          if (v && counts[v] !== undefined) counts[v]++;
        });
      }
    }

    const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
    const colors = { normal: '#F87171', half: '#FCD34D', none: '#34D399', alt: '#34D399' };
    const labels = { normal: 'Normal', half: 'Half', none: 'No Rice', alt: 'Alt' };
    const barW = (w - 40) / 4;

    Object.entries(counts).forEach(([key, val], i) => {
      const barH = (val / total) * (h - 60);
      const x = 20 + i * barW + barW * 0.15;
      const y = h - 40 - barH;

      ctx.fillStyle = colors[key];
      const radius = Math.min(4, barW * 0.3);
      ctx.beginPath();
      ctx.moveTo(x, y + radius);
      ctx.arcTo(x, y, x + barW * 0.7, y, radius);
      ctx.arcTo(x + barW * 0.7, y, x + barW * 0.7, y + barH, radius);
      ctx.lineTo(x + barW * 0.7, h - 40);
      ctx.lineTo(x, h - 40);
      ctx.closePath();
      ctx.fill();

      // Label
      ctx.fillStyle = '#94A3B8';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(labels[key], x + barW * 0.35, h - 24);
      ctx.fillText(`${val}`, x + barW * 0.35, y - 6);
    });

    ctx.fillStyle = '#94A3B8';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Last 14 days', w / 2, 16);
  }

  function renderBadges() {
    const container = document.getElementById('badges-grid');
    container.innerHTML = '';

    BADGES_DEF.forEach(badge => {
      const unlocked = appData.badges[badge.key];
      const card = document.createElement('div');
      card.className = `badge-card ${unlocked ? 'unlocked' : 'locked'}`;
      card.innerHTML = `
        <div class="badge-icon"><i class="${badge.icon}" aria-hidden="true"></i></div>
        <div class="badge-name">${badge.name}</div>
        <div class="badge-desc">${badge.desc}</div>
      `;
      container.appendChild(card);
    });
  }

  function renderWeightChart() {
    const canvas = document.getElementById('chart-weight');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = 180 * dpr;
    ctx.scale(dpr, dpr);
    const w = canvas.offsetWidth;
    const h = 180;

    ctx.clearRect(0, 0, w, h);

    const hist = appData.weightHistory || [];
    if (hist.length < 2) {
      ctx.fillStyle = '#94A3B8';
      ctx.font = '13px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Log 2+ weight entries to see trend', w / 2, h / 2);
      return;
    }

    const weights = hist.map(e => e.weight);
    const minW = Math.min(...weights) - 2;
    const maxW = Math.max(...weights) + 2;
    const range = maxW - minW || 1;
    const pad = 30;

    // Draw grid lines
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 4; i++) {
      const y = pad + (i / 4) * (h - pad * 2);
      ctx.beginPath();
      ctx.moveTo(pad, y);
      ctx.lineTo(w - 10, y);
      ctx.stroke();

      const val = maxW - (i / 4) * range;
      ctx.fillStyle = '#94A3B8';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(val.toFixed(0) + 'kg', pad - 4, y + 4);
    }

    // Draw line
    ctx.strokeStyle = '#1A8B5A';
    ctx.lineWidth = 2;
    ctx.beginPath();
    hist.forEach((entry, i) => {
      const x = pad + (i / (hist.length - 1)) * (w - pad - 10);
      const y = pad + ((maxW - entry.weight) / range) * (h - pad * 2);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw dots
    hist.forEach((entry, i) => {
      const x = pad + (i / (hist.length - 1)) * (w - pad - 10);
      const y = pad + ((maxW - entry.weight) / range) * (h - pad * 2);
      ctx.fillStyle = '#34D399';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    // Labels
    ctx.fillStyle = '#94A3B8';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    const step = Math.max(1, Math.floor(hist.length / 5));
    hist.forEach((entry, i) => {
      if (i % step === 0 || i === hist.length - 1) {
        const x = pad + (i / (hist.length - 1)) * (w - pad - 10);
        ctx.fillText(formatDateShort(entry.date), x, h - 8);
      }
    });
  }

  /* ==========================================
     SETTINGS SCREEN
     ========================================== */
  function renderSettings() {
    document.getElementById('set-name').value = appData.user.name || '';
    document.getElementById('set-age').value = appData.user.age || 15;
    document.getElementById('set-weight').value = appData.user.currentWeight || '';
    document.getElementById('set-start-weight').value = appData.user.startWeight || '';
    document.getElementById('set-font-size').value = appData.settings.fontSize || 'medium';

    document.getElementById('notif-morning').checked = appData.settings.notifications.morning;
    document.getElementById('notif-water').checked = appData.settings.notifications.water;
    document.getElementById('notif-lunch').checked = appData.settings.notifications.lunch;
    document.getElementById('notif-merienda').checked = appData.settings.notifications.merienda;
    document.getElementById('notif-dinner').checked = appData.settings.notifications.dinner;
    document.getElementById('notif-sleep').checked = appData.settings.notifications.sleep;
  }

  function saveSettings() {
    appData.user.name = document.getElementById('set-name').value.trim() || 'Pre';
    appData.user.age = parseInt(document.getElementById('set-age').value) || 15;
    appData.user.currentWeight = parseInt(document.getElementById('set-weight').value) || 60;
    appData.user.startWeight = parseInt(document.getElementById('set-start-weight').value) || 90;

    appData.settings.fontSize = document.getElementById('set-font-size').value;
    appData.settings.notifications.morning = document.getElementById('notif-morning').checked;
    appData.settings.notifications.water = document.getElementById('notif-water').checked;
    appData.settings.notifications.lunch = document.getElementById('notif-lunch').checked;
    appData.settings.notifications.merienda = document.getElementById('notif-merienda').checked;
    appData.settings.notifications.dinner = document.getElementById('notif-dinner').checked;
    appData.settings.notifications.sleep = document.getElementById('notif-sleep').checked;

    // Apply font size
    document.body.className = `font-${appData.settings.fontSize}`;

    saveData();
  }

  /* ==========================================
     MASSAGE TIMER
     ========================================== */
  let timerState = { running: false, remaining: TIMER_TOTAL, interval: null, soundOn: true };

  function updateTimerDisplay() {
    const min = Math.floor(timerState.remaining / 60);
    const sec = timerState.remaining % 60;
    document.getElementById('timer-display').textContent =
      `${min}:${String(sec).padStart(2, '0')}`;

    // Progress circle
    const pct = timerState.remaining / TIMER_TOTAL;
    const offset = 553 * (1 - pct);
    document.getElementById('timer-progress').style.strokeDashoffset = offset;

    // Current step
    const elapsed = TIMER_TOTAL - timerState.remaining;
    const stepIndex = Math.min(Math.floor(elapsed / 30), 5);
    document.getElementById('timer-step-indicator').textContent = `Step ${stepIndex + 1} of 6`;

    // Highlight active step
    document.querySelectorAll('.massage-step').forEach((el, i) => {
      el.classList.toggle('active', i === stepIndex);
    });
  }

  function startTimer() {
    if (timerState.running) return;
    timerState.running = true;
    const btn = document.getElementById('timer-toggle');
    btn.innerHTML = '<i class="fa-solid fa-pause" aria-hidden="true"></i> Pause';

    timerState.interval = setInterval(() => {
      if (timerState.remaining > 0) {
        timerState.remaining--;
        updateTimerDisplay();
      } else {
        stopTimer();
        showToast('3 minutes done! Great job, pre!', 'success');
        if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
      }
    }, 1000);
  }

  function pauseTimer() {
    timerState.running = false;
    clearInterval(timerState.interval);
    const btn = document.getElementById('timer-toggle');
    btn.innerHTML = '<i class="fa-solid fa-play" aria-hidden="true"></i> Resume';
  }

  function stopTimer() {
    timerState.running = false;
    clearInterval(timerState.interval);
    timerState.remaining = 0;
    const btn = document.getElementById('timer-toggle');
    btn.innerHTML = '<i class="fa-solid fa-play" aria-hidden="true"></i> Start';
    updateTimerDisplay();
  }

  function resetTimer() {
    timerState.running = false;
    clearInterval(timerState.interval);
    timerState.remaining = TIMER_TOTAL;
    const btn = document.getElementById('timer-toggle');
    btn.innerHTML = '<i class="fa-solid fa-play" aria-hidden="true"></i> Start';
    updateTimerDisplay();
  }

  /* ==========================================
     RENDER STATIC CONTENT
     ========================================== */
  function renderMassageSteps() {
    const container = document.getElementById('massage-steps');
    container.innerHTML = '';
    MASSAGE_STEPS.forEach((step, i) => {
      container.innerHTML += `
        <div class="massage-step ${i === 0 ? 'active' : ''}">
          <div class="step-num">${i + 1}</div>
          <div class="step-info">
            <h4>${step.title} <small style="color:var(--subtitle)">${step.time}</small></h4>
            <p>${step.desc}</p>
          </div>
        </div>`;
    });
  }

  function renderUnderEyeGuide() {
    const methods = document.getElementById('undereye-methods');
    methods.innerHTML = '';
    UNDER_EYE_METHODS.forEach(m => {
      methods.innerHTML += `
        <div class="method-card">
          <h4><i class="${m.icon}" aria-hidden="true"></i> ${m.title}</h4>
          <p>${m.desc}</p>
        </div>`;
    });

    const habits = document.getElementById('undereye-habits');
    habits.innerHTML = '';
    UNDER_EYE_HABITS.forEach(h => {
      habits.innerHTML += `
        <div class="habit-item"><i class="fa-solid fa-check" aria-hidden="true"></i> ${h}</div>`;
    });

    const avoid = document.getElementById('undereye-avoid');
    avoid.innerHTML = '';
    UNDER_EYE_AVOID.forEach(a => {
      avoid.innerHTML += `
        <div class="avoid-item"><i class="fa-solid fa-xmark" aria-hidden="true"></i> ${a}</div>`;
    });
  }

  function renderFoodGuide() {
    const avoid = document.getElementById('food-avoid');
    avoid.innerHTML = '';
    FOOD_AVOID.forEach(f => {
      avoid.innerHTML += `
        <div class="food-card avoid-card">
          <h4><i class="fa-solid fa-ban" aria-hidden="true"></i> ${f.title}</h4>
          <p>${f.items}</p>
        </div>`;
    });

    const eat = document.getElementById('food-eat');
    eat.innerHTML = '';
    FOOD_EAT.forEach(f => {
      eat.innerHTML += `
        <div class="food-card eat-card">
          <h4><i class="fa-solid fa-check" aria-hidden="true"></i> ${f.title}</h4>
          <p>${f.items}</p>
        </div>`;
    });
  }

  function renderNanayMode() {
    const container = document.getElementById('nanay-strategies');
    container.innerHTML = '';
    NANAY_STRATEGIES.forEach((s, i) => {
      let html = `
        <div class="strategy-card">
          <h4><span class="strategy-num">${i + 1}</span> ${s.title}</h4>
          <p>${s.desc}</p>`;
      if (s.dialogue) {
        html += `<div class="strategy-dialogue">${s.dialogue}</div>`;
      }
      html += '</div>';
      container.innerHTML += html;
    });
  }

  /* ==========================================
     SAMPLE DATA GENERATOR
     ========================================== */
  function generateSampleData() {
    if (Object.keys(appData.dailyLogs).length > 0) return; // Don't overwrite

    // Generate 7 days of sample data
    const sampleDays = [
      // 7 days ago: 6/6 complete
      { offset: -7, tasks: { water: true, massage: true, pillows: true, coldCompress: true, halfRice: true, potassium: true }, rice: { breakfast: 'half', lunch: 'half', dinner: 'half' }, water: 8, notes: 'Felt great today! Sabaw for lunch helped a lot.' },
      // 6 days ago: 5/6
      { offset: -6, tasks: { water: true, massage: true, pillows: true, coldCompress: true, halfRice: true, potassium: false }, rice: { breakfast: 'half', lunch: 'normal', dinner: 'half' }, water: 7, notes: 'Nanay made adobo, couldnt say no to normal rice for lunch.' },
      // 5 days ago: 4/6
      { offset: -5, tasks: { water: true, massage: false, pillows: true, coldCompress: true, halfRice: true, potassium: false }, rice: { breakfast: 'half', lunch: 'half', dinner: 'normal' }, water: 6, notes: 'Skipped massage, was late for school. Need to wake up earlier.' },
      // 4 days ago: 3/6
      { offset: -4, tasks: { water: false, massage: false, pillows: true, coldCompress: false, halfRice: true, potassium: false }, rice: { breakfast: 'normal', lunch: 'normal', dinner: 'half' }, water: 4, notes: 'Bad day. Birthday celebration, lots of rice. Tomorrow better.' },
      // 3 days ago: 5/6
      { offset: -3, tasks: { water: true, massage: true, pillows: true, coldCompress: true, halfRice: true, potassium: false }, rice: { breakfast: 'none', lunch: 'half', dinner: 'half' }, water: 8, notes: 'Bounced back! Did the nanay move, asked for extra sinigang broth.' },
      // 2 days ago: 6/6
      { offset: -2, tasks: { water: true, massage: true, pillows: true, coldCompress: true, halfRice: true, potassium: true }, rice: { breakfast: 'half', lunch: 'none', dinner: 'half' }, water: 9, notes: 'Crushing it! Face less puffy in the morning. Cold water splash is legit.' },
      // Yesterday: 5/6
      { offset: -1, tasks: { water: true, massage: false, pillows: true, coldCompress: true, halfRice: true, potassium: true }, rice: { breakfast: 'half', lunch: 'half', dinner: 'alt' }, water: 8, notes: 'Tinola for dinner with extra papaya. Jawline slightly visible.' }
    ];

    sampleDays.forEach(day => {
      const date = addDays(TODAY, day.offset);
      appData.dailyLogs[date] = {
        tasks: day.tasks,
        riceLog: day.rice,
        waterGlasses: day.water,
        notes: day.notes,
        mood: '',
        timestamp: new Date(date + 'T12:00:00').toISOString()
      };
    });

    // Set today as partially done (sample)
    appData.dailyLogs[TODAY] = {
      tasks: { water: true, massage: false, pillows: false, coldCompress: true, halfRice: false, potassium: false },
      riceLog: { breakfast: 'half', lunch: null, dinner: null },
      waterGlasses: 3,
      notes: 'Just started the day. Morning routine done!',
      mood: 'good',
      timestamp: new Date().toISOString()
    };

    // Set up weight history
    appData.weightHistory = [
      { date: addDays(TODAY, -7), weight: 61 },
      { date: addDays(TODAY, -5), weight: 60.5 },
      { date: addDays(TODAY, -3), weight: 60.2 },
      { date: addDays(TODAY, -1), weight: 60 },
      { date: TODAY, weight: 59.8 }
    ];

    calculateStreak();
    saveData();
  }

  /* ==========================================
     EVENT BINDING
     ========================================== */
  function bindEvents() {
    // Bottom navigation
    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.addEventListener('click', () => {
        if (navigator.vibrate) navigator.vibrate(5);
        switchScreen(btn.dataset.screen);
      });
    });

    // Settings from home
    document.getElementById('btn-settings-home').addEventListener('click', () => switchScreen('settings'));

    // Mark all complete
    document.getElementById('btn-mark-all').addEventListener('click', () => {
      const log = getLog(TODAY);
      const allDone = isAllComplete(log);
      if (!allDone) {
        Object.keys(log.tasks).forEach(k => { log.tasks[k] = true; });
        saveLog(TODAY, log);
        updateStreak();
        badgeChecker();
        renderHome();
        showToast('All tasks marked complete!', 'success');
        if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
      } else {
        // Unmark all
        Object.keys(log.tasks).forEach(k => { log.tasks[k] = false; });
        saveLog(TODAY, log);
        updateStreak();
        renderHome();
        showToast('All tasks unchecked', 'info');
      }
    });

    // Reset today
    document.getElementById('btn-reset-today').addEventListener('click', () => {
      showConfirm(
        'Reset Today?',
        'This will uncheck all tasks for today. Your streak will be affected.',
        () => {
          saveLog(TODAY, defaultDayLog());
          updateStreak();
          renderHome();
          showToast('Today has been reset', 'warning');
        },
        'Reset'
      );
    });

    // Rice buttons
    document.querySelectorAll('.rice-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const meal = btn.closest('.rice-options').dataset.meal;
        const value = btn.dataset.value;
        const log = getLog(TODAY);

        // Toggle off if same value selected
        if (log.riceLog[meal] === value) {
          log.riceLog[meal] = null;
        } else {
          log.riceLog[meal] = value;
        }
        saveLog(TODAY, log);
        renderRiceLog(log);
        if (navigator.vibrate) navigator.vibrate(10);
      });
    });

    // Notes auto-save
    const notesSave = debounce(() => {
      const log = getLog(TODAY);
      log.notes = document.getElementById('daily-notes').value;
      log.timestamp = new Date().toISOString();
      saveLog(TODAY, log);
      document.getElementById('notes-timestamp').textContent =
        `Last saved: ${new Date().toLocaleTimeString()}`;
    }, 500);
    document.getElementById('daily-notes').addEventListener('input', notesSave);

    // Calendar nav
    document.getElementById('cal-prev').addEventListener('click', () => {
      calMonth--;
      if (calMonth < 0) { calMonth = 11; calYear--; }
      renderCalendar();
    });
    document.getElementById('cal-next').addEventListener('click', () => {
      calMonth++;
      if (calMonth > 11) { calMonth = 0; calYear++; }
      renderCalendar();
    });

    // Day detail back
    document.getElementById('day-detail-back').addEventListener('click', () => {
      document.getElementById('day-detail').style.display = 'none';
    });

    // Timer
    document.getElementById('timer-toggle').addEventListener('click', () => {
      if (timerState.remaining <= 0) return;
      if (timerState.running) pauseTimer();
      else startTimer();
    });
    document.getElementById('timer-reset').addEventListener('click', resetTimer);
    document.getElementById('timer-sound').addEventListener('click', () => {
      timerState.soundOn = !timerState.soundOn;
      const icon = document.querySelector('#timer-sound i');
      icon.className = timerState.soundOn ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
    });

    // Food guide tabs
    document.querySelectorAll('.food-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.food-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tab = btn.dataset.foodTab;
        document.getElementById('food-avoid').style.display = tab === 'avoid' ? 'block' : 'none';
        document.getElementById('food-eat').style.display = tab === 'eat' ? 'block' : 'none';
      });
    });

    // Massage/Under-eye tabs
    document.querySelectorAll('.tab[data-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab[data-tab]').forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        document.querySelectorAll('.tab-content').forEach(c => { c.style.display = 'none'; c.classList.remove('active'); });
        const target = document.getElementById(btn.dataset.tab);
        if (target) { target.style.display = 'block'; target.classList.add('active'); }
      });
    });

    // Settings inputs - auto-save
    ['set-name', 'set-age', 'set-weight', 'set-start-weight', 'set-font-size'].forEach(id => {
      document.getElementById(id).addEventListener('change', saveSettings);
    });
    ['notif-morning', 'notif-water', 'notif-lunch', 'notif-merienda', 'notif-dinner', 'notif-sleep'].forEach(id => {
      document.getElementById(id).addEventListener('change', saveSettings);
    });

    // Font size
    document.getElementById('set-font-size').addEventListener('change', () => {
      const size = document.getElementById('set-font-size').value;
      document.body.className = `font-${size}`;
    });

    // Export data
    document.getElementById('btn-export-data').addEventListener('click', () => {
      const blob = new Blob([JSON.stringify(appData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `debulat-pinoy-${TODAY}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Data exported! Check your downloads.', 'success');
    });

    // Clear data
    document.getElementById('btn-clear-data').addEventListener('click', () => {
      showConfirm(
        'Clear All Data?',
        'This will delete ALL your logs, streaks, and badges. This cannot be undone!',
        () => {
          localStorage.removeItem(STORAGE_KEY);
          appData = defaultData();
          saveData();
          renderSettings();
          showToast('All data cleared', 'warning');
          switchScreen('home');
        },
        'Delete Everything'
      );
    });

    // Weight save
    document.getElementById('weight-save').addEventListener('click', () => {
      const weight = parseFloat(document.getElementById('weight-input').value);
      if (!weight || weight < 30 || weight > 200) {
        showToast('Enter a valid weight (30-200 kg)', 'error');
        return;
      }
      appData.user.currentWeight = weight;

      // Add or update today's entry
      const existing = appData.weightHistory.findIndex(e => e.date === TODAY);
      if (existing >= 0) {
        appData.weightHistory[existing].weight = weight;
      } else {
        appData.weightHistory.push({ date: TODAY, weight });
      }
      appData.weightHistory.sort((a, b) => a.date.localeCompare(b.date));

      saveData();
      renderWeightChart();
      document.getElementById('weight-input').value = '';
      showToast(`Weight saved: ${weight} kg`, 'success');
      if (navigator.vibrate) navigator.vibrate(10);
    });

    // Skip day (from notes area or emergency)
    // Not adding a separate button since Reset Today covers it
  }

  /* ==========================================
     WELCOME SCREEN
     ========================================== */
  function showWelcome() {
    document.getElementById('screen-welcome').style.display = 'block';
    document.getElementById('app').style.display = 'none';

    document.getElementById('welcome-start').addEventListener('click', () => {
      const name = document.getElementById('welcome-name').value.trim();
      if (!name) {
        showToast('Enter your name first, pre!', 'error');
        document.getElementById('welcome-name').focus();
        return;
      }

      appData.user.name = name;
      appData.user.age = parseInt(document.getElementById('welcome-age').value) || 15;
      appData.user.currentWeight = parseInt(document.getElementById('welcome-weight').value) || 60;
      appData.user.startWeight = parseInt(document.getElementById('welcome-start-weight').value) || 90;
      appData.user.startDate = TODAY;

      saveData();

      document.getElementById('screen-welcome').style.display = 'none';
      document.getElementById('app').style.display = 'block';

      showToast(`Welcome, ${name}! Let's start debloating!`, 'success');
      switchScreen('home');
    });
  }

  /* ==========================================
     INITIALIZATION
     ========================================== */
  function init() {
    // Load data
    const hasData = loadData();

    // Generate sample data if first time (for demo)
    generateSampleData();

    // Apply font size
    document.body.className = `font-${appData.settings.fontSize || 'medium'}`;

    if (!hasData || !appData.user.startDate) {
      // First time user
      showWelcome();
    } else {
      // Returning user
      document.getElementById('app').style.display = 'block';

      // Bind all events
      bindEvents();

      // Render static content
      renderMassageSteps();
      renderUnderEyeGuide();
      renderFoodGuide();
      renderNanayMode();

      // Initialize timer display
      updateTimerDisplay();

      // Initialize calendar
      initCalendar();

      // Render home
      switchScreen('home');
    }
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
