const baseUrl = 'http://127.0.0.1:8080/api/v1/'
const playerStep = 1;
let currentPlayer, stompClient
let isWebSocketConnect = false


document.addEventListener("DOMContentLoaded", (event) => {
    connectToWebSockets()
    createPlayer()
    createAnotherPlayers()  
});

document.addEventListener('keydown', (event) => {
    const player = document.querySelector('.current_player');
    let top = parseFloat(player.style.top);
    let left = parseFloat(player.style.left);

    switch (event.key) {
        case 'w':
            top -= playerStep;
            break;
        case 'a':
            left -= playerStep;
            break;
        case 's':
            top += playerStep;
            break;
        case 'd':
            left += playerStep;
            break;
    }

    top = Math.max(0, Math.min(100, top));
    left = Math.max(0, Math.min(100, left));

    player.style.left = `${left}%`;
    player.style.top = `${top}%`;
    sendCoords(left, top, currentPlayer.name)
});

document.addEventListener('mousemove', (event) => {
    const player = document.querySelector('.current_player')
    if(player){
        const rect = player.getBoundingClientRect()
        const playerX = rect.left + rect.width / 2
        const playerY = rect.top + rect.height / 2
        
        const angle = Math.atan2(event.clientY - playerY, event.clientX - playerX) * (180 / Math.PI)
        const playerTransform = `rotate(${angle + 90}deg)`
        player.style.transform = playerTransform
        
        sendTransform(playerTransform, currentPlayer.name)
    }
});

document.addEventListener('click', (event) => {
    const player = document.querySelector('.current_player')
    
    if(player){
        createBullet(player);
    }
});

const createAnotherPlayers = () => {
    axios.get(baseUrl + 'players/get-all-players')
    .then((response) => {
        response.data.forEach(player => {
            const playerDTO = {
                playerName: player.name,
                color: player.rgb
            }
            showAnotherPlayer(playerDTO)
        });
    })
}

const createBullet = (player) => {
    const mainField = document.querySelector('.main_field');
    const bullet = document.createElement('div');
    bullet.classList.add('bullet');
    
    const rect = player.getBoundingClientRect();
    const playerCenterX = rect.left + rect.width / 2;
    const playerCenterY = rect.top + rect.height / 2;
    
    bullet.style.left = `${playerCenterX}px`;
    bullet.style.top = `${playerCenterY}px`;
    
    mainField.appendChild(bullet);
    
    const angle = getPlayerAngle(player);
    moveBullet(bullet, angle);
    sendBullet(playerCenterX, playerCenterY, angle, currentPlayer.name)
}

const getPlayerAngle = (player) => {
    const transform = player.style.transform;
    const match = transform.match(/rotate\(([-\d.]+)deg\)/);
    return match ? parseFloat(match[1]) - 90 : 0;
}

const moveBullet = (bullet, angle) => {
    const speed = 5;
    const radians = angle * (Math.PI / 180);
    
    const moveBulletFrame = () => {
        const left = parseFloat(bullet.style.left);
        const top = parseFloat(bullet.style.top);
        
        bullet.style.left = `${left + Math.cos(radians) * speed}px`;
        bullet.style.top = `${top + Math.sin(radians) * speed}px`;
        
        if (isBulletOutOfBounds(bullet)) {
            bullet.remove();
        } else if (isBulletHit(bullet)) {
            bullet.remove()
        } else {
            requestAnimationFrame(moveBulletFrame);
        }
    }
    
    requestAnimationFrame(moveBulletFrame);
}

const isBulletHit = (bullet) => {
    const players = document.querySelectorAll('.player')
    const x = parseFloat(bullet.style.left)
    const y = parseFloat(bullet.style.top)

    for(const player of players){
        if(player.classList.contains(currentPlayer.name)){
            continue
        }

        const playerRect = player.getBoundingClientRect()
        if(x >= playerRect.left && x <= playerRect.right && y >= playerRect.top && y <= playerRect.bottom){
            const playerName = player.classList[1]
            axios.delete(baseUrl + 'players/delete-player/' + playerName)
            player.remove()
            return true
        }
    }
    return false
}

const isBulletOutOfBounds = (bullet) => {
    const rect = bullet.getBoundingClientRect();
    const mainField = document.querySelector('.main_field');
    const fieldRect = mainField.getBoundingClientRect();
    
    return (
        rect.left < fieldRect.left ||
        rect.right > fieldRect.right ||
        rect.top < fieldRect.top ||
        rect.bottom > fieldRect.bottom
    );
}

const sendBullet = (left, top, angle, playerName) => {
    const message = JSON.stringify({ left, top, angle, playerName });
    sendToChannel(`/app/send-bullet`, message);
}

const sendCoords = (left, top, playerName) => {
    const message = JSON.stringify({ left, top, playerName });
    sendToChannel(`/app/send-coords`, message);
}

const sendTransform = (transform, playerName) => {
    const message = JSON.stringify({ transform, playerName });
    sendToChannel(`/app/send-transform`, message);
}

const createPlayer = () => {
    axios.get(baseUrl + 'players/get-player-name')
    .then((response) => {
        currentPlayer = response.data
        showMainPlayerOnScreen(currentPlayer)
        movePlayerToRandomCoords()
        waitForConnection().then(() => {
            sayAboutNewPlayer();
        });
    })
}

const movePlayerToRandomCoords = () => {
    const player = document.querySelector('.current_player')    
    player.style.left = Math.floor(Math.random() * 101) + '%'
    player.style.top = Math.floor(Math.random() * 101) + '%'
}

const connectToWebSockets = () => {

    stompClient = new StompJs.Client({
        brokerURL: 'ws://localhost:8080/ws',
    });

    stompClient.onConnect = (frame) => {
        isWebSocketConnect = true;
        stompClient.subscribe('/topic/get-coords', function(message) {
            const data = JSON.parse(message.body)
            showAnotherPlayerMove(data)
        });

        stompClient.subscribe('/topic/get-transform', function(message) {
            const data = JSON.parse(message.body)
            showAnotherPlayerTransform(data)
        });

        stompClient.subscribe('/topic/new-player', function(message) {
            const data = JSON.parse(message.body)
            showAnotherPlayer(data)
        });

        stompClient.subscribe('/topic/get-bullet', function(message) {
            const data = JSON.parse(message.body)
            showAnotherPlayerBullet(data)
        });
    };

    stompClient.onWebSocketError = (error) => {
        console.error('Error with websocket', error);
    };

    stompClient.onStompError = (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
    };

    stompClient.activate();
};

const showAnotherPlayerBullet = (data) => {
    const mainField = document.querySelector('.main_field')
    const bullet = document.createElement('div');
    bullet.classList.add('bullet');
    bullet.classList.add(data.playerName);
    bullet.style.left = `${data.left}px`;
    bullet.style.top = `${data.top}px`;
    bullet.style.transform = `rotate(${data.angle}deg)`;
    mainField.appendChild(bullet);
    moveBullet(bullet, data.angle);
}

const showAnotherPlayerMove = (data) => {
    if(data.playerName === currentPlayer.name){
        return
    }
    const playerClass = '.' + data.playerName
    const anotherPlayer = document.querySelector(playerClass)
    anotherPlayer.style.left = data.left + '%'
    anotherPlayer.style.top = data.top + '%'
}

const showAnotherPlayerTransform = (data) => {
    if(data.playerName === currentPlayer.name){
        return
    }
    const playerClass = '.' + data.playerName
    const anotherPlayer = document.querySelector(playerClass)
    anotherPlayer.style.transform = data.transform
}

const showMainPlayerOnScreen = (newPlayer) => {
    let player = showPlayer(newPlayer.name, newPlayer.rgb)
    player.classList.add('current_player')
}

const showAnotherPlayer = (data) => {
    if(data.playerName === currentPlayer.name){
        return
    }
    showPlayer(data.playerName, data.color)
}

const showPlayer = (name, rgb) => {
    const mainField = document.querySelector('.main_field')
    let player = document.createElement('div')
    player.classList.add('player', name)
    mainField.appendChild(player)
    player.style.borderLeft = '25px solid transparent';
    player.style.borderRight = '25px solid transparent';
    player.style.borderBottom = `50px solid ${rgb}`;
    player.style.left = Math.floor(Math.random() * 101) + '%'
    player.style.top = Math.floor(Math.random() * 101) + '%'
    return player
}

const sayAboutNewPlayer = () => {
    const player = document.querySelector('.current_player')
    let top = parseFloat(player.style.top);
    let left = parseFloat(player.style.left);
    const message = JSON.stringify({ 
            playerName: currentPlayer.name,
            top: top,
            left: left,
            color: currentPlayer.rgb 
        }); 
    sendToChannel(`/app/new-player`, message);
}

const sendToChannel = (destination, message) => {
    stompClient.publish({
        destination: destination,
        body: message
    });
};


const waitForConnection = () => {
    return new Promise((resolve, reject) => {
        const checkConnection = () => {
            if (isWebSocketConnect) {
                resolve();
            } else {
                setTimeout(checkConnection, 100);
            }
        };
        checkConnection();
    });
};