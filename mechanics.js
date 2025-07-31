window.onload = function() {
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');

    // Load background image
    const caveBackground = new Image();
    caveBackground.src = 'sprites/background.png';

    // Sound effects
    const soundWalk = new Audio('sounds/walking.mp3');
    soundWalk.volume = 0.2;
    soundWalk.playbackRate = 1.5;
    const soundJump = new Audio('sounds/jump.wav');
    const soundCrouch = new Audio('sounds/crouch.wav');
    const soundBackground = new Audio('sounds/background.wav');
    soundBackground.loop = true;
    soundBackground.volume = 0.5;
    soundBackground.play();

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
    playerImgRight.src = 'sprites/player.png';
    const playerImgLeft = new Image();
    playerImgLeft.src = 'sprites/playerLeft.png';
    const playerImgJumpRight = new Image();
    playerImgJumpRight.src = 'sprites/jump.png';
    const playerImgJumpLeft = new Image();
    playerImgJumpLeft.src = 'sprites/jumpLeft.png';
    const playerImgCrouchRight = new Image();
    playerImgCrouchRight.src = 'sprites/crouchRight.png';
    const playerImgCrouchLeft = new Image();
    playerImgCrouchLeft.src = 'sprites/crouchLeft.png';
    //walking cycle sprites
    const playerWalk1Right=new Image();
    playerWalk1Right.src='sprites/walking/walk1Right.png';
    const playerWalk2Right=new Image();
    playerWalk2Right.src='sprites/walking/walk2Right.png';
    const playerWalk1Left=new Image();
    playerWalk1Left.src='sprites/walking/walk1Left.png';
    const playerWalk2Left=new Image();
    playerWalk2Left.src='sprites/walking/walk2Left.png';

    let facing = 'right'; // 'left' or 'right'
    let jumping = false;
    let wWasPressed = false;
    let crouching = false;
    let walking = false;
    let walkFrame = 0;
    const walkFrameDelay = 10;

    // Platforms array (add more platforms easily)
    const platforms = [
        { x: 0, y: canvas.height - 20, width: canvas.width, height: 20 }, // ground
        { x: 200, y: canvas.height - 150, width: 150, height: 20 },
        { x: 400, y: canvas.height - 200, width: 200, height: 20 }
    ];

    // Load spike images
    const spikeImgSmall = new Image();
    spikeImgSmall.src = 'sprites/Spikes.png'; // 1:1 ratio
    const spikeImgBig = new Image();
    spikeImgBig.src = 'sprites/SpikesLong.png';   // 4:1 ratio

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
        if (key === ' ') {
            e.preventDefault();
            wWasPressed = true;
            if (player.grounded && !crouching) {
                crouching = true;
                if (soundCrouch) {
                    soundCrouch.currentTime = 0;
                    soundCrouch.play();
                }
            }
        }
        if (key === 'w') {
            e.preventDefault();
            wWasPressed = true;
            if (player.grounded && !crouching) {
                crouching = true;
                if (soundCrouch) {
                    soundCrouch.currentTime = 0;
                    soundCrouch.play();
                }
            }
        }
    });

    document.addEventListener('keyup', (e) => {
        const key = e.key.toLowerCase();
        keys[key] = false;
        if ((e.code === 'Space' || key === 'w') && wWasPressed && player.grounded) {
            e.preventDefault();
            if (crouching) {
                crouching = false;
            }
            player.velY = flipSquare.flipped ? player.jumpPower : -player.jumpPower;
            player.grounded = false;
            jumping = true;
            if (soundJump) {
                soundJump.currentTime = 0;
                soundJump.play();
            }
            wWasPressed = false;
        }
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
        if ((keys['a'] || keys['d']) && player.grounded) {
            walking = true;
            if (soundWalk && soundWalk.paused) {
                soundWalk.currentTime = 0;
                soundWalk.play();
            }
        } else {
            walking = false;
            if (soundWalk && !soundWalk.paused) {
                soundWalk.pause();
                soundWalk.currentTime = 0;
            }
        }
        if (keys['a']) {
            player.velX = -player.speed;
        }
        if (keys['d']) {
            player.velX = player.speed;
        }

        // Walking animation frame update
        if (walking) {
            walkFrame++;
            if (walkFrame >= walkFrameDelay * 2) {
                walkFrame = 0;
            }
        } else {
            walkFrame = 0;
        }

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
                flipSquare.flipped = false;
                jumping = false;
                crouching = false;
            }
        }

        // Flip square collision
        if (checkCollision(player, flipSquare)) {
            flipSquare.flipped = !flipSquare.flipped;
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw background
        if (caveBackground.complete && caveBackground.naturalWidth !== 0) {
            ctx.drawImage(caveBackground, 0, 0, canvas.width, canvas.height);
        }

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
        if (walking) {
            if (facing === 'left') {
                imgToDraw = (walkFrame < walkFrameDelay) ? playerWalk1Left : playerWalk2Left;
            } else {
                imgToDraw = (walkFrame < walkFrameDelay) ? playerWalk1Right : playerWalk2Right;
            }
        } else if (jumping) {
            imgToDraw = (facing === 'left') ? playerImgJumpLeft : playerImgJumpRight;
        } else if (crouching) {
            imgToDraw = (facing === 'left') ? playerImgCrouchLeft : playerImgCrouchRight;
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
