let puzzle = document.querySelector(".puzzle");
let fruitNinja = document.querySelector(".fruit-ninja");
let flappyBird = document.querySelector(".flappy-bird");

puzzle.addEventListener("click", function(){
    window.location.href = "./Puzzle/puzzle.html";
})

fruitNinja.addEventListener("click", function(){
    window.location.href = "./FruitNinja/FruitNinja.html";
})

flappyBird.addEventListener("click", function(){
    window.location.href = "./FlappyBird/FlappyBird.html";
})