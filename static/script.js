const form = document.getElementById('fireForm');
const historyList = document.getElementById('history');
const riskSummaryValue = document.querySelector('#riskSummary span');
const ctxProb = document.getElementById('probChart').getContext('2d');
const ctxTrend = document.getElementById('trendChart').getContext('2d');

let chartProb, chartTrend, map, heatLayer;
let predictions = [];

// Initialize map
map = L.map('map').setView([39, -98], 4);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{ attribution:'Map data © OpenStreetMap contributors' }).addTo(map);
heatLayer = L.heatLayer([], {radius:25, blur:15, maxZoom:12}).addTo(map);

// Load historical fire points
fetch('/history').then(r=>r.json()).then(data=>{
    data.forEach(p=>{
        L.circle([p.Y,p.X], {radius: p.fire*50000, color:'red', fillOpacity:0.6})
            .bindPopup(`Probability: ${p.fire*100}%`).addTo(map);
    });
});

// Form submit: predict fire
form.addEventListener('submit', async e=>{
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    try{
        const res = await fetch('/predict',{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data)});
        const result = await res.json();
        if(result.error){ alert(result.error); return; }

        predictions.push(result);

        // Update history
        const li = document.createElement('li');
        li.textContent = `${result.prediction} (${result.probability}%) at [${result.X},${result.Y}]`;
        historyList.appendChild(li);

        // Update risk summary
        riskSummaryValue.textContent = `${result.prediction} (${result.probability}%)`;

        // Probability chart
        if(chartProb) chartProb.destroy();
        chartProb = new Chart(ctxProb,{
            type:'bar',
            data:{ labels:['No Fire','Fire Risk'], datasets:[{label:'Probability (%)', data:[100-result.probability,result.probability], backgroundColor:['#2ed573','#ff4d4d']}]},
            options:{responsive:true, animation:{duration:500}}
        });

        // Trend chart
        if(chartTrend) chartTrend.destroy();
        chartTrend = new Chart(ctxTrend,{
            type:'line',
            data:{ labels:predictions.map((_,i)=>i+1), datasets:[{label:'Fire Probability (%)', data:predictions.map(p=>p.probability), borderColor:'#ff4d4d', backgroundColor:'rgba(255,77,77,0.2)', fill:true, tension:0.3}]},
            options:{responsive:true, scales:{y:{beginAtZero:true, max:100}}}
        });

        // Add heat point to map
        heatLayer.addLatLng([result.Y,result.X,result.probability/100]);

    }catch(err){
        alert('Error fetching prediction. Make sure all fields are correct.');
        console.error(err);
    }
});

// Forecast button
document.getElementById('forecastBtn').addEventListener('click', async ()=>{
    const data = Object.fromEntries(new FormData(form).entries());
    try{
        const res = await fetch('/forecast',{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data)});
        const result = await res.json();
        if(result.error){ alert(result.error); return; }

        // Add forecast points to map
        result.forecast.forEach(p=>{
            L.circle([p.Y,p.X], {radius: p.probability*1000, color:'orange', fillOpacity:0.4})
                .bindPopup(`Day ${p.day} Forecast: ${p.probability}%`).addTo(map);
        });

        alert('Forecast added to map!');
    }catch(err){
        alert('Error fetching forecast. Make sure all fields are filled correctly.');
        console.error(err);
    }
});
