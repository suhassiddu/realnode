function calculateDistance(lat1, lon1, lat2, lon2) {
    console.log({ lat1, lon1, lat2, lon2 })
    var R = 6371; // km
    var dLat = toRad(lat2 - lat1);
    var dLon = toRad(lon2 - lon1);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
}
function toRad(n) {
    return n * Math.PI / 180;
}

function isexist(obj) {
    return obj !== null && obj !== undefined
}

module.exports = {
    calculateDistance,
    isexist
}