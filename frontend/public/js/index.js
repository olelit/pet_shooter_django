const baseUrl = 'http://127.0.0.1:8000/api/v1/'
let currentPlayer = null

const createPlayer = async () => {
    const data = await getPlayer()

    if (data !== null) {
        const mainField = document.querySelector('.main_field')
        let player = document.createElement('div')
        player.classList.add('player', 'object', 'current_player')
        mainField.appendChild(player)
        const rgb = data.r_g_b
        player.style.borderLeft = '50px solid ' + rgb
        setInterval(refreshPlayerStatus, 36000)
    }
}

const refreshPlayerStatus = () => {
    if (currentPlayer !== null) {
        fetch(baseUrl + 'players/' + currentPlayer.id + '/update-activity', {
            method: "PATCH"
        })
    }
}

const getPlayer = async () => {
    const response = await fetch(baseUrl + 'players/get-player-name');
    return await response.json();
}

document.addEventListener("DOMContentLoaded", (event) => {
    createPlayer();
});

window.addEventListener("beforeunload", function (e) {
    fetch(baseUrl + 'players/' + currentPlayer.id + '/delete-player', {
        method: 'DELETE'
    })                          //Webkit, Safari, Chrome
});