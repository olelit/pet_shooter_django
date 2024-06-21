const baseUrl = 'http://127.0.0.1:8000/api/v1/'
let currentPlayer = null

const createPlayer = async () => {
    const player = getPlayer()
    if (player !== null) {
        const mainField = document.querySelector('.main_field')
        console.log(mainField)
        let player = document.createElement('div')
        player.classList.add('player', 'object', 'current_player')
        mainField.appendChild(player)
        setInterval(refreshPlayerStatus, 36000)
    }
}

const refreshPlayerStatus = () => {
    if (currentPlayer !== null) {
        fetch(baseUrl + 'players/' + currentPlayer.id + '/update-activity')
    }
}

const getPlayer = async () => {
    await fetch(baseUrl + 'players/get-player-name')
        .then(response => {
            return response.json();
        })
        .then(data => {
            currentPlayer = data
            return data
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
    return null
}

document.addEventListener("DOMContentLoaded", (event) => {
    createPlayer();
});