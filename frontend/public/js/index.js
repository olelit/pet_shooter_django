const baseUrl = 'http://127.0.0.1:8080/api/v1/'
let currentPlayer = null

const createPlayer = async () => {
    const data = await getPlayer()
    currentPlayer = data
    if (data !== null) {
        const mainField = document.querySelector('.main_field')
        let player = document.createElement('div')
        player.classList.add('player', 'object', 'current_player')
        mainField.appendChild(player)
        const rgb = data.r_g_b
        player.style.borderLeft = '50px solid ' + rgb
        setInterval(refreshPlayerStatus, 36000)
        getActivePlayers()
    }
}

const refreshPlayerStatus = () => {
    if (currentPlayer !== null) {
        fetch(baseUrl + 'players/' + currentPlayer.id + '/update-activity')
    }
}

const getPlayer = async () => {
    const response = await fetch(baseUrl + 'players/get-player-name', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return await response.json();
}

const getActivePlayers = () => {
    const socket  = new WebSocket(`ws://localhost:8000/ws/players/${currentPlayer.id}/get-active-players`)

    socket.onopen = () => {
        console.log('WebSocket connected');
    };

    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log('Message from server:', message);
    };

    socket.onclose = () => {
        console.log('WebSocket closed');
    };
}

document.addEventListener("DOMContentLoaded", (event) => {
    createPlayer();
});

window.addEventListener("beforeunload", function (e) {
    fetch(baseUrl + 'players/' + currentPlayer.id + '/delete-player')
});