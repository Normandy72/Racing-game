var carPic = document.createElement("img");
var trackPics = [];

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

function  loadImageForTrackCode(trackCode, fileName){
    trackPics[trackCode] = document.createElement("img");
    beginLodingImage(trackPics[trackCode], fileName);
}

function loadImages(){
    var imageList = [{varName : carPic, theFile : "player1car.png"},                     
                     {trackType : TRACK_ROAD, theFile : "road.png"},
                     {trackType : TRACK_WALL, theFile : "wall.png"},
                     {trackType : TRACK_GOAL, theFile : "track_goal.png"},
                     {trackType : TRACK_TREE, theFile : "track_tree.png"},
                     {trackType : TRACK_FLAG, theFile : "track_flag.png"}];

    picToLoad = imageList.length;
    
    for(var i = 0; i < imageList.length; i++)
    {
        if(imageList[i].varName != undefined){
            beginLodingImage(imageList[i].varName, imageList[i].theFile);
        }
        else{
            loadImageForTrackCode(imageList[i].trackType, imageList[i].theFile);
        }        
    }
}