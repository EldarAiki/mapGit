import { storage } from './storage.service.js'


export const locService = {
    getLocs,
    getLocation,
    createLocation,
    addLocation,
    removeLocation
}

let gLocation = [] 

const locs = [
    { name: 'Greatplace', lat: 32.047104, lng: 34.832384 }, 
    { name: 'Neveragain', lat: 32.047201, lng: 34.832581 }
]

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 2000)
    });
}

function addLocation(lat,lng) {
    const location = createLocation(lat,lng)
    gLocation.push(location)
}

function removeLocation(idx) {
    gLocation.splice(idx,1)
    storage.saveToStorage('DB',gLocation)
}

function getLocation() {
    return gLocation
}

function createLocation(lat,lng) {
    return {
        // id,
        name: '1',
        lat,
        lng,
        // createdAt,
        // updatedAt
    }
}


