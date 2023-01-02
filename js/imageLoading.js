var carPic = document.createElement("img");
var wallPic = document.createElement("img");
var roadPic = document.createElement("img");

var picToLoad = 0;

function countLoadedImagesAndLaunchIfReady(){
    picToLoad--;
    if(picToLoad == 0){
        imageLoadingDoneSoStartGame();
    }
}

function beginLodingImage(imgVar, fileName){
    imgVar.onload =  countLoadedImagesAndLaunchIfReady;
	imgVar.src = "images/" + fileName;
}

function loadImages(){
    var imageList = [{varName : carPic, theFile : "player1car.png"},
                     {varName : wallPic, theFile : "wall.png"},
                     {varName : roadPic, theFile : "road.png"}];

    picToLoad = imageList.length;
    
    for(var i = 0; i < imageList.length; i++)
    {
        beginLodingImage(imageList[i].varName, imageList[i].theFile);
    }
}