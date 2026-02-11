// Main App Logic for TBO GLOBAL Prototype

document.addEventListener('DOMContentLoaded', () => {
    console.log("App initialized");

    // Check if data loaded
    if (typeof EXCEL_DATA === 'undefined') {
        console.error("EXCEL_DATA not loaded. Run the Python script first.");
        document.getElementById('main-content').innerHTML = `
            <div class="flex items-center justify-center h-full text-slate-400">
                <div class="text-center">
                    <i data-lucide="database-zap" class="w-12 h-12 mx-auto mb-3 opacity-50"></i>
                    <p>Aucune donnée chargée.</p>
                </div>
            </div>`;
        return;
    }

    const sheetNames = Object.keys(EXCEL_DATA);
    let activeSheet = null; // null maps to Dashboard Home/Overview

    // DOM Elements
    const sidebarNav = document.getElementById('sidebar-nav');
    const mainContent = document.getElementById('main-content');
    const pageTitle = document.getElementById('page-title');
    const pageSubtitle = document.getElementById('page-subtitle');
    const currentDateEl = document.getElementById('current-date');

    // Date setup
    const now = new Date();
    currentDateEl.textContent = now.toLocaleDateString('fr-FR');

    function renderSidebar() {
        sidebarNav.innerHTML = '';

        // Dashboard / Home Link
        const homeBtn = document.createElement('button');
        homeBtn.className = `sidebar-link w-full text-left px-4 py-3 text-sm flex items-center gap-3 rounded-r-full mr-2 ${activeSheet === null ? 'active' : 'text-slate-400'}`;
        homeBtn.innerHTML = `
            <i data-lucide="layout-dashboard" class="w-4 h-4"></i>
            <span>Vue d'ensemble</span>
        `;
        homeBtn.onclick = () => loadSheet(null);
        sidebarNav.appendChild(homeBtn);

        // Divider
        const divider = document.createElement('div');
        divider.className = "px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mt-4";
        divider.textContent = "Feuilles Excel";
        sidebarNav.appendChild(divider);

        // Sheets
        sheetNames.forEach(name => {
            const btn = document.createElement('button');
            const isActive = activeSheet === name;
            btn.className = `sidebar-link w-full text-left px-4 py-3 text-sm flex items-center gap-3 rounded-r-full mr-2 ${isActive ? 'active' : 'text-slate-400'}`;
            // Different icons based on name heuristics?
            let icon = 'table-2';
            if (name.toLowerCase().includes('graph')) icon = 'bar-chart-2';
            if (name.toLowerCase().includes('hebdo')) icon = 'calendar-clock';
            if (name.toLowerCase().includes('mois') || name.toLowerCase().includes('mensuel')) icon = 'calendar';

            btn.innerHTML = `
                <i data-lucide="${icon}" class="w-4 h-4"></i>
                <span class="truncate">${name}</span>
            `;
            btn.onclick = () => loadSheet(name);
            sidebarNav.appendChild(btn);
        });

        lucide.createIcons();
    }

    function loadSheet(name) {
        activeSheet = name;
        renderSidebar(); // Update active state

        if (name === null) {
            renderOverview();
        } else {
            renderSheetDetail(name);
        }
    }

    function renderOverview() {
        pageTitle.textContent = "Vue d'ensemble";
        pageSubtitle.textContent = "Dashboard global consolidé";

        // Calculate some global stats
        const totalSheets = sheetNames.length;
        const totalRows = sheetNames.reduce((acc, name) => acc + (EXCEL_DATA[name].rowCount || 0), 0);

        mainContent.innerHTML = `
            <div class="animate-fade-in space-y-6">
                <!-- Welcome Banner -->
                <div class="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                    <div class="relative z-10">
                        <h2 class="text-3xl font-bold mb-2">Bonjour, Admin</h2>
                        <p class="text-blue-100 max-w-2xl">Voici un aperçu en temps réel de votre production basé sur l'extraction des données Excel. Vous avez <strong>${totalSheets}</strong> feuilles actives totalisant <strong>${totalRows}</strong> lignes de données.</p>
                        <button class="mt-6 bg-white text-blue-700 px-5 py-2 rounded-lg font-semibold text-sm hover:bg-blue-50 transition-colors shadow-sm" onclick="loadSheet('${sheetNames[0]}')">
                            Explorer les données
                        </button>
                    </div>
                    <!-- Decor -->
                    <div class="absolute right-0 top-0 h-full w-1/3 bg-white/10 skew-x-12 transform translate-x-10"></div>
                </div>

                <!-- Stats Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    ${renderStatCard('Total Feuilles', totalSheets, 'files', 'bg-blue-50 text-blue-600')}
                    ${renderStatCard('Total Lignes', totalRows.toLocaleString(), 'list', 'bg-emerald-50 text-emerald-600')}
                    ${renderStatCard('Dernière MàJ', new Date().toLocaleTimeString(), 'clock', 'bg-purple-50 text-purple-600')}
                    ${renderStatCard('Statut Système', 'Opérationnel', 'activity', 'bg-amber-50 text-amber-600')}
                </div>

                <!-- Quick Access / Recent Sheets -->
                <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <i data-lucide="history" class="w-5 h-5 text-slate-400"></i>
                        Accès Rapide
                    </h3>
                    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        ${sheetNames.slice(0, 8).map(name => `
                            <button onclick="loadSheet('${name}')" class="p-4 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-all text-left group">
                                <div class="font-medium text-slate-700 group-hover:text-blue-700 truncate">${name}</div>
                                <div class="text-xs text-slate-400 mt-1">${EXCEL_DATA[name].rowCount} lignes</div>
                            </button>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        // Expose loadSheet to window scope for onclicks in HTML strings
        window.loadSheet = loadSheet;
        lucide.createIcons();
    }

    function renderStatCard(label, value, icon, colorClass) {
        return `
            <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-start justify-between hover:shadow-md transition-shadow">
                <div>
                    <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">${label}</p>
                    <h3 class="text-2xl font-bold text-slate-800">${value}</h3>
                </div>
                <div class="p-3 rounded-lg ${colorClass}">
                    <i data-lucide="${icon}" class="w-5 h-5"></i>
                </div>
            </div>
        `;
    }

    function renderSheetDetail(currentSheet) {
        const data = EXCEL_DATA[currentSheet];
        pageTitle.textContent = currentSheet;
        pageSubtitle.textContent = `Données détaillées : ${data.rowCount} entrées`;

        // KPIs specific for sheet (mockup logic)
        // Try to find a 'Total' column? 
        let kpiview = '';
        if (data.rows.length > 0) {
            kpiview = `
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                     <!-- Generic KPIs for demo -->
                    <div class="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                        <div class="flex items-center gap-3 mb-2">
                            <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                <i data-lucide="database" class="w-4 h-4"></i>
                            </div>
                            <h4 class="text-sm font-semibold text-slate-600">Volume de données</h4>
                        </div>
                        <p class="text-2xl font-bold text-slate-800">${data.rowCount}</p>
                    </div>
                     <!-- Add Chart Placeholder -->
                    <div class="bg-white p-5 rounded-xl shadow-sm border border-slate-200 md:col-span-2 flex items-center justify-center relative overflow-hidden">
                        <p class="text-slate-400 text-sm absolute top-4 left-4">Distribution (Aperçu)</p>
                         <!-- Fake Chart Bars -->
                        <div class="flex items-end gap-2 h-12 w-full px-8 opacity-50">
                             <div class="w-full bg-blue-500 rounded-t-sm" style="height: 40%"></div>
                             <div class="w-full bg-blue-400 rounded-t-sm" style="height: 70%"></div>
                             <div class="w-full bg-blue-600 rounded-t-sm" style="height: 50%"></div>
                             <div class="w-full bg-indigo-500 rounded-t-sm" style="height: 80%"></div>
                             <div class="w-full bg-purple-500 rounded-t-sm" style="height: 30%"></div>
                        </div>
                    </div>
                </div>
             `;
        }

        // Table Header
        let tableHeaderHTML = `
            ${kpiview}
            
            <div class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-[calc(100vh-280px)]">
                <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white z-20">
                    <div class="flex items-center gap-2">
                        <i data-lucide="table" class="w-4 h-4 text-slate-400"></i>
                        <h3 class="text-sm font-bold text-slate-700 uppercase tracking-wide">Tableau de données</h3>
                    </div>
                    <div class="flex gap-2">
                        <button class="text-slate-500 hover:text-blue-600 p-1.5 hover:bg-blue-50 rounded-lg transition-colors" title="Filtrer">
                            <i data-lucide="filter" class="w-4 h-4"></i>
                        </button>
                        <button class="text-slate-500 hover:text-green-600 p-1.5 hover:bg-green-50 rounded-lg transition-colors" title="Export Excel">
                            <i data-lucide="download" class="w-4 h-4"></i>
                        </button>
                        <button class="text-slate-500 hover:text-slate-800 p-1.5 hover:bg-slate-50 rounded-lg transition-colors" title="Plein écran">
                            <i data-lucide="maximize-2" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>
                
                <div class="flex-1 overflow-auto custom-scrollbar relative">
                    <table class="w-full text-left">
                        <thead>
                            <tr>
        `;

        // Dynamic Columns
        data.columns.forEach(col => {
            const colName = col === "" ? "-" : col;
            tableHeaderHTML += `<th class="whitespace-nowrap bg-slate-50/95 sticky top-0 backdrop-blur-sm z-10 box-border">${colName}</th>`;
        });

        tableHeaderHTML += `
                            </tr>
                        </thead>
                        <tbody class="text-slate-600 divide-y divide-slate-100">
        `;

        // Dynamic Rows
        const maxRows = 200; // Increase limit for robustness
        data.rows.slice(0, currentSheet.includes('MENSUEL') ? 500 : maxRows).forEach(row => {
            tableHeaderHTML += `<tr class="hover:bg-blue-50/50 transition-colors group">`;
            data.columns.forEach(col => {
                const cellData = row[col];
                let cellValue = "";
                let cellStyle = "";

                if (cellData && typeof cellData === 'object' && 'value' in cellData) {
                    cellValue = cellData.value !== null ? cellData.value : "";

                    if (cellData.style) {
                        if (cellData.style.backgroundColor) {
                            cellStyle += `background-color: ${cellData.style.backgroundColor};`;
                            // Slight border for colored cells to pop?
                            // cellStyle += `border: 1px solid rgba(0,0,0,0.05);`; 
                        }
                        if (cellData.style.color) {
                            cellStyle += `color: ${cellData.style.color};`;
                        }
                        if (cellData.style.fontWeight) {
                            cellStyle += `font-weight: ${cellData.style.fontWeight};`;
                        }
                        if (cellData.style.fontStyle) {
                            cellStyle += `font-style: ${cellData.style.fontStyle};`;
                        }
                    }
                } else {
                    cellValue = cellData !== null && cellData !== undefined ? cellData : "";
                }

                tableHeaderHTML += `<td class="max-w-xs truncate py-2 px-3 border-r border-slate-100 last:border-r-0" style="${cellStyle}" title="${cellValue}">${cellValue}</td>`;
            });
            tableHeaderHTML += `</tr>`;
        });

        tableHeaderHTML += `
                        </tbody>
                    </table>
                </div>
                <div class="px-4 py-2 border-t border-slate-200 bg-slate-50 text-xs text-slate-500 flex justify-between items-center">
                    <span>${Math.min(data.rows.length, 500)} lignes affichées</span>
                    <div class="flex gap-1">
                        <span class="w-2 h-2 rounded-full bg-slate-300"></span>
                        <span class="w-2 h-2 rounded-full bg-slate-300"></span>
                        <span class="w-2 h-2 rounded-full bg-blue-500"></span>
                    </div>
                </div>
            </div>
        `;

        mainContent.innerHTML = `<div class="animate-fade-in">${tableHeaderHTML}</div>`;
        lucide.createIcons();
    }

    // Initialize Global Dashboard
    loadSheet(null);
});
