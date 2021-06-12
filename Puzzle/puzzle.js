// Canvas element
let canvas = document.querySelector(".puzzle-canvas");

// Get canvas context
let ctx = canvas.getContext("2d");

// Replay button
let replayBtn = document.querySelector(".replay-btn");

// All puzzles
let allPuzzles = document.querySelectorAll(".image");

// Image container
let imgContainer = document.querySelector(".original-image-container");

// To check if game is restarted
let restart = 0;

// Empty is at 9 at first
let empty = 9;

// moves will be -1 initially
let moves = -1;

// used to clone puzzle
let container;

// check if image is drawn first time or not
let drawConstant = 0;

// Initial image array
let arr = [1,2,3,4,5,6,7,8,0];

// Shuffling function
function shuffle(array) {
    // Storing last idex as current index and starting while loop while currentIndex not equals to 0
    let currentIndex = array.length;


    while (0 !== currentIndex) {
        // Getting random index
        let randomIndex = Math.floor(Math.random() * currentIndex);

        // Subtracting currentIndex by 1
        currentIndex -= 1;

        // Swaooing currentIndex with random index
        let temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    //return shuffled array
    return array;
}

// shuffled image array
let shuffledArray = shuffle([1,2,3,4,5,6,7,8,0]);

// Get index of shuffled array which contains 0 and update the empty
for(let i=0; i<=8; i++){
    if(shuffledArray[i] == 0){
        empty = i+1;
    }
}

// Add event listeners to all Puzzles that on clicking on ne it will be selected
for(let i=0; i<allPuzzles.length; i++){
    allPuzzles[i].addEventListener("click", function(){
        container = allPuzzles[i].cloneNode();
        container.classList.remove("image");
        container.removeAttribute("style");
        container.classList.add("original-image");
        imgContainer.innerHTML = "";
        imgContainer.appendChild(container);
        restart = 0;
        empty = 9;
        moves =-1;
        drawConstant = 0;
        shuffledArray = shuffle([1,2,3,4,5,6,7,8,0]);
        for(let i=0; i<=8; i++){
            if(shuffledArray[i] == 0){
                empty = i+1;
            }
        }
        drawImageInCanvas(container);
    })
}



// If botha the arrays are equal then this won() will be called
function won(){
    let giveMessage = document.getElementById("message");
    giveMessage.innerHTML = "YOU WON THE GAME IN " + moves.toString() + " MOVES";
    giveMessage.style.display = "flex";
}

// Draw a image in canvas using this function
function drawImageInCanvas(container){
    moves++;
    let move = document.getElementById("moves");
    move.innerHTML = "MOVES: "+moves.toString();

    let flag = 0;
    if(restart == 1){
        let shuffledArray = shuffle([1,2,3,4,5,6,7,8,0]);
        for(let i=0; i<=8; i++){
            if(shuffledArray[i] == 0){
                empty = i+1;
            }
        }
        ctx.clearRect(0,0,450,450);
	    restart=0;
    }

    for(let i=0; i<9; i++){
        if(shuffledArray[i] != arr[i]){
            flag=1;
        }
    }
    for(let i=0; i< 3; i++){
        for(let j=0; j<3; j++){
            drawcomponent(i, j, container);
        }
    }

    if(flag == 0){
        won();
    }
}

// function will be called from drawImageInCanvas to draw images in canvas
function drawcomponent(x, y, container){
    let imageNumber = x + 3 * y;
    imageNumber = shuffledArray[imageNumber];
    let imageText = container.getAttribute("text")+imageNumber.toString();
    if(drawConstant == 0){
        if(imageNumber!=0){
            var img=document.getElementById(imageText);
            img.addEventListener("load", function(){
                var pat=ctx.createPattern(img,"repeat");
                ctx.fillStyle=pat;
                ctx.fillRect(100*x,50*y,100, 50);
            })
        }else{
            ctx.fillStyle="white";
            ctx.fillRect(100*x,50*y,100, 50);       
        }
    } else{
        if(imageNumber!=0){
            var img=document.getElementById(imageText);
            var pat=ctx.createPattern(img,"repeat");
            ctx.fillStyle=pat;
            ctx.fillRect(100*x,50*y,100, 50);
        }else{
            ctx.fillStyle="white";
            ctx.fillRect(100*x,50*y,100, 50);       
        }
    }
}

// Image which is just at bottom of empty will be swapped with empty box
function moveUp(){
    ctx.clearRect(0, 0, 450, 450);
    if(restart == 1){
        drawConstant=0;
        drawImageInCanvas(container);
        return;
    }

    if(empty == 9 || empty == 7 || empty == 8){
        moves--;
        drawConstant++;
        drawImageInCanvas(container);
    }else{
        let curr = empty;
        empty = empty+3;
        let next = empty;
        shuffledArray[curr-1] = shuffledArray[next-1];
        shuffledArray[next-1] = 0;
        drawConstant++;
        drawImageInCanvas(container);
        
    }
}

// Image which is just at top of empty will be swapped with empty box
function moveDown(){
    ctx.clearRect(0, 0, 100, 150);
    if(restart == 1){
        drawConstant=0;
        drawImageInCanvas(container);
        
        return;
    }

    if(empty == 1 || empty == 2 || empty == 3){
        moves--;
        drawConstant++;
        drawImageInCanvas(container);
        
    }else{
        let curr = empty;
        empty = empty-3;
        let next = empty;
        shuffledArray[curr-1] = shuffledArray[next-1];
        shuffledArray[next-1] = 0;
        drawConstant++;
        drawImageInCanvas(container);
    }
}

// Image which is just at left of empty will be swapped with empty box
function moveLeft(){
    ctx.clearRect(0, 0, 450, 450);
    if(restart == 1){
        drawConstant=0;
        drawImageInCanvas(container);
        return;
    }

    if(empty == 6 || empty == 9 || empty == 3){
        moves--;
        drawConstant++;
        drawImageInCanvas(container);
    }else{
        let curr = empty;
        empty = empty+1;
        let next = empty;
        shuffledArray[curr-1] = shuffledArray[next-1];
        shuffledArray[next-1] = 0;
        drawConstant++;
        drawImageInCanvas(container);
    }
}

// Image which is just at right of empty will be swapped with empty box
function moveRight(){
    ctx.clearRect(0, 0, 450, 450);

    if(restart == 1){
        drawConstant=0;
        drawImageInCanvas(container);
        return;
    }

    if(empty == 1 || empty == 4 || empty == 7){
        moves--;
        drawConstant++;
        drawImageInCanvas(container);
    }else{
        let curr = empty;
        empty = empty-1;
        let next = empty;
        shuffledArray[curr-1] = shuffledArray[next-1];
        shuffledArray[next-1] = 0;
        drawConstant++;
        drawImageInCanvas(container);
    }
}

// Add events to the array keys
window.addEventListener('keydown', function (e) {
    key = e.keyCode;
    if(key==37){
    	e.preventDefault();
    	moveLeft();
    }
    if(key==38){
    	e.preventDefault();
    	moveUp();
    }
    if(key==39){
    	e.preventDefault();
    	moveRight();
    }
    if(key==40){
    	e.preventDefault();
    	moveDown();
    }
    
});

// First image should be active on page load
allPuzzles[0].click();

// This will refreash the page to restart the game
replayBtn.addEventListener("click", function(){
    location.reload();
})

// https://www.seekpng.com/png/detail/23-237803_chota-bheem-chota-bheem-images-png.png