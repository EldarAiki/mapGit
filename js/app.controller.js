import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'
import { storage } from './services/storage.service.js'




export const ControllerService = {
   renderAdress
}

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onSearch = onSearch;
window.getAddress = getAddress;
window.onDeleteLocation = onDeleteLocation;
window.onGoLocation = onGoLocation;




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
         ${location.name}
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
    let name = prompt('Enter the name of the location')
    locations.forEach(location => {
         mapService.addMarker({lat : location.lat,lng : location.lng})
         location.name = name
         storage.saveToStorage('DB',locations)

         console.log('location.name', location.name)
    })
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


function onSearch() {
    const val = document.querySelector('#search').value
    getAddress(val)
}


function renderAdress(address) {
    
    const coords = address.results[0].geometry.location
    const location = address.results[0].formatted_address

    console.log('coords' , coords);
    console.log('location', location);

    onGoLocation(coords.lat, coords.lng)

    document.querySelector('.info').innerText = 'Location: ' + location 



    
}

function getAddress(address) {
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address},+Mountain+View,+CA&key=AIzaSyClV3yyxNSXrYdiQq_2hdyYh8D82Lg_B38`)
    .then(address => address.data)
    .then(renderAdress)
    
}