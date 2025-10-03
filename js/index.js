async function initMap() {
  const location = { lat: 32.32, lng: 35.32 };
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 8,
    center: location,
  });

  const marker = new google.maps.marker.AdvancedMarkerElement({
    position: location,
    map: map,
    title: "Pollen data location"
  });

  const API_KEY = 'AIzaSyDj1vaGauNRgZ8uF5e0WjVgYopOe72avdQ';
  const url = `https://pollen.googleapis.com/v1/forecast:lookup?key=${API_KEY}&location.longitude=${location.lng}&location.latitude=${location.lat}&days=1`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Pollen API request failed');
    const data = await response.json();

    // Extract pollen info for today
    const today = data.dailyInfo[0];
    const pollenInfo = today.pollenTypeInfo.map(type => 
      `${type.displayName}: ${type.indexInfo?.category || 'No data'}`
    ).join('<br>');

    const infoWindow = new google.maps.InfoWindow({
      content: `<div><strong>Date:</strong> ${today.date.year}-${today.date.month}-${today.date.day}<br>${pollenInfo}</div>`
    });

    // Open info window on marker click
    marker.addListener('click', () => {
      infoWindow.open(map, marker);
    });

    // Optionally open info window immediately
    infoWindow.open(map, marker);

  } catch (error) {
    console.error('Error loading pollen data:', error);
  }
}
