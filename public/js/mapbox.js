/* eslint-disable */
const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log(locations);

mapboxgl.accessToken =
  'pk.eyJ1IjoiY29kZXJ3dXJzdCIsImEiOiJjazM2OWRsOGUxM2sxM2xueWJjeGkybm0wIn0.cF_HORPTV6oTnCJoflXRgg';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/coderwurst/ck369o33l3ied1cmu1iatz7hn',
  scrollZoom: false
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach(location => {
  const marker = document.createElement('div');
  marker.className = 'marker';

  new mapboxgl.Marker({
    element: marker,
    anchor: 'bottom'
  })
    .setLngLat(location.coordinates)
    .addTo(map);

  new mapboxgl.Popup({
    offset: 30
  })
    .setLngLat(location.coordinates)
    .setHTML(`<p>Day ${location.day}: ${location.description}</p>`)
    .addTo(map);

  bounds.extend(location.coordinates);
});

map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 150,
    left: 100,
    right: 100
  }
});
