import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'
import { storage } from './services/storage.service.js'


window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onGoLocation = onGoLocation;
window.onDeleteLocation = onDeleteLocation;



function onInit() {
    mapService.initMap()
        .then(() => {
            console.log('Map is ready');
        })
        .catch(() => console.log('Error: cannot init map'));
}

renderLocation()

function renderLocation() {
    let locations = storage.loadFromStorage('DB')
    let elLocation = document.querySelector('.locations-table')
    const strHTMLs = locations.map((location,idx) => 
         `<div class="location-card">
         ${location.lng},${location.lat}
         <button onclick="onGoLocation(${location.lng},${location.lat})">Go</button>
         <button onclick="onDeleteLocation(${idx})">Delete</button>
         </div>`
    )
    elLocation.innerHTML = strHTMLs.join('')
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onGoLocation(lng,lat) {
    mapService.panTo(lat,lng);
}

function onDeleteLocation(idx) {
    locService.removeLocation(idx)
    renderLocation()
}

function onAddMarker() {
    let locations = locService.getLocation()
    console.log('location', locations)
    locations.forEach(location => mapService.addMarker({lat : location.lat,lng : location.lng}))
    renderLocation()
}

function onGetLocs() {
    locService.getLocs()
        .then(locs => {
            console.log('Locations:', locs)
            document.querySelector('.locs').innerText = JSON.stringify(locs)
        })
}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords);
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
        })
        .catch(err => {
            console.log('err!!!', err);
        })
}
function onPanTo() {
    console.log('Panning the Map');
    mapService.panTo(35.6895, 139.6917);
}


// test if push works 