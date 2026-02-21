function updateDate() {
    const updateTime = document.querySelector(".time-update");

const d = new Date();
const day = String(d.getDate() + 1).padStart(2, '0');
const month = String(d.getMonth() + 1).padStart(2, '0');
const year = d.getFullYear();
let monthName;
switch(month) {
    case '01':
        monthName = "January";
        break;
    case '02':
        monthName = "February";
        break;
    case '03':
        monthName = "March";
        break;
    case '04':
        monthName = "April";
        break;
    case '05':
        monthName = "May";
        break;
    case '06':
        monthName = "June";
        break;
    case '07':
        monthName = "July";
        break;
    case '08':
        monthName = "August";
        break;
    case '09':
        monthName = "September";
        break;
    case '10':
        monthName = "October";
        break;
    case '11':
        monthName = "November";
        break;
    case '12':
        monthName = "December";
        break;
}
const formattedDate = `${monthName} ${day}, ${year}`;

updateTime.textContent = `Last updated: ${formattedDate}`;

}

updateDate();

setInterval(updateDate, 3600000);      

    //  From API Data Extraction and Declaration

let exchangeRate = "..."

import { getUSDToETB } from './api.js';
const etbFromUsd = document.querySelector(".value");

  

getUSDToETB()
    .then(result => { 
        exchangeRate = result
        etbFromUsd.textContent = result;
        highRate();
        lowRate();
        dailyChange();
        dailyPercent();
        renderChartWithExchangeRate();
    })
    .catch(error => {
        etbFromUsd.textContent = error;
    });

function highRate(a) {
    let lowValue = document.querySelector(".high-value");
      let highAmount = (Number(exchangeRate) + 0.12);
          lowValue.innerHTML = `${highAmount.toFixed(2)}<span>ETB</span>`;
    }
function lowRate(a) {
     let lowValue = document.querySelector(".low-value");
     let lowAmount = (Number(exchangeRate) - 0.09);
     lowValue.innerHTML = `${lowAmount.toFixed(2)}<span>ETB</span>`;
    }

   // Change in 24 Hours in % and in ETB
function getDailyRandomPercent() {
    const now = new Date().getTime();
    const twentyFourHours = 24 * 60 * 60 * 1000;

    const savedData = localStorage.getItem('dailyRandomData');
    
    if (savedData) {
        const parsedData = JSON.parse(savedData);
        
        if (now - parsedData.timestamp < twentyFourHours) {
            return parsedData.value;
        }
    }

    const newRandomValue = (Math.random() * 25).toFixed(2);
    
    const dataToSave = {
        value: newRandomValue,
        timestamp: now
    };
    localStorage.setItem('dailyRandomData', JSON.stringify(dataToSave));

    return newRandomValue;
}

const myPercent = getDailyRandomPercent();

    let changeAmount;
function dailyChange() {
    let dailyChangeValue = document.querySelector(".change-value");
    changeAmount = myPercent / 100;
    dailyChangeValue.innerHTML = `+${changeAmount.toFixed(2)}<span>ETB</span>`;
}

function dailyPercent() {
    let dailyPercentValue = document.querySelector(".daily-percent");
    dailyPercentValue.textContent = `${myPercent}%`;
}

// Stagger-aware IntersectionObserver initializer
function initStaggeredObserver() {
    // Assign an index variable (--i) to each child of containers marked .stagger
    document.querySelectorAll('.stagger').forEach((container) => {
        Array.from(container.children).forEach((child, idx) => {
            child.style.setProperty('--i', idx);
        });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            } else {
                entry.target.classList.remove('show');
            }
        });
    }, { threshold: 0.06 });

    // Start observing all elements that will animate
    document.querySelectorAll('.hidden').forEach((el) => observer.observe(el));
}

// Initialize stagger observer immediately (script is loaded at end of body)
initStaggeredObserver();

// Quick Converter

const converterInput = document.getElementById("converterInput");
const converterOutput = document.getElementById("converterOutput");

converterInput.addEventListener("input", (event) => {
    const currentValue = event.target.value;

    const rate = Number(exchangeRate) || 0;
    const proccedValue = currentValue * rate;

    converterOutput.textContent = proccedValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}); 



// ---------- ApexCharts market trend graph ----------
// grab color vars from CSS, falling back to earlier values
const colorPrimary = getComputedStyle(document.documentElement)
    .getPropertyValue("--primary")
    .trim();
const colorLabel = getComputedStyle(document.documentElement)
    .getPropertyValue("--muted")
    .trim();
const fontFamily = getComputedStyle(document.documentElement)
    .getPropertyValue("--font-family")
    .trim() || 'Inter, sans-serif';

const defaultOptions = {
    chart: {
        toolbar: { show: false },
        zoom: { enabled: false },
        width: '100%',
        height: 180,
        offsetY: 18,
        /* move entire chart right/left so grid padding isn't needed */
        offsetX: 0
    },
    dataLabels: { enabled: false }
};


const barOptions = {
    ...defaultOptions,
    chart: { ...defaultOptions.chart, type: 'area' },
    tooltip: {
        enabled: true,
        style: { fontFamily: fontFamily },
        y: { formatter: (v) => `${v} ETB` }
    },
    series: [
        { name: 'birr', data: [144.50, 153.00, 153.70, 153.30, 155.30]}
    ],
    colors: [colorPrimary],
    fill: {
        type: 'gradient',
        gradient: {
            type: 'vertical',
            opacityFrom: 1,
            opacityTo: 0,
            stops: [0, 100],
            colorStops: [
                { offset: 0, opacity: 0.4, color: '#ffffff' },
                { offset: 100, opacity: 0, color: '#ffffff' }
            ]
        }
    },
    stroke: { colors: [colorPrimary], lineCap: 'round' },
    grid: {
        borderColor: 'rgba(0, 0, 0, 0)',
        /* only vertical padding now that offsetX handles horizontal spacing */
        padding: {top: -30,
            right: 0,
            bottom: 5,
            left: 20}
    },
    markers: { strokeColors: colorPrimary },
    yaxis: { show: false },
    xaxis: {
        labels: {
            show: true,
            floating: true,
            style: { colors: colorLabel, fontFamily: fontFamily }
        },
        axisBorder: { show: false },
        crosshairs: { show: false },
        categories: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'TODAY']
    }
};

function renderChartWithExchangeRate() {
    const chartContainer = document.querySelector('.area-chart');
    if (!(chartContainer && typeof ApexCharts !== 'undefined')) return;

    const value = Number(exchangeRate);
    if (!Number.isFinite(value)) return;

    // clone options so we don't mutate the original template
    const options = JSON.parse(JSON.stringify(barOptions));
    options.series[0].data.push(value);

    const chart = new ApexCharts(chartContainer, options);
    chart.render();
}

// Variable selection

const valueInEtb = document.getElementsByClassName("value");
//  .......
  
