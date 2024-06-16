document.addEventListener('DOMContentLoaded', function () {
    const player = document.querySelector('.player_1');
    const step = 10;
    const halfStep = step / 2
    const keysPressed = {};

    let playerX = parseFloat(getComputedStyle(player).left);
    let playerY = parseFloat(getComputedStyle(player).top);

    function updatePlayerPosition() {
        player.style.left = playerX + 'px';
        player.style.top = playerY + 'px';
    }

    document.addEventListener('keydown', function (event) {
        keysPressed[event.key] = true

        if (keysPressed['a'] && keysPressed['w']) {
            playerX -= step;
            playerY -= halfStep;
        } else if (keysPressed['a'] && keysPressed['s']) {
            playerX -= step;
            playerY += halfStep;
        } else if (keysPressed['d'] && keysPressed['w']) {
            playerX += step;
            playerY -= halfStep;
        } else if (keysPressed['d'] && keysPressed['s']) {
            playerX += step;
            playerY += halfStep;
        }

        switch (event.key) {
            case 'a':
                playerX -= step;
                break;
            case 'w':
                playerY -= step;
                break;
            case 'd':
                playerX += step;
                break;
            case 's':
                playerY += step;
                break;
        }

        const mainFieldWidth = document.querySelector('.main_field').offsetWidth;
        const mainFieldHeight = document.querySelector('.main_field').offsetHeight;
        if (playerX < 0) playerX = 0;
        if (playerY < 0) playerY = 0;
        if (playerX > mainFieldWidth - player.offsetWidth) {
            playerX = mainFieldWidth - player.offsetWidth;
        }
        if (playerY > mainFieldHeight - player.offsetHeight) {
            playerY = mainFieldHeight - player.offsetHeight;
        }

        updatePlayerPosition();
    });

    document.addEventListener('keyup', function (event) {
        delete keysPressed[event.key];
    });

    document.querySelector('.main_field').addEventListener('mousemove', (event) => {
        let mouseX = event.pageX;
        let mouseY = event.pageY;
        let player = document.querySelector('.player_1');
        let mainFieldRect = event.target.getBoundingClientRect();
        let playerRect = player.getBoundingClientRect();
        let playerCenterX = playerRect.left - mainFieldRect.left + playerRect.width / 2;
        let playerCenterY = playerRect.top - mainFieldRect.top + playerRect.height / 2;
        let deltaX = mouseX - playerCenterX;
        let deltaY = mouseY - playerCenterY;
        let angle = Math.atan2(deltaY, deltaX);
        let angleDegrees = angle * (180 / Math.PI);

        player.style.transform = 'rotate(' + angleDegrees + 'deg)';
    });

    document.addEventListener('click', (event) => {
        let player = document.querySelector('.player_1');
        let playerRect = player.getBoundingClientRect();
        const bullet = document.createElement("div");
        bullet.classList.add('bullet');
        let playerRotation = getRotationDegrees(player);
        let playerCenterX = playerRect.left + player.offsetWidth / 2;
        let playerCenterY = playerRect.top + player.offsetHeight / 2;
        let bulletOffset = 20;
        let bulletX = playerCenterX + bulletOffset * Math.cos(degreesToRadians(playerRotation));
        let bulletY = playerCenterY + bulletOffset * Math.sin(degreesToRadians(playerRotation));
        bullet.style.left = bulletX + 'px';
        bullet.style.top = bulletY + 'px';
        document.querySelector('.main_field').appendChild(bullet);
        moveBullet(bullet, playerRotation);
    })

    const getRotationDegrees = (element) => {
        let style = window.getComputedStyle(element);
        let transform = style.getPropertyValue('transform');
        if (transform && transform !== 'none') {
            let matrix = transform.split('(')[1].split(')')[0].split(',');
            let angle = Math.round(Math.atan2(matrix[1], matrix[0]) * (180 / Math.PI));
            return angle >= 0 ? angle : angle + 360;
        }
        return 0;
    }

    const degreesToRadians = (degrees) => {
        return degrees * Math.PI / 180;
    }

    const moveBullet = (bullet, rotation) => {
        const step = 5;

        const frame = () => {
            const bulletRect = bullet.getBoundingClientRect();
            let bulletX = bulletRect.left;
            let bulletY = bulletRect.top;

            bulletX += step * Math.cos(degreesToRadians(rotation));
            bulletY += step * Math.sin(degreesToRadians(rotation));

            bullet.style.left = bulletX + 'px';
            bullet.style.top = bulletY + 'px';

            if (bulletX < 0 || bulletY < 0 || bulletX > window.innerWidth || bulletY > window.innerHeight) {
                clearInterval(id);
                bullet.remove();
            }
        };

        const id = setInterval(frame, 10);
    }
});