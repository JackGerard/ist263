// script.js

const mountains = [
  { name: "Big Sky (MT)", lat: 45.2842, lon: -111.4010 },
  { name: "Park City (UT)", lat: 40.6461, lon: -111.4970 },
  { name: "Beaver Creek (CO)", lat: 39.6042, lon: -106.5165 },
  { name: "Heavenly (CA/NV)", lat: 38.9351, lon: -119.9396 },
  { name: "Copper Mountain (CO)", lat: 39.5022, lon: -106.1510 },
  { name: "Killington (VT)", lat: 43.6261, lon: -72.7960 },
  { name: "Jiminy Peak (MA)", lat: 42.5579, lon: -73.2929 }
];

// Haversine distance in miles
function toRad(deg) { return deg * Math.PI / 180; }
function distanceMiles(lat1, lon1, lat2, lon2) {
  const R = 3958.8; // Earth radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat/2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * (Math.sin(dLon/2) ** 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function renderTable(userLat, userLon) {
  const tbody = document.querySelector("#distanceBody");
  tbody.innerHTML = "";

  const results = mountains.map(m => ({
    name: m.name,
    miles: distanceMiles(userLat, userLon, m.lat, m.lon)
  })).sort((a,b) => a.miles - b.miles);

  for (const r of results) {
    const tr = document.createElement("tr");
    const tdName = document.createElement("td");
    const tdMiles = document.createElement("td");
    tdName.textContent = r.name;
    tdMiles.textContent = `${r.miles.toFixed(1)} mi`;
    tr.appendChild(tdName);
    tr.appendChild(tdMiles);
    tbody.appendChild(tr);
  }

  const msg = document.querySelector("#distanceMsg");
  msg.textContent = `Calculated distances from (${userLat.toFixed(4)}, ${userLon.toFixed(4)}).`;
}

function getInputs() {
  const lat = Number(document.querySelector("#lat").value);
  const lon = Number(document.querySelector("#lon").value);
  return { lat, lon };
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#distanceForm");
  const geoBtn = document.querySelector("#useGeo");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const { lat, lon } = getInputs();
    if (Number.isFinite(lat) && Number.isFinite(lon)) {
      renderTable(lat, lon);
    }
  });

  geoBtn.addEventListener("click", () => {
    const msg = document.querySelector("#distanceMsg");
    if (!navigator.geolocation) {
      msg.textContent = "Geolocation is not supported by your browser.";
      return;
    }
    msg.textContent = "Getting your location…";
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        document.querySelector("#lat").value = lat.toFixed(6);
        document.querySelector("#lon").value = lon.toFixed(6);
        renderTable(lat, lon);
      },
      () => {
        msg.textContent = "Could not access your location. You can still type latitude/longitude.";
      }
    );
  });
});
