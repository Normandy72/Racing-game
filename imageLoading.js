var carPic = document.createElement("img");
var wallPic = document.createElement("img");
var roadPic = document.createElement("img");

var picToLoad = 3;

function countLoadedImagesAndLaunchIfReady(){
    picToLoad--;
    if(picToLoad == 0){
        imageLoadingDoneSoStartGame();
    }
}

function carImageLoad(){
    carPic.onload = countLoadedImagesAndLaunchIfready;
	carPic.src = "player1car.png";
}

function trackLoadImages(){
    wallPic.onload = countLoadedImagesAndLaunchIfready;
    roadPic.onload = countLoadedImagesAndLaunchIfready;
	wallPic.src = "wall.png";
	roadPic.src = "road.png";
}

function loadImages(){
    carImageLoad();
    trackLoadImages();
}