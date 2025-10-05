
let map;
let geocoder;
let pollen = "TREE_UPI";
let pollenMarker;

let currentForecast = null;
const forecastDates = [];
let timeLapseIndex = 0;
let timeLapseInterval = null;
let pollenMapType = null; // make it global

// 🔹 Normalize tile coordinates
function getNormalizedCoord(coord, zoom) {
  let { x, y } = coord;
  const tileRange = 1 << zoom;
  if (y < 0 || y >= tileRange) return null;
  x = ((x % tileRange) + tileRange) % tileRange;
  return { x, y };
}

// 🔹 Pollen overlay
class PollenMapType {
  constructor(tileSize, selectedDate) {
    this.tileSize = tileSize;
    this.selectedDate = selectedDate;
  }
  maxZoom = 16;
  minZoom = 3;

  getTile(coord, zoom, ownerDocument) {
    const img = ownerDocument.createElement("img");
    const mapType = pollen; // uses current pollen type
    const normalizedCoord = getNormalizedCoord(coord, zoom);
    if (!normalizedCoord) return null;

    const x = normalizedCoord.x;
    const y = normalizedCoord.y;

    const key = "AIzaSyDof8QDt0_6EghBjqAucP4nnlKqN8cG5y0";

    img.style.opacity = 0.4;
    img.src = `https://pollen.googleapis.com/v1/mapTypes/${mapType}/heatmapTiles/${zoom}/${x}/${y}?key=${key}`;
    return img;
  }
  releaseTile(tile) {}
}

function updateMapAndUIForDate(forecast, location) {
  // Remove existing marker if any
  if (pollenMarker) pollenMarker.setMap(null);

  // Build HTML content for all pollen types
  let content = '';
  forecast.pollenTypeInfo.forEach(pollenData => {
    const intensity = pollenData.indexInfo.value || 0;
    const colors = ['green', 'yellow', 'orange', 'red', 'purple'];
    const color = colors[intensity] || 'gray';

    content += `
      <div style="margin-bottom: 4px;">
        <span style="display:inline-block;width:12px;height:12px;background-color:${color};border-radius:50%;margin-right:6px;"></span>
        <strong>${pollenData.displayName}:</strong> ${pollenData.indexInfo.category}<br>
        <em>${pollenData.healthRecommendations.join(', ')}</em>
      </div>
    `;
  });

  // Create marker at center location
  pollenMarker = new google.maps.Marker({
    position: location,
    map: map,
    title: "Pollen Forecast"
  });

  // Create info window
  const infoWindow = new google.maps.InfoWindow({
    content: `<div style="min-width:200px;">${content}</div>`
  });

  // Open info window immediately
  infoWindow.open(map, pollenMarker);

  // Optional: center and zoom map
  map.setCenter(location);
  map.setZoom(10);

  // Update info panel
const infoPanel = document.getElementById('pollenInfoPanel');
if (infoPanel) {
  infoPanel.innerHTML = forecast.pollenTypeInfo.map(p =>
    `<div><strong>${p.displayName}:</strong> ${p.indexInfo.category}<br><small>${p.healthRecommendations.join(', ')}</small></div>`
  ).join('');
}

}


// 🔹 Central function to update display for any date
function updateDisplayForDate(dateStr) {
  if (!currentForecast) {
    console.warn("Forecast not loaded yet!");
    return;
  }

  const forecast = currentForecast.find(day => {
    const dayStr = `${day.date.year}-${String(day.date.month).padStart(2, '0')}-${String(day.date.day).padStart(2, '0')}`;
    return dayStr === dateStr;
  });

  if (!forecast) {
    console.warn("No forecast for:", dateStr);
    return;
  }

  updateMapAndUIForDate(forecast, map.getCenter());

  // update overlay
  if (pollenMapType) map.overlayMapTypes.removeAt(0);
  pollenMapType = new PollenMapType(new google.maps.Size(256, 256), dateStr);
  map.overlayMapTypes.insertAt(0, pollenMapType);

  console.log(`Displaying forecast for ${dateStr}:`, forecast);
}

// 🔹 Prepare dates for time-lapse
function setupTimeLapseDates(dailyInfo) {
  forecastDates.length = 0;
  dailyInfo.forEach(day => {
    const dateStr = `${day.date.year}-${String(day.date.month).padStart(2, '0')}-${String(day.date.day).padStart(2, '0')}`;
    forecastDates.push(dateStr);
  });
}

// 🔹 Refresh overlay and marker when pollen type changes
function updatePollenOverlayAndMarker() {
  // update overlay tiles
  if (pollenMapType) map.overlayMapTypes.removeAt(0);
  pollenMapType = new PollenMapType(new google.maps.Size(256, 256));
  map.overlayMapTypes.insertAt(0, pollenMapType);

  // update marker for the current date
  const dateInput = document.getElementById("dateInput");
  if (dateInput && currentForecast) {
    updateDisplayForDate(dateInput.value);
  }
}

// 🔹 Start time-lapse
function startTimeLapse() {
  if (!forecastDates.length) return;
  if (timeLapseInterval) clearInterval(timeLapseInterval);
  if (timeLapseIndex >= forecastDates.length) timeLapseIndex = 0;

  timeLapseInterval = setInterval(() => {
    const dateStr = forecastDates[timeLapseIndex];
    updateDisplayForDate(dateStr);
    timeLapseIndex++;
    if (timeLapseIndex >= forecastDates.length) {
      clearInterval(timeLapseInterval);
      timeLapseInterval = null;
    }
  }, 2000);
}

// 🔹 Initialize map and UI
function initMap() {
  geocoder = new google.maps.Geocoder();

  map = new google.maps.Map(document.getElementById("map"), {
    mapId: "4cd92f36fb2ff143b1b66208",
    zoom: 3,
    center: { lat: 39.8283, lng: -98.5795 },
    maxZoom: 16,
    minZoom: 3,
    streetViewControl: false,
  });

  // const legend = document.getElementById('pollenLegend');
  // legend.style.display = 'block';
  // map.controls[google.maps.ControlPosition.RIGHT_TOP].push(legend);

  pollenMapType = new PollenMapType(new google.maps.Size(256, 256));
  map.overlayMapTypes.insertAt(0, pollenMapType);

  // Date picker
  const dateInput = document.getElementById("dateInput");
  const today = new Date();
  const formatDate = d => d.toISOString().split("T")[0];
  dateInput.min = formatDate(today);
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 4);
  dateInput.max = formatDate(maxDate);
  dateInput.value = formatDate(today);

  dateInput.addEventListener('change', (e) => {
    updateDisplayForDate(e.target.value);
  });

  // Search button
  document.getElementById('searchBtn').addEventListener('click', async () => {
    const address = document.getElementById('locationInput').value;
    const inputDate = dateInput.value;
    if (!address) return alert("Please enter a location");
    if (!inputDate) return alert("Please select a date");

    geocoder.geocode({ address }, async (results, status) => {
      if (status !== 'OK' || !results[0]) return alert("Location not found: " + status);
      const location = results[0].geometry.location;
      map.setCenter(location);
      map.setZoom(8);

      const apiKey = "AIzaSyDof8QDt0_6EghBjqAucP4nnlKqN8cG5y0";
      const url = `https://pollen.googleapis.com/v1/forecast:lookup?key=${apiKey}&location.latitude=${location.lat()}&location.longitude=${location.lng()}&days=5`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        if (!data.dailyInfo || !Array.isArray(data.dailyInfo)) return alert("No forecast data returned.");

        currentForecast = data.dailyInfo;
        setupTimeLapseDates(currentForecast);

        updateDisplayForDate(inputDate);

      } catch (err) {
        alert("Error fetching pollen data: " + err.message);
      }
    });
  });

  // Pollen type buttons
  document.querySelector("#tree").addEventListener("click", () => { pollen = "TREE_UPI"; updatePollenOverlayAndMarker(); });
  document.querySelector("#grass").addEventListener("click", () => { pollen = "GRASS_UPI"; updatePollenOverlayAndMarker(); });
  document.querySelector("#weed").addEventListener("click", () => { pollen = "WEED_UPI"; updatePollenOverlayAndMarker(); });

  let currentIndex = 0;

function showDateAtIndex(index) {
  if (!forecastDates.length) return;
  if (index < 0) index = forecastDates.length - 1;
  if (index >= forecastDates.length) index = 0;

  currentIndex = index;
  const dateStr = forecastDates[currentIndex];
  updateDisplayForDate(dateStr);

  // update label (user friendly date)
  const d = new Date(dateStr);
  const friendlyDate = d.toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' });
  document.getElementById("currentDateLabel").innerText = friendlyDate;
}

// Arrows
document.getElementById("prevBtn").addEventListener("click", () => {
  showDateAtIndex(currentIndex - 1);
});

document.getElementById("nextBtn").addEventListener("click", () => {
  showDateAtIndex(currentIndex + 1);
});

function setupInfoButton(buttonId, tooltipId) {
  const btn = document.getElementById(buttonId);
  const tooltip = document.getElementById(tooltipId);

  btn.addEventListener("click", () => {
    const isVisible = tooltip.style.display === "block";
    document.querySelectorAll(".info-tooltip").forEach(el => el.style.display = "none");
    tooltip.style.display = isVisible ? "none" : "block";
  });
}

setupInfoButton("tree0", "treeInfo");
setupInfoButton("grass0", "grassInfo");
setupInfoButton("weed0", "weedInfo");


}
