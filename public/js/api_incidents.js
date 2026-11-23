const API_URL = 'http://localhost:4000/api/';

function createIncidents(e) {
    e.preventDefault();

    const form = document.getElementById('reportForm');
    const formdata = new FormData(form);
    formdata.append('status', 'New');
    formdata.append('severity', 'High');
    formdata.append('reporter_code', '418302');
    const data = Object.fromEntries(formdata.entries());

    console.log(data);

    fetch(API_URL + 'incidents',
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(response => {
            window.alert('Records Created')
            console.log(response);

        })
        .catch(e => {
            console.log(e)
        })
}

function updateIncidents(id) {
    fetch(API_URL + 'incidents/' + id,
        {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: {}
        })
        .then(response => response.json())
        .then(response => {
            window.alert('Records Created')
        })
        .catch(e => {
            console.log(e)
        })
}

function getIncidents() {
    fetch(API_URL + 'incidents',)
        .then(response => response.json())
        .then(response => {
            console.log(response)
            const listbox = document.getElementById('incidentList')
            listbox.innerHTML = '';
            let items = "";

            response.forEach(data => {
                items += `<div class="col-4">
                <a href="incident.html" class="card incident-card h-100 text-decoration-none text-reset">
                    <img src="images/kdere-spill.webp" class="card-img-top" alt="Oil on the surface of K-Dere creek">
                    <div class="card-body">
                        <span class="badge text-bg-danger">New</span>
                        <p class="card-type small fw-semibold uppercase mt-2 mb-1">${data.type}</p>
                        <h3 class="h6 fw-bold mb-1">${data.title}</h3>
                        <p class="small text-muted mb-0">${data.community}, ${data.lga} . 31st August, 2026.</p>
                    </div>
                </a>
            </div>`
            });


            listbox.innerHTML = items

        })
        .catch(e => {
            console.log(e)
        })
}

function deleteIncidents(id) {
    fetch(API_URL + 'incidents/' + id,
        {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: {}
        })
        .then(response => response.json())
        .then(response => {
            window.alert('Records Created')
        })
        .catch(e => {
            console.log(e)
        })
}