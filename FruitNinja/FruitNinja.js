// Getting canvas using DOM
const canvas = document.getElementById('canvas1');

// Taking context of canvas
const tool = canvas.getContext('2d');

// Setting width and height of canvas
canvas.width = 800;
canvas.height = 500;

// Score and life
let score = 0;
let life = 10;

// Highrst score till now
let record = 0;

// Speed of watermelons coming upwards
let gameFrame = 0;

// Variable used to control the amount of watermelons coming upside
let frameSpeed = 100;

// Create mouse object and set its initial positon in between the canvas
const mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    click: false
}

// Getting canvas position using this following function
let canvasPosition = canvas.getBoundingClientRect();

// Adding event on mouse down and getting the position of cursor
canvas.addEventListener('mousedown', function(event){
    mouse.click = true;
    mouse.x = event.x - canvasPosition.left;
    mouse.y = event.y - canvasPosition.top;
})

// Adding event on mouse up  and setting click as false
canvas.addEventListener('mouseup', function(event){
    mouse.click = false;
})

// Take image of knife
const playerImage = new Image();
playerImage.src = 'Images/cleaver-knife.png';

// Player class
class Player{

    // Set x position y position Initially and set radius
    // Sprite width and sprite height will be taken according to the image
    constructor() {
        this.x = canvas.width;
        this.y = canvas.height/2;
        this.radius = 50;
        this.spriteWidth = 498;
        this.spriteHeight = 469;
    }

    
    update(){
        // Difference between the current position of mouse at x-axis and the position of mouse where it is clicked
        const dx = this.x - mouse.x;

        // Difference between the current position of mouse at x-axis and the position of mouse where it is clicked
        const dy = this.y - mouse.y;

        // If current position of mouse and the fruit position is not equal at x-axis
        // Then moving current position to the position where you clicked the mouse
        // This division with 5 will make its speed low
        if(mouse.x != this.x){
            this.x-= dx/5;
        }

        if(mouse.y != this.y){
            this.y-= dy/5;
        }
    }

    draw(){
        // If mouse is clicked somewhere then it will draw a line between previous and current positon of mouse
        if(mouse.click) {
            tool.lineWidth = 0.2;
            tool.beginPath();
            tool.moveTo(this.x, this.y);
            tool.lineTo(mouse.x, mouse.y);
            tool.stroke();
        }

        // Drawing image of knife
        tool.drawImage(playerImage, 0, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.spriteWidth/4, this.spriteHeight/4);
    }
}

// Creating player object
const player = new Player();

const fruitsArray = [];
const fruits = new Image();
fruits.src = 'Images/watermelon.png';
class Fruits{

    // Properties of every fruit
    constructor(){
        // Random position on x-axis
        this.x = Math.random() * canvas.width;

        // In starting y should be greater then canvas's height so that fruits came put from bottom
        this.y = canvas.height +100;

        // setting radius as 50
        this.radius = 50;

        // Setting speed pf fruits as 1 in starting
        this.speed = 1;

        // distance is used to update the distance between knife and fruit
        this.distance;

        // counted is used to count the score
        this.counted = false;
        
        // set sprite width and height
        this.spriteWidth = 91;
        this.spriteHeight = 74;
    }

    update(){
        // y should be decreased according to the speed of fruits
        this.y -= this.speed;

        // Calculate distance at x axis between fruits current position and player(knife) current position
        const dx = this.x - player.x;

        // Calculate distance at y axis between fruits current position and player(knife) current position
        const dy = this.y - player.y;

        // Calculating distance using pythagouras theorem
        this.distance = Math.sqrt(dx*dx + dy*dy);
    }

    draw(){
        // Draw watermelon's image
        tool.drawImage(fruits, 0, 0, this.spriteWidth, this.spriteHeight, this.x - 68, this.y - 68, this.spriteWidth*1.5, this.spriteHeight*1.5);
    }
}

function handleFruits(){
    // Push bubbles according to the frameSpeed and gameFrames
    if(gameFrame % frameSpeed == 0){
        fruitsArray.push(new Fruits());
    }

    // Everytime update every fruit and pop out those fruit whose y becomes lesser than zero
    for(let i=0; i < fruitsArray.length; i++){
        fruitsArray[i].update();
        fruitsArray[i].draw();
        if(fruitsArray[i].y < 0){
            life--;
            if(life <= 0){
                let boomAudio = document.getElementById('boomAudio');
                boomAudio.play();
                return true;
            }
            fruitsArray.splice(i, 1);
        }
    }


    for(let i=0; i < fruitsArray.length; i++){
        // Check if ur knife and fruit is collided or not
        // If colloded then increase the score by 1 and pop that element out
        if(fruitsArray[i].distance < fruitsArray[i].radius + player.radius){
            if(!fruitsArray[i].counted){
                let splatterAudio = document.getElementById('splatterAudio');
                splatterAudio.play();
                score++;
                fruitsArray[i].counted = true;
                fruitsArray.splice(i, 1);
            }
        }
    }
}

// Setting gradient color for score
const gradient = tool.createLinearGradient(0, 0, 0, 70);
gradient.addColorStop('0.4', '#fff');
gradient.addColorStop('0.5', '#000');
gradient.addColorStop('0.55', '#4040ff');
gradient.addColorStop('0.6', '#000');
gradient.addColorStop('0.9', '#fff');

// Animation loop
function animate(){
    // Clear the canvas first
    tool.clearRect(0, 0, canvas.width, canvas.height);

    // Call update function of player
    player.update();

    // Call draw function of player
    player.draw();

    // handle the fruit
    handleFruits();

    // If this return true then there are no  more lifes left
    if(handleFruits()){
        // Storing highest score in localStorage
        if(localStorage.getItem('FruitNinjaScore') < score){
            localStorage.setItem('FruitNinjaScore', score);
        }

        // Getting highest score from localStorage
        record = localStorage.getItem('FruitNinjaScore');

        // Giving message after the game overs
        tool.fillStyle = 'white';
        tool.font = "70px sans-serif";
        tool.strokeText('GAME OVER', 200, 200);
        tool.fillText('GAME OVER', 200, 200);
        tool.font = '30px sans-serif';
        tool.strokeText('SCORE: ' + score, 200, 250);
        tool.fillText('SCORE: ' + score, 200, 250);
        tool.strokeText('RECORD: ' + record, 200, 290);
        tool.fillText('RECORD: ' + record, 200, 290);
        tool.strokeText('PRESS F5 TO RESTART!!', 200, 330);
        tool.fillText('PRESS F5 TO RESTART!!', 200, 330);   
        return;
    }

    // Show score and life on board
    tool.font = '70px sans-serif';
    tool.fillStyle = gradient;
    tool.strokeText(score, 10, 50);
    tool.fillText(score, 10, 50);

    tool.strokeText(life, 700, 50);
    tool.fillText(life, 700, 50);

    // Change the no. of watermelons coming according to score
    if(score >= 25){
        if(score >= 25 && score < 40){
            frameSpeed = 60;
        }else if(score >= 40 && score < 70){
            frameSpeed = 40;
        }else{
            frameSpeed = 20;
        }
    }

    // Increase te gameFrame each time with which we can mange the watermelons
    gameFrame++;

    // Play the title song for the game
    let mainAudio = document.getElementById('mainAudio');
    mainAudio.play();

    // Call animate function recursively
    requestAnimationFrame(animate);
}

// OPENING TEXT 
tool.font = "40px sans-serif";
tool.fillStyle = "white";
tool.fillText('PRESS "SPACE" TO START', 150, 200);
tool.font = "20px sans-serif";
tool.fillText('TIP : ', 150, 235);
tool.fillText('Click on fruit when you see it.', 200, 235);

// Event listener for space
window.addEventListener('keypress', function(e){
    if(e.keyCode === 32){
        animate();
    }
})