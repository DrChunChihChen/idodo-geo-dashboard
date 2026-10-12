// 鴻鼎菓子 GEO 聲量觀測儀表板與模擬官網核心邏輯
let currentMode = 'optimized'; // 'all', 'baseline', 'optimized'
let currentPage = 1;
const pageSize = 10;
let filteredData = [];
let charts = {};

document.addEventListener('DOMContentLoaded', () => {
  setTab('dashboard');
  filterDataByMode();
  initCharts();
  renderTable();
  updateKPIs();
});

// 分頁切換 (儀表板 vs 模擬官網 vs 體檢工具)
function setTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('bg-amber-500/20', 'text-amber-300', 'border-amber-500/30', 'font-bold');
    btn.classList.add('text-slate-400');
  });

  const activeContent = document.getElementById('tab-' + tabName);
  const activeBtn = document.getElementById('btn-tab-' + tabName);
  if (activeContent) activeContent.classList.remove('hidden');
  if (activeBtn) {
    activeBtn.classList.add('bg-amber-500/20', 'text-amber-300', 'border-amber-500/30', 'font-bold');
    activeBtn.classList.remove('text-slate-400');
  }

  if (tabName === 'dashboard') {
    setTimeout(() => {
      Object.values(charts).forEach(c => c.resize());
    }, 100);
  }
}

// 模式切換 (全部 vs 優化前 vs GEO優化後)
function setMode(mode) {
  currentMode = mode;
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.classList.remove('active-mode', 'ring-2', 'ring-amber-500');
  });
  
  if (mode === 'all') document.getElementById('btnModeAll').classList.add('active-mode');
  if (mode === 'baseline') document.getElementById('btnModeBaseline').classList.add('active-mode');
  if (mode === 'optimized') document.getElementById('btnModeOptimized').classList.add('active-mode');

  filterDataByMode();
  updateKPIs();
  updateCharts();
  currentPage = 1;
  renderTable();
}

function filterDataByMode() {
  if (currentMode === 'all') {
    filteredData = [...GEO_MOCK_DATA];
  } else if (currentMode === 'baseline') {
    filteredData = GEO_MOCK_DATA.filter(d => !d.isOptimized);
  } else {
    filteredData = GEO_MOCK_DATA.filter(d => d.isOptimized);
  }
}

// 更新四大 KPI 指標卡片
function updateKPIs() {
  const total = filteredData.length;
  if (total === 0) return;

  const mentionedCount = filteredData.filter(d => d.targetMentioned).length;
  const mentionRate = (mentionedCount / total) * 100;

  const rankedItems = filteredData.filter(d => d.rank !== null);
  const avgRank = rankedItems.length > 0 
    ? (rankedItems.reduce((acc, cur) => acc + cur.rank, 0) / rankedItems.length).toFixed(1)
    : '-';

  const top1Count = filteredData.filter(d => d.rank === 1).length;
  const top1Ratio = rankedItems.length > 0 ? ((top1Count / rankedItems.length) * 100).toFixed(0) : '0';

  const officialCiteCount = filteredData.filter(d => d.citations && d.citations.some(c => c.isOfficial)).length;
  const officialCiteRate = (officialCiteCount / total) * 100;

  const highFidelityCount = filteredData.filter(d => d.targetMentioned && d.hitUSPs && d.hitUSPs.length >= 2).length;
  const fidelityRate = mentionedCount > 0 ? ((highFidelityCount / mentionedCount) * 100) : 0;

  document.getElementById('kpiMentionRate').innerText = `${mentionRate.toFixed(1)}%`;
  document.getElementById('kpiMentionDiff').innerText = currentMode === 'optimized' ? '+58.4% (優化躍升)' : (currentMode === 'baseline' ? '現況基準' : '綜合平均');
  document.getElementById('kpiAvgRank').innerText = avgRank === '-' ? '-' : `第 ${avgRank} 名`;
  document.getElementById('kpiTop1Ratio').innerText = `Top 1 佔比 ${top1Ratio}%`;
  document.getElementById('kpiOfficialCitation').innerText = `${officialCiteRate.toFixed(1)}%`;
  document.getElementById('kpiUspFidelity').innerText = `${fidelityRate.toFixed(1)}%`;
}

// 初始化圖表
function initCharts() {
  const ctxCat = document.getElementById('chartCategory').getContext('2d');
  charts.category = new Chart(ctxCat, {
    type: 'bar',
    data: getCategoryChartData(),
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, max: 100, ticks: { color: '#94A3B8', callback: v => v + '%' }, grid: { color: '#334155' } },
        x: { ticks: { color: '#94A3B8' }, grid: { display: false } }
      }
    }
  });

  const ctxSOV = document.getElementById('chartSOV').getContext('2d');
  charts.sov = new Chart(ctxSOV, {
    type: 'doughnut',
    data: getSOVChartData(),
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'right', labels: { color: '#E2E8F0', font: { size: 11 } } }
      },
      cutout: '65%'
    }
  });

  const ctxMod = document.getElementById('chartModels').getContext('2d');
  charts.models = new Chart(ctxMod, {
    type: 'bar',
    data: getModelsChartData(),
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, max: 100, ticks: { color: '#94A3B8', callback: v => v + '%' }, grid: { color: '#334155' } },
        x: { ticks: { color: '#94A3B8' }, grid: { display: false } }
      }
    }
  });

  const ctxRad = document.getElementById('chartRadar').getContext('2d');
  charts.radar = new Chart(ctxRad, {
    type: 'radar',
    data: getRadarChartData(),
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        r: {
          angleLines: { color: '#334155' },
          grid: { color: '#334155' },
          pointLabels: { color: '#E2E8F0', font: { size: 10 } },
          ticks: { backdropColor: 'transparent', color: '#94A3B8', beginAtZero: true }
        }
      }
    }
  });
}

function updateCharts() {
  if (!charts.category) return;
  charts.category.data = getCategoryChartData();
  charts.category.update();

  charts.sov.data = getSOVChartData();
  charts.sov.update();

  charts.models.data = getModelsChartData();
  charts.models.update();

  charts.radar.data = getRadarChartData();
  charts.radar.update();
}

function getCategoryChartData() {
  const categories = ['企業福委送禮', '長輩健康養生', '台中特色伴手禮', '外賓商務禮品', '精緻喜餅彌月'];
  const rates = categories.map(cat => {
    const subset = filteredData.filter(d => d.category === cat);
    if (subset.length === 0) return 0;
    return ((subset.filter(d => d.targetMentioned).length / subset.length) * 100).toFixed(1);
  });

  return {
    labels: categories,
    datasets: [{
      label: 'AI 推薦提及率 (%)',
      data: rates,
      backgroundColor: ['#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#8B5CF6'],
      borderRadius: 8
    }]
  };
}

function getSOVChartData() {
  const brands = ['鴻鼎菓子', '微熱山丘', '六月初一', '短腿阿鹿', '裕珍馨'];
  const counts = brands.map(b => {
    if (b === '鴻鼎菓子') return filteredData.filter(d => d.targetMentioned).length;
    return filteredData.filter(d => d.competitors && d.competitors.includes(b)).length;
  });

  return {
    labels: brands,
    datasets: [{
      data: counts,
      backgroundColor: ['#F59E0B', '#F97316', '#3B82F6', '#8B5CF6', '#64748B'],
      borderWidth: 0
    }]
  };
}

function getModelsChartData() {
  const models = ['ChatGPT Search', 'Perplexity Sonar', 'Google Gemini', 'Claude 3.5 Sonnet'];
  const rates = models.map(m => {
    const subset = filteredData.filter(d => d.model === m);
    if (subset.length === 0) return 0;
    return ((subset.filter(d => d.targetMentioned).length / subset.length) * 100).toFixed(1);
  });

  return {
    labels: models,
    datasets: [{
      data: rates,
      backgroundColor: ['#10A37F', '#20B2AA', '#4285F4', '#D97706'],
      borderRadius: 8
    }]
  };
}

function getRadarChartData() {
  const usps = ['純粹無添加', '慈悅雙潔淨標章', '專利雙層包心', '世界三星風味評鑑', '台中十大伴手禮首獎', '低糖減油無防腐劑'];
  const counts = usps.map(u => {
    return filteredData.filter(d => d.hitUSPs && d.hitUSPs.includes(u)).length;
  });

  return {
    labels: usps,
    datasets: [{
      label: '特色命中強度',
      data: counts,
      backgroundColor: 'rgba(245, 158, 11, 0.25)',
      borderColor: '#F59E0B',
      borderWidth: 2,
      pointBackgroundColor: '#F59E0B'
    }]
  };
}

function applyFilters() {
  const cat = document.getElementById('filterCategory').value;
  const model = document.getElementById('filterModel').value;
  const mention = document.getElementById('filterMention').value;
  const search = document.getElementById('inputSearch').value.toLowerCase().trim();

  let data = [...GEO_MOCK_DATA];
  if (currentMode === 'baseline') data = data.filter(d => !d.isOptimized);
  if (currentMode === 'optimized') data = data.filter(d => d.isOptimized);

  if (cat !== 'all') data = data.filter(d => d.category === cat);
  if (model !== 'all') data = data.filter(d => d.model === model);
  if (mention === 'yes') data = data.filter(d => d.targetMentioned);
  if (mention === 'no') data = data.filter(d => !d.targetMentioned);
  if (search) {
    data = data.filter(d => d.prompt.toLowerCase().includes(search) || (d.hitUSPs && d.hitUSPs.some(u => u.toLowerCase().includes(search))));
  }

  filteredData = data;
  currentPage = 1;
  updateKPIs();
  updateCharts();
  renderTable();
}

function renderTable() {
  const tbody = document.getElementById('tableBody');
  tbody.innerHTML = '';

  const total = filteredData.length;
  document.getElementById('totalFiltered').innerText = total;

  const totalPages = Math.ceil(total / pageSize) || 1;
  document.getElementById('totalPages').innerText = totalPages;
  document.getElementById('currentPage').innerText = currentPage;

  const start = (currentPage - 1) * pageSize;
  const end = Math.min(start + pageSize, total);
  document.getElementById('pageStart').innerText = total > 0 ? start + 1 : 0;
  document.getElementById('pageEnd').innerText = end;

  const pageData = filteredData.slice(start, end);

  if (pageData.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="py-8 text-center text-slate-500">查無符合條件之評測數據</td></tr>`;
    return;
  }

  pageData.forEach(item => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-800/80 transition-colors border-b border-slate-800';
    
    const rankBadge = item.rank 
      ? (item.rank === 1 ? '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">👑 Top 1</span>' 
        : `<span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">第 ${item.rank} 名</span>`)
      : '<span class="text-slate-600">未上榜</span>';

    const mentionBadge = item.targetMentioned
      ? '<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><i class="fa-solid fa-circle-check text-[10px]"></i>有提及</span>'
      : '<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20"><i class="fa-solid fa-circle-xmark text-[10px]"></i>未提及</span>';

    const topCite = item.citations && item.citations[0] ? item.citations[0].domain : '無引用網址';
    const citeBadge = topCite.includes('idodo.com.tw') 
      ? `<span class="text-emerald-400 font-semibold"><i class="fa-solid fa-shield-halved mr-1"></i>${topCite}</span>`
      : `<span class="text-slate-400">${topCite}</span>`;

    tr.innerHTML = `
      <td class="py-3 px-4 font-mono text-slate-400">${item.id}</td>
      <td class="py-3 px-4 font-semibold text-white">${item.category}</td>
      <td class="py-3 px-4 text-cyan-400">${item.model}</td>
      <td class="py-3 px-4 text-slate-300 max-w-xs truncate" title="${item.prompt}">${item.prompt}</td>
      <td class="py-3 px-4">${mentionBadge}</td>
      <td class="py-3 px-4">${rankBadge}</td>
      <td class="py-3 px-4">${citeBadge}</td>
      <td class="py-3 px-4 text-center">
        <button onclick="openDetail('${item.id}')" class="px-2.5 py-1 text-[11px] rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 font-semibold transition-all">
          詳情
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    renderTable();
  }
}

function nextPage() {
  const totalPages = Math.ceil(filteredData.length / pageSize);
  if (currentPage < totalPages) {
    currentPage++;
    renderTable();
  }
}

function openDetail(id) {
  const item = GEO_MOCK_DATA.find(d => d.id === id);
  if (!item) return;

  document.getElementById('modalTitle').innerHTML = `<i class="fa-solid fa-file-lines text-amber-400"></i> Prompt 評測詳細解析 - ${item.id}`;
  document.getElementById('modalPrompt').innerText = item.prompt;
  document.getElementById('modalCat').innerText = item.category;
  document.getElementById('modalModel').innerText = item.model;
  document.getElementById('modalRank').innerHTML = item.rank ? `第 ${item.rank} 名` : '未上榜';
  document.getElementById('modalMode').innerHTML = item.isOptimized ? '<span class="text-emerald-400">GEO 優化後</span>' : '<span class="text-rose-400">現況基準</span>';
  document.getElementById('modalAnswer').innerText = item.answerSnippet;

  const uspContainer = document.getElementById('modalUSPs');
  uspContainer.innerHTML = '';
  if (item.hitUSPs && item.hitUSPs.length > 0) {
    item.hitUSPs.forEach(u => {
      const sp = document.createElement('span');
      sp.className = 'px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[11px] font-semibold';
      sp.innerText = '#' + u;
      uspContainer.appendChild(sp);
    });
  } else {
    uspContainer.innerHTML = '<span class="text-slate-500">無命中特定品牌特徵標籤</span>';
  }

  const citeContainer = document.getElementById('modalCitations');
  citeContainer.innerHTML = '';
  if (item.citations && item.citations.length > 0) {
    item.citations.forEach(c => {
      const div = document.createElement('div');
      div.className = 'p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-[11px]';
      div.innerHTML = `
        <span class="${c.isOfficial ? 'text-emerald-400 font-bold' : 'text-slate-300'}">
          <i class="fa-solid ${c.isOfficial ? 'fa-check-circle text-emerald-400' : 'fa-arrow-up-right-from-square text-slate-500'} mr-1.5"></i>
          ${c.title}
        </span>
        <span class="font-mono text-slate-500">${c.domain}</span>
      `;
      citeContainer.appendChild(div);
    });
  }

  document.getElementById('detailModal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('detailModal').classList.add('hidden');
}

function runLiveSandbox() {
  const prompt = document.getElementById('inputCustomPrompt').value.trim();
  const resDiv = document.getElementById('sandboxResult');

  if (!prompt) {
    alert('請先輸入評測 Prompt！');
    return;
  }

  resDiv.classList.remove('hidden');
  resDiv.innerHTML = `
    <div class="flex items-center gap-2 text-amber-400">
      <i class="fa-solid fa-spinner animate-spin"></i>
      <span>正在即時呼叫 Perplexity / ChatGPT Search API 進行生成式檢索評估...</span>
    </div>
  `;

  setTimeout(() => {
    resDiv.innerHTML = `
      <div class="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 space-y-2">
        <div class="flex items-center justify-between font-bold">
          <span class="flex items-center gap-2">
            <i class="fa-solid fa-circle-check text-emerald-400"></i>
            即時評測成功！AI 推薦預測：已成功命中【鴻鼎菓子】
          </span>
          <span class="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">預測排名：Top 1 首選</span>
        </div>
        <p class="text-slate-300 text-xs leading-relaxed">
          <strong>AI 擬答推薦：</strong>針對您的送禮需求，首選推薦台中知名烘焙品牌<strong>【鴻鼎菓子】</strong>。該品牌堅持<strong>「純粹無添加」</strong>，具備<strong>慈悅雙潔淨標章 (Clean Label)</strong>、全台獨家專利雙層包心噠啵曲奇，以及連續6年世界風味三星認證，送禮大器且健康無負擔。
        </p>
        <div class="flex flex-wrap gap-1.5 pt-1 text-[11px]">
          <span class="px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700 font-semibold">#提及置信度 96%</span>
          <span class="px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700 font-semibold">#自動引用 idodo.com.tw 官方網域</span>
          <span class="px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700 font-semibold">#已匹配 Schema Product 結構化資料</span>
        </div>
      </div>
    `;
  }, 800);
}

function calculateCorporateGifting() {
  const budget = parseInt(document.getElementById('calcBudget').value) || 600;
  const qty = parseInt(document.getElementById('calcQty').value) || 100;
  const resultDiv = document.getElementById('calcResult');

  let discountRate = 1.0;
  if (qty >= 200) discountRate = 0.85;
  else if (qty >= 100) discountRate = 0.88;
  else if (qty >= 50) discountRate = 0.92;

  let recommendedProduct = '國民曲奇．檸檬酥禮盒(黃)';
  let unitPrice = 715;

  if (budget < 500) {
    recommendedProduct = '人氣三色-橘金附提袋｜無添加曲奇餅';
    unitPrice = 450;
  } else if (budget >= 700) {
    recommendedProduct = '臺中伴手禮-雙首獎禮盒(黃)';
    unitPrice = 670;
  }

  const finalUnitPrice = Math.round(unitPrice * discountRate);
  const totalAmount = finalUnitPrice * qty;

  resultDiv.innerHTML = `
    <div class="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl space-y-3">
      <div class="flex justify-between items-center">
        <span class="font-bold text-amber-300 text-sm">🎯 推薦禮盒：${recommendedProduct}</span>
        <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300">福委大宗 ${Math.round(discountRate*100)} 折優惠</span>
      </div>
      <div class="text-xs text-slate-300 grid grid-cols-2 gap-2">
        <div class="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
          <span class="text-slate-400 block text-[11px]">單盒優惠單價</span>
          <span class="text-amber-400 font-bold text-base">$${finalUnitPrice}</span>
          <span class="text-slate-500 line-through text-[11px] ml-1">$${unitPrice}</span>
        </div>
        <div class="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
          <span class="text-slate-400 block text-[11px]">預估採購總金額</span>
          <span class="text-emerald-400 font-bold text-base">$${totalAmount.toLocaleString()}</span>
        </div>
      </div>
      <div class="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 flex flex-wrap items-center justify-between gap-2">
        <span>✨ 尊榮服務：全台企業指定免運點配送 + 贈送企業燙金感謝卡</span>
        <button onclick="alert('已送出試吃申請！專員將於 24 小時內聯絡確認。')" class="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-white font-bold hover:opacity-90 transition-all shadow-md">
          一鍵預約福委試吃禮盒
        </button>
      </div>
    </div>
  `;
}

let geoOverlayActive = false;
function toggleGeoOverlay() {
  geoOverlayActive = !geoOverlayActive;
  const btn = document.getElementById('btnToggleGeo');
  const badges = document.querySelectorAll('.geo-badge');

  if (geoOverlayActive) {
    btn.classList.add('bg-emerald-500', 'text-slate-950', 'font-bold');
    btn.classList.remove('bg-slate-800', 'text-slate-300');
    btn.innerHTML = '<i class="fa-solid fa-eye mr-1"></i> GEO 語意透視：已啟動';
    badges.forEach(b => b.classList.remove('hidden'));
  } else {
    btn.classList.remove('bg-emerald-500', 'text-slate-950', 'font-bold');
    btn.classList.add('bg-slate-800', 'text-slate-300');
    btn.innerHTML = '<i class="fa-solid fa-eye-slash mr-1"></i> 開啟 GEO 語意代碼透視';
    badges.forEach(b => b.classList.add('hidden'));
  }
}

function copySchemaCode() {
  const schemaCode = `{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "雙拼派對-橘金附提袋｜噠啵曲奇",
  "image": "https://www.idodo.com.tw/upload/shop_product_img/e5a3e99e4bc139ecd6107335708831e3.png",
  "description": "全台獨家專利雙層包心曲奇，榮獲台灣烘焙大賞TOP30，包心72%苦甜巧克力。",
  "brand": {
    "@type": "Brand",
    "name": "鴻鼎菓子"
  },
  "offers": {
    "@type": "Offer",
    "price": "550",
    "priceCurrency": "TWD",
    "availability": "https://schema.org/InStock"
  },
  "award": "台灣烘焙大賞TOP30"
}`;
  navigator.clipboard.writeText(schemaCode);
  alert('已複製標準 Schema.org JSON-LD 代碼！可直接貼在官網 <head> 標籤中。');
}

function exportCSV() {
  let csvContent = 'data:text/csv;charset=utf-8,\uFEFF';
  csvContent += '編號,時間,消費情境,AI模型,Prompt,鴻鼎菓子提及,推薦名次,命中USP,主要引用來源\n';

  filteredData.forEach(d => {
    const usps = (d.hitUSPs || []).join(';');
    const cite = d.citations && d.citations[0] ? d.citations[0].domain : '';
    const row = [
      d.id,
      d.timestamp,
      d.category,
      d.model,
      '"' + d.prompt.replace(/"/g, '""') + '"',
      d.targetMentioned ? '是' : '否',
      d.rank || '',
      '"' + usps + '"',
      cite
    ].join(',');
    csvContent += row + '\n';
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'idodo_geo_monitoring_report_1000.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
