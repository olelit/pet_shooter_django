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
        //setInterval(refreshPlayerStatus, 36000)
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
    const stompClient = new StompJs.Client({
        brokerURL: 'ws://localhost:8080/ws', // Убедитесь, что этот URL правильный
        reconnectDelay: 5000, // Автоматическая попытка переподключения каждые 5 секунд
        heartbeatIncoming: 4000, // Сердцебиение для входящих сообщений каждые 4 секунды
        heartbeatOutgoing: 4000  // Сердцебиение для исходящих сообщений каждые 4 секунды
    });

    stompClient.onConnect = (frame) => {
        console.log('Connected: ' + frame);

        // Подписываемся на топик
        stompClient.subscribe('/topic/get-active-players', function(message) {
            const body = JSON.parse(message.body);
            console.log('Received message from topic:', body);
        });

        const connectToChannel = (destination, message) => {
            stompClient.publish({
                destination: destination,

            });
            console.log(`Sent to ${destination}: `, message);
        };

        // Отправляем сообщение на сервер
        connectToChannel(`/app/${currentPlayer.id}/get-active-players`);
    };

    stompClient.onWebSocketError = (error) => {
        console.error('Error with websocket', error);
    };

    stompClient.onStompError = (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
    };

    // Активируем клиент для подключения к WebSocket
    stompClient.activate();
};

document.addEventListener("DOMContentLoaded", (event) => {
    createPlayer();
});

window.addEventListener("beforeunload", function (e) {
    fetch(baseUrl + 'players/' + currentPlayer.id + '/delete-player')
});