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

function beginLodingImage(imgVar, fileName){
    imgVar.onload =  countLoadedImagesAndLaunchIfReady;
	imgVar.src = fileName;
}

function loadImages(){
    beginLodingImage(carPic, "player1car.png");
    beginLodingImage(wallPic, "wall.png");
    beginLodingImage(roadPic, "road.png");
}