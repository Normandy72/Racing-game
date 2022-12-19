// ----- ПЕРЕМЕННЫЕ -----
var carPic = document.createElement("img");
var carPicLoaded = false;

var canvas, canvasContext;

// положение шарика по оси Х и У
var carX = 75;
var carY = 75;
var carAng = 0;

// кол-во пикселей для одного смещения по Х и У
var carSpeedX = 5;
var carSpeedY = 7;

// координаты курсора мыши
var mouseX = 0;
var mouseY = 0;

// задаем размеры блоков
const TRACK_W = 40;
const TRACK_H = 40;
const TRACK_GAP = 2;
const TRACK_COLS = 20;
const TRACK_ROWS = 15;

// рисуем поле
// 0 - пустое место, 1 - блок, 2 - начальное положение машинки
var trackGrid = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,
                 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1,
                 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1,
                 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1,
                 1, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1,
                 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
                 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
                 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
                 1, 0, 2, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1,
                 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1,
                 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1,
                 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1,
                 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

// ----- ФУНКЦИИ -----
window.onload = function(){
    // --- СОЗДАЕМ ХОЛСТ И КОНТЕКСТ ---
    // получаем холст через ID
    canvas = document.getElementById('gameCanvas');

    // создаем контекст в 2d
    canvasContext = canvas.getContext('2d');

    // кол-во обновлений холста
    var framesPerSecond = 30;

    // задаем интервал обновления холста
    setInterval(updateAll, 1000/framesPerSecond);

    // добавляем слушателя на движение мыши (чтобы манипулятор двигался при движении мыши)
    canvas.addEventListener('mousemove', updateMousePos);

    // только когда картинка загрузится, carPicLoaded изменится на true
    carPic.onload = function(){
        carPicLoaded = true;
    };

    carPic.src = "player1car.png";

    carReset();
}

// функция, определяющая позицию курсора мыши
function updateMousePos(e){
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;

    mouseX = e.clientX - rect.left - root.scrollLeft;
    mouseY = e.clientY - rect.top - root.scrollTop;
}

// обновление 
function updateAll(){
    moveAll();
    drawAll();
}

// если мячик не попадает на манипулятор, то он снова оказывается в центре экрана
function carReset(){
    for(var eachRow = 0; eachRow < TRACK_ROWS; eachRow++)
    {
        for(var eachCol = 0; eachCol < TRACK_COLS; eachCol++)
        {
            var arrayIndex = rowColToArrayIndex(eachCol, eachRow);
            if(trackGrid[arrayIndex] == 2)
            {
                trackGrid[arrayIndex] = 0;
                carX = eachCol * TRACK_W + TRACK_W / 2;
                carY = eachRow * TRACK_H + TRACK_H / 2;
            } 
        }
    }
}

// движение мячика
function carMove(){
    carAng += 0.02;
    
    if(carX > canvas.width && carSpeedX > 0.0)
    {
        carSpeedX *= -1;
    }

    if(carX < 0 && carSpeedX < 0.0)
    {
        carSpeedX *= -1;
    }

    if(carY > canvas.height)
    {
        // если мячик вылетает из поля - он появляется снова в центре поля
        carReset();
        // если мячик вылетает из поля - все блоки появляются снова
    }
 
    if(carY < 0 && carSpeedY < 0.0)
    {
        carSpeedY *= -1;
    }
}

// вспомогательная функция
function isCarAtColRow(col, row)
{
    if(col >= 0 && col < TRACK_COLS && row >= 0 && row < TRACK_ROWS)
    {
        var trackIndexUnderCoord = rowColToArrayIndex(col, row);
        return trackGrid[trackIndexUnderCoord] == 1;
    }
    else
    {
        return false;
    }    
}

// взаимодействие мячика и блоков
function carTrackHandeling(){
    var carTrackCol = Math.floor(carX / TRACK_W);
    var carTrackRow = Math.floor(carY / TRACK_H);
    var trackIndexUnderCar= rowColToArrayIndex(carTrackCol, carTrackRow);
    if(carTrackCol >= 0 && carTrackCol < TRACK_COLS && carTrackRow >= 0 && carTrackRow < TRACK_ROWS)
    {        
        if(isCarAtColRow(carTrackCol, carTrackRow))
        {                        
            var prevCarX = carX - carSpeedX;
            var prevCarY = carY - carSpeedY;
            var prevTrackCol = Math.floor(prevCarX / TRACK_W);
            var prevTrackRow = Math.floor(prevCarY / TRACK_H);

            var bothTestFailed = true;
            if(prevTrackCol != carTrackCol)
            {
                // если нет блокирующего блока, то направление меняется
                if(isCarAtColRow(prevTrackCol, carTrackRow) == false)
                {
                    carSpeedX *= -1;
                    bothTestFailed = false;
                }                
            }  
            if(prevTrackRow != carTrackRow)
            {
                if(isCarAtColRow(carTrackCol, prevTrackRow) == false)
                {
                    carSpeedY *= -1;
                    bothTestFailed = false;
                }                
            }
            
            // мячик меняет направление при удалении блоков наискосок
            if(bothTestFailed)
            {
                carSpeedX *= -1;
                carSpeedY *= -1;
            }
        }        
    }
}

// создаем все движения игры
function moveAll(){
    //ballMove();    
    carTrackHandeling();
}

// создаем все элементы игры
function drawAll(){
    colorRect(0,0, canvas.width,canvas.height, 'black');    // очищаем экран
    //colorCircle(ballX, ballY, 10, 'white');                 // рисуем мячик
    if(carPicLoaded){
        canvasContext.drawImage(carPic, carX - carPic.width / 2, carY - carPic.height / 2);
    }
    drawTracks();
}

// создание прямоугольников
function colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor){
    // окрашиваем холст в нужный цвет каждый раз при обновлении холста
    canvasContext.fillStyle = fillColor;
    // задаем положение и размеры холста 
    canvasContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
}

// создание шариков
function colorCircle(centerX,centerY, radius, fillColor){
    // --- СОЗДАЕМ ШАРИК ---
    // задаем ему цвет
    canvasContext.fillStyle = fillColor;   
    // задаем начало пути
    canvasContext.beginPath();   
    // создаем шарик (начальное положение top - ballX, left - ballY; радиус 10, начальный угол 0, конечный угол pi * 2, против часовой стрелки - true)
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);   
    // заполняем получившийся элемент
    canvasContext.fill();
}

// создание текста
function colorText(showWords, textX, textY, fillColor){
    canvasContext.fillStyle = fillColor;
    canvasContext.fillText(showWords, textX, textY);
}

// задаем порядковый номер каждому блоку
function rowColToArrayIndex(col, row){
   return col + TRACK_COLS * row;
}

// создаем блоки
function drawTracks(){
    for(var eachRow = 0; eachRow < TRACK_ROWS; eachRow++)
    {
        for(var eachCol = 0; eachCol < TRACK_COLS; eachCol++)
        {
            var arrayIndex = rowColToArrayIndex(eachCol, eachRow);
            if(trackGrid[arrayIndex] == 1)
            {
                colorRect(TRACK_W * eachCol, TRACK_H * eachRow, TRACK_W - TRACK_GAP, TRACK_H - TRACK_GAP, 'blue');
            } 
        }
    }
}