// Getting canvas element
const canvas = document.getElementById('canvas1');

// Getting context of canvas element
const ctx = canvas.getContext("2d");

// Setting height and width
canvas.width = 1000;
canvas.height = 600;

// spacePressed =  to check if spce is pressed or not
let spacePressed = false;

// angle = to vibrate thr bird using Math.sin() according to sin curve
let angle = 0;

// Counts the frames of animation occured
let frame = 0;

// Count of obstacle passed
let score = 0;

// speed by which obstacles are pushed towards left in canvas
let gameSpeed = 2;

// Frame numbers pn which obstacles can be made
let frameSpeed = 50;

// Change color of obstacles according to you
let ObstacleColor = "#e08d43";

// Creating image for dragon sprite used in game
const dragonSprite = new Image();
dragonSprite.src = 'Images/dragon.png';

// dragon class
class Dragon{

    // Dragon class constructor
    constructor(){
        // Initial position of dragon when game starts
        this.x = 150;
        this.y = 200;

        // Intial velocity of Dragon when game starts
        this.vy = 0;

        // Original width and height of one frame of dragon in sprite sheet
        this.originalWidth = 191;
        this.originalHeight = 136;

        // Setting width and height of the dragon frame according to our canvas
        this.width = this.originalWidth/20;
        this.height = this.originalHeight/20;

        // Weight of the dragon
        this.weight = 1;

        // To change the frame of dragon images continuously;
        this.frameX = 0;
    }

    update(){
        // Curve is used to vibrate dragon at its position
        let curve = Math.sin(angle) * 20;

        // if y becomes greater then canvas height then dragon will fall down
        // Dragon will be out of the canvas height
        // So at thet time we shoukd set y as canvas height
        // And velocity of y will be 0 so that it will not fall
        if(this.y > canvas.height - (this.height * 3) + curve){
            this.y = canvas.height - (this.height * 3) + curve;
            this.vy = 0;
        }else{
            // Here adding weight to velocity of y
            this.vy += this.weight;

            // So vy will start from 1 and then it become bigger and bigger
            // So to make it more manageable we will multiply it with 0.9
            this.vy *= 0.9;

            // Adding vy to y to increase v and make bird fall
            this.y += this.vy;
        }

        // If y becomes less than its own height and then dragon will go up and up
        // and goes out of the canvas so we when y becomes less than its ownheight
        // We will reassign the height to y and set velocity of y to 0
        if(this.y < 0 + this.height){
            this.y = 0 + this.height;
            this.vy = 0;
        }

        // Whenever space is pressed and y is greater than dragon's height and call flap()
        if(spacePressed && this.y > this.height * 3){
            this.flap();
        }
    }

    draw(){
        // Draw dragon's image
        ctx.drawImage(dragonSprite, this.frameX * this.originalWidth, 
        0, this.originalWidth, this.originalHeight, this.x - 60, 
        this.y - 16, this.width * 10, this.height * 10);
    }

    flap(){
        // Decreasing velocity of y by 2 so that y will be decreased and dragon will move upwards 
        this.vy -= 2;

        // Changing frames of dragon will flapping 
        if(this.frameX >= 2)
            this.frameX = 0;
        if(this.frameX%3 === 0)
            this.frameX++;
    }
}

// Creating dragon class object
const dragon = new Dragon();


const obstaclesArray = [];
class Obstacle {
    constructor() {

        // Cnavas is divided by 3 to make have space between both top and bottom obstacles
        // Height of top obstacles
        this.top = (Math.random() * canvas.height /3) + 20;

        // Height of bottom obstacles
        this.bottom = (Math.random() * canvas.height/3) + 20;

        // Position on the x-axis at starting
        this.x = canvas.width;

        // Determine how wide are obstacles are
        this.width = 50;

        // Color of obstacles
        this.color = ObstacleColor;

        // Counted or not as the score
        this.counted = false;
    }

    // Draw the obstacle
    draw(){

        // Fill the particular color 
        ctx.fillStyle = this.color;

        // Top obstacles will be drawn
        ctx.fillRect(this.x, 0, this.width, this.top);

        // Bottom obstacles will be drawn
        ctx.fillRect(this.x, canvas.height - this.bottom, this.width, this.bottom);
    }

    // This method will push obstacles to the left
    // Because our game is scrolling towards right
    update(){
        // For every frame obstacles will move towards left
        this.x -= gameSpeed;

        // If the obstacle is not counted and dragon passed it
        // Then it will be marked counted here and score will be increased
        if(!this.counted && this.x < dragon.x){
            score++;
            this.counted = true;
        }

        // Draw the obstacle
        this.draw();    
    }
}

function handleObstacles(){

    // After every 50 frames of aniation a new obstacle will be created and pushed into the obstaclesArray
    if(frame % frameSpeed === 0){
        obstaclesArray.unshift(new Obstacle());
    }

    // Update() is called for every obstacle in each frame
    for(let i=0 ;i < obstaclesArray.length; i++){
        obstaclesArray[i].update();
    }

    // If obstaclesArray length becomes greater then 20 then pop first obstacle which is passed already
    if(obstaclesArray.length > 20){
        obstaclesArray.pop(obstaclesArray[0]);
    }
}



const background = new Image();
background.src = 'Images/BG.png';
const BG = {
    // There will be two position of background image

    // At x1 there will be first background
    x1: 0,

    // At x2 there will be second background hide behind the right edge of the canvas
    x2: canvas.width,

    // y here is the vertical position
    y: 0,

    // Set width and height for background
    width: canvas.width,
    height: canvas.height
}

function handleBackground(){
    // If BG.x1 is completely hide behind the left edge of the canvas
    // Then quickly hide it behind the right edge of the camnvas 
    // Otherwise push it towards left according to gameSpeed
    if(BG.x1 <= -BG.width + gameSpeed){
        BG.x1 = BG.width;
        // Change gamespeed, framespeed and background after some score achieved
        if(score > 10){
            if(score > 10 && score <= 50){
                background.src = 'Images/BG-1.png';
                gameSpeed = 5;
                frameSpeed = 40;
                ObstacleColor = "white";
            }else if(score > 50 && score <= 100){
                background.src = 'Images/BG-2.png';
                gameSpeed = 10;
                frameSpeed = 40;
                ObstacleColor = "#421505";
            }else{
                background.src = 'Images/BG-3.png';
                gameSpeed = 20;
                frameSpeed = 30;
                ObstacleColor = "#2e2b2a";
            }
        }
    }else{
        BG.x1 -= gameSpeed;
    }

    // If BG.x2 is completely hide behind the left edge of the canvas
    // Then quickly hide it behind the right edge of the camnvas 
    // Otherwise push it towards left according to gameSpeed
    if(BG.x2 <= -BG.width + gameSpeed){
        BG.x2 = BG.width;
        // Change gamespeed, framespeed and background after some score achieved
        if(score > 10){
            if(score > 10 && score <= 50){
                background.src = 'Images/BG-1.png';
                gameSpeed = 5;
                frameSpeed = 40;
                ObstacleColor = "white";
            }else if(score > 50 && score <= 100){
                background.src = 'Images/BG-2.png';
                gameSpeed = 10;
                frameSpeed = 40;
                ObstacleColor = "#421505";
            }else{
                background.src = 'Images/BG-3.png';
                gameSpeed = 20;
                frameSpeed = 30;
                ObstacleColor = "#2e2b2a";
            }
        }
    }else{
        BG.x2 -= gameSpeed;
    }

    // Draw both images
    ctx.drawImage(background, BG.x1, BG.y, BG.width, BG.height);
    ctx.drawImage(background, BG.x2, BG.y, BG.width, BG.height);
}

// Setting gradient color for score
const gradient = ctx.createLinearGradient(0, 0, 0, 70);
gradient.addColorStop('0.4', '#fff');
gradient.addColorStop('0.5', '#000');
gradient.addColorStop('0.55', '#4040ff');
gradient.addColorStop('0.6', '#000');
gradient.addColorStop('0.9', '#fff');

// Animation loop
function animate() {
    // clearing the canvas
    ctx.clearRect(0,0, canvas.width, canvas.height);

    // This will set the background
    handleBackground();

    // This will set the obstacles 
    handleObstacles();

    // Calling dragon class update()
    dragon.update();

    // Calling dragon class draw()
    dragon.draw();

    // Fill the text stylin canvas with gradient declared above
    ctx.fillStyle = gradient;

    // Setting font size and style
    ctx.font = '90px Georgia';

    // Writing the text on canvas
    ctx.fillText(score, 450, 70);
    
    // Calling handleCollisions()
    handleCollision();

    // If it returns true then freeze the game and show gameOver message
    if(handleCollision()){
        // Get and set highest score in localStorage
        if(localStorage.getItem('score') < score){
            localStorage.setItem('score', score);
        }
        console.log(localStorage.getItem('score'));
        ctx.font = '70px sans-serif';
        ctx.fillText('GAME OVER', 300, 300);
        ctx.font = '20px sans-serif';
        ctx.fillText('YOUR SCORE : ' + score, 400, 350);
        ctx.fillText('RECORD : ' + localStorage.getItem('score'), 400, 380);
        ctx.fillText('PRESS F5 TO RESTART', 400, 410);
        return;
    }

    // Background Audio
    let mainAudio = document.getElementById("mainAudio");
    mainAudio.play();

    // Angle will always be increased each frame so that vibration of the dragon will be maintained
    angle += 0.12;

    // Frame increased every time
    frame++;

    // Call this function recursively
    requestAnimationFrame(animate);
}

window.addEventListener('keydown', function(e){
    if(e.code === "Space"){
        spacePressed = true;      
    }    
});

window.addEventListener('keyup', function(e){
    if(e.code === "Space"){
        spacePressed = false;
        dragon.frameX = 0;
    }
})

const bang = new Image();
bang.src = 'Images/bang.png';

// Collision detection
function handleCollision(){
    for(let i=0; i < obstaclesArray.length; i++){

        if(dragon.x < obstaclesArray[i].x + obstaclesArray[i].width && 
        dragon.x + dragon.width > obstaclesArray[i].x &&
        ((dragon.y < 0 + obstaclesArray[i].top && dragon.y + dragon.height > 0) 
        || (dragon.y > canvas.height -obstaclesArray[i].bottom && dragon.y + dragon.height < canvas.height))){
            
            // If collided then draw a bang image
            ctx.drawImage(bang, dragon.x, dragon.y, 50, 50);
            
            // Then return to freeze the game
            return true;
        }
    }
}

// OPENING TEXT 
ctx.font = "40px sans-serif";
ctx.fillStyle = "white";
ctx.fillText('PRESS "ENTER" TO START', 240, 160);
ctx.font = "30px sans-serif";
ctx.fillText('INSTRUCTIONS', 400, 220);
ctx.font = "20px sans-serif";
ctx.fillText('1. Press Space to fly.', 240, 260);
ctx.fillText("2. Don't get in contact with obstacles.", 240, 290);


// Event listener for enter
window.addEventListener('keypress', function(e){ 
    if(e.keyCode === 13){
        animate();
    }
})