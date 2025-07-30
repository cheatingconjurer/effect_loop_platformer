window.onload = function() {
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');

    // Spawn point
    const spawnPoint = { x: 100, y: canvas.height - 300 };

    // Player properties
    const player = {
        x: spawnPoint.x,
        y: spawnPoint.y,
        width: 100,
        height: 100,
        velX: 0,
        velY: 0,
        speed: 5,
        jumpPower: 15,
        grounded: false
    };

    // Load player images
    const playerImgRight = new Image();
    playerImgRight.src = 'playerCroright.png';
    const playerImgLeft = new Image();
    playerImgLeft.src = 'playerCroleft.png';
    const playerImgJump = new Image();
    playerImgJump.src = 'playerCrojump.png';

    let facing = 'right'; // 'left' or 'right'
    let jumping = false;
    let wWasPressed = false;
    let crouching = false;
    const normalHeight = 100;
    const crouchHeight = 70;

    // Platforms array (add more platforms easily)
    const platforms = [
        { x: 0, y: canvas.height - 20, width: canvas.width, height: 20 }, // ground
        { x: 200, y: canvas.height - 150, width: 150, height: 20 },
        { x: 400, y: canvas.height - 200, width: 200, height: 20 }
    ];

    // Load spike images
    const spikeImgSmall = new Image();
    spikeImgSmall.src = 'Spike-1.png'; // 1:1 ratio
    const spikeImgBig = new Image();
    spikeImgBig.src = 'Spike-2.png';     // 4:1 ratio

    // Spikes array (add more spikes easily)
    const spikes = [
        { x: 400, y: canvas.height - 60, width: 40, height: 40, type: 'small' },   // 1:1
        { x: 500, y: canvas.height - 60, width: 160, height: 40, type: 'big' },    // 4:1
        { x: 220, y: canvas.height - 190, width: 40, height: 40, type: 'small' }
    ];

    // Flip square at the end
    const flipSquare = {
        x: canvas.width - 80,
        y: canvas.height - 80,
        width: 60,
        height: 60,
        color: 'blue',
        flipped: false
    };

    const gravity = 0.7;
    const friction = 0.8;
    const keys = {};

    // Event listeners for key presses
    document.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase();
        keys[key] = true;
        if (key === 'a') facing = 'left';
        if (key === 'd') facing = 'right';
        if (key === 'w') {
            wWasPressed = true;
            // Crouch only if grounded and not already crouching
            if (player.grounded && !crouching) {
                crouching = true;
                player.y += normalHeight - crouchHeight;
                player.height = crouchHeight;
            }
        }
    });
    document.addEventListener('keyup', (e) => {
        const key = e.key.toLowerCase();
        keys[key] = false;
        if (key === 'w' && wWasPressed && player.grounded) {
            // Restore height before jump
            if (crouching) {
                player.y -= normalHeight - crouchHeight;
                player.height = normalHeight;
                crouching = false;
            }
            player.velY = flipSquare.flipped ? player.jumpPower : -player.jumpPower;
            player.grounded = false;
            jumping = true;
        }
        if (key === 'w') wWasPressed = false;
    });

    function checkCollision(a, b) {
        return (
            a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y
        );
    }

    function update() {
        // Left/Right movement
        if (keys['a']) player.velX = -player.speed;
        if (keys['d']) player.velX = player.speed;

        // Apply gravity (normal or flipped)
        player.velY += flipSquare.flipped ? -gravity : gravity;

        // Apply friction
        player.velX *= friction;

        // Update position
        player.x += player.velX;
        player.y += player.velY;

        // Platform collision
        player.grounded = false;
        for (const platform of platforms) {
            if (checkCollision(player, platform)) {
                if (!flipSquare.flipped) {
                    if (player.velY >= 0 && player.y + player.height - player.velY <= platform.y) {
                        player.y = platform.y - player.height;
                        player.velY = 0;
                        player.grounded = true;
                        jumping = false;
                    }
                } else {
                    if (player.velY <= 0 && player.y - player.velY >= platform.y + platform.height) {
                        player.y = platform.y + platform.height;
                        player.velY = 0;
                        player.grounded = true;
                        jumping = false;
                    }
                }
            }
        }

        // Wall collision
        if (player.x < 0) player.x = 0;
        if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

        // Roof collision
        if (!flipSquare.flipped) {
            if (player.y < 0) {
                player.y = 0;
                player.velY = 0;
            }
        } else {
            if (player.y + player.height > canvas.height) {
                player.y = canvas.height - player.height;
                player.velY = 0;
            }
        }

        // Spike collision
        for (const spike of spikes) {
            if (checkCollision(player, spike)) {
                player.x = spawnPoint.x;
                player.y = spawnPoint.y;
                player.velX = 0;
                player.velY = 0;
                flipSquare.flipped = false; // Reset flip on death
                jumping = false;
            }
        }

        // Flip square collision
        if (checkCollision(player, flipSquare)) {
            flipSquare.flipped = !flipSquare.flipped;
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw platforms
        ctx.fillStyle = 'green';
        for (const platform of platforms) {
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        }

        // Draw spikes (images)
        for (const spike of spikes) {
            let img = spike.type === 'big' ? spikeImgBig : spikeImgSmall;
            if (img.complete && img.naturalWidth !== 0) {
                ctx.drawImage(img, spike.x, spike.y, spike.width, spike.height);
            } else {
                // Fallback: draw triangle
                ctx.fillStyle = 'gray';
                ctx.beginPath();
                ctx.moveTo(spike.x, spike.y + spike.height);
                ctx.lineTo(spike.x + spike.width / 2, spike.y);
                ctx.lineTo(spike.x + spike.width, spike.y + spike.height);
                ctx.closePath();
                ctx.fill();
            }
        }

        // Draw flip square
        ctx.fillStyle = flipSquare.color;
        ctx.fillRect(flipSquare.x, flipSquare.y, flipSquare.width, flipSquare.height);

        // Draw player image based on state
        let imgToDraw;
        if (jumping) {
            imgToDraw = playerImgJump;
        } else if (facing === 'left') {
            imgToDraw = playerImgLeft;
        } else {
            imgToDraw = playerImgRight;
        }

        if (imgToDraw.complete && imgToDraw.naturalWidth !== 0) {
            ctx.drawImage(imgToDraw, player.x, player.y, player.width, player.height);
        } else {
            ctx.fillStyle = 'red';
            ctx.fillRect(player.x, player.y, player.width, player.height);
        }
    }

    function loop() {
        update();
        draw();
        requestAnimationFrame(loop);
    }

    loop();
};
