const socket = io(); // Automatically connects to the same origin as your server

if (navigator.geolocation) {

    const map = L.map("map").setView([0, 0], 15);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'bla bla'
    }).addTo(map);

    navigator.geolocation.watchPosition((postion) => {
        const { latitude, longitude } = postion.coords;

        socket.emit("connect-user", [latitude, longitude]);
    }, (error) => {
        console.log("error in geo location", error);
    }), {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    const markers = {};

    socket.on("user-receiver", ({ id, coords: [latitude, longitude] }) => {
        console.log(markers, id, latitude, longitude);

        if (markers[id]) {
            markers[id].setLatLng([latitude, longitude]);

            map.setView([latitude, longitude], 15)
        } else {
            markers[id] = L.marker([latitude, longitude], 15).addTo(map);
        };
    });

    socket.on("user-receiver", (id) => {
        if (markers[id]) {
            map.removeLayer(markers[id])
        };
    });
};