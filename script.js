document.addEventListener('DOMContentLoaded', function () {
    const ratings = [
        { id: 'DR123', rating: 5 },
        { id: 'DR456', rating: 3 },
        { id: 'DR789', rating: 4 }
    ];

    const mapElement = document.getElementById('map');

    var map = L.map('map').setView([51.505, -0.09], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    function addMarker(lat, lon) {
        L.marker([lat, lon]).addTo(map)
            .bindPopup('You are here').openPopup();
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;
            map.setView(new L.LatLng(lat, lon), 13);
            addMarker(lat, lon);
        }, function (error) {
            console.log(error);
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
    
    const ratingsList = document.getElementById('ratingsList');

    function displayRatings() {
        ratingsList.innerHTML = ratings.map(r => `
            <div class="card card-body mb-2">
                <strong>Driver ID:</strong> ${r.id}
                <strong>Rating:</strong> ${r.rating} / 5
            </div>
        `).join('');
    }

    displayRatings();

    document.getElementById('ratingForm').addEventListener('submit', function (event) {
        event.preventDefault();
        
        const driverId = document.getElementById('driverId').value;
        const safetyRating = document.getElementById('safetyRating').value;

        ratings.push({
            id: driverId,
            rating: parseInt(safetyRating[0])
        });

        displayRatings();
        this.reset();
    });
});