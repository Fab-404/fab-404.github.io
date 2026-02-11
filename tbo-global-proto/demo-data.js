// Données fictives pour le prototype TBO GLOBAL

// KPI Cards Data
const kpiData = [
    {
        title: "Production Jour",
        value: "1,240",
        unit: "Pcs",
        trend: "up",
        diff: "+12%",
        icon: "package"
    },
    {
        title: "Efficience (OEE)",
        value: "87.5",
        unit: "%",
        trend: "up",
        diff: "+2.4%",
        icon: "activity"
    },
    {
        title: "Retard Cumulé",
        value: "45",
        unit: "Min",
        trend: "down",
        diff: "-15%",
        icon: "clock"
    },
    {
        title: "Effectif Présent",
        value: "18",
        unit: "/ 20",
        trend: "neutral",
        diff: "90%",
        icon: "users"
    }
];

// Production Chart Data
const hourlyProduction = {
    labels: ["06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00"],
    datasets: [
        {
            label: 'Objectif',
            data: [150, 300, 450, 600, 750, 900, 1050, 1200],
            borderColor: '#94a3b8', // slate-400
            borderDash: [5, 5],
            tension: 0.4,
            fill: false
        },
        {
            label: 'Réel',
            data: [145, 290, 460, 610, 740, 890, 1060, 1240],
            borderColor: '#3b82f6', // blue-500
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
            fill: true
        }
    ]
};

// Orders Table Data
const productionOrders = [
    {
        id: "OF-2024-001",
        product: "Boîtier Aluminium A54",
        qty: 500,
        qty_done: 450,
        operator: "Jean Dupont",
        status: "En cours",
        progress: 90
    },
    {
        id: "OF-2024-002",
        product: "Connecteur X-Pro",
        qty: 1200,
        qty_done: 1200,
        operator: "Sophie Martin",
        status: "Terminé",
        progress: 100
    },
    {
        id: "OF-2024-003",
        product: "Panneau de Contrôle V2",
        qty: 300,
        qty_done: 45,
        operator: "Marc Weber",
        status: "Alerte", // Retard ou problème
        progress: 15
    },
    {
        id: "OF-2024-004",
        product: "Support Moteur Type B",
        qty: 850,
        qty_done: 200,
        operator: "Julie Roux",
        status: "En cours",
        progress: 23
    },
    {
        id: "OF-2024-005",
        product: "Kit Assemblage #44",
        qty: 2000,
        qty_done: 0,
        operator: "En attente",
        status: "Planifié",
        progress: 0
    }
];

// Expose data globally
window.demoData = {
    kpiData,
    hourlyProduction,
    productionOrders
};
