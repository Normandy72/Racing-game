// ----- ПЕРЕМЕННЫЕ -----
var canvas, canvasContext;

// положение шарика по оси Х и У
var ballX = 75;
var ballY = 75;

// кол-во пикселей для одного смещения по Х и У
var ballSpeedX = 5;
var ballSpeedY = 7;

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

    ballReset();
}

// функция, определяющая позицию курсора мыши
function updateMousePos(e){
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;

    mouseX = e.clientX - rect.left - root.scrollLeft;
    mouseY = e.clientY - rect.top - root.scrollTop;

    // cheat / hack to test ball in any position  (использовать для теста!)
    // ballX = mouseX;
    // ballY = mouseY;
    // ballSpeedX = 3;
    // ballSpeedY = -4;
}

// обновление 
function updateAll(){
    moveAll();
    drawAll();
}

// если мячик не попадает на манипулятор, то он снова оказывается в центре экрана
function ballReset(){
    for(var eachRow = 0; eachRow < TRACK_ROWS; eachRow++)
    {
        for(var eachCol = 0; eachCol < TRACK_COLS; eachCol++)
        {
            var arrayIndex = rowColToArrayIndex(eachCol, eachRow);
            if(trackGrid[arrayIndex] == 2)
            {
                trackGrid[arrayIndex] = 0;
                ballX = eachCol * TRACK_W + TRACK_W / 2;
                ballY = eachRow * TRACK_H + TRACK_H / 2;
            } 
        }
    }
}

// движение мячика
function ballMove(){
    // изменение положение шарика по оси Х каждый раз, когда холст обновляется
    ballX += ballSpeedX;

    if(ballX > canvas.width && ballSpeedX > 0.0)
    {
        ballSpeedX *= -1;
    }

    if(ballX < 0 && ballSpeedX < 0.0)
    {
        ballSpeedX *= -1;
    }

    // изменение положение шарика по оси Y каждый раз, когда холст обновляется
    ballY += ballSpeedY;

    if(ballY > canvas.height)
    {
        // если мячик вылетает из поля - он появляется снова в центре поля
        ballReset();
        // если мячик вылетает из поля - все блоки появляются снова
    }
 
    if(ballY < 0 && ballSpeedY < 0.0)
    {
        ballSpeedY *= -1;
    }
}

// вспомогательная функция
function isBallAtColRow(col, row)
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
function ballTrackHandeling(){
    var ballTrackCol = Math.floor(ballX / TRACK_W);
    var ballTrackRow = Math.floor(ballY / TRACK_H);
    var trackIndexUnderBall = rowColToArrayIndex(ballTrackCol, ballTrackRow);
    if(ballTrackCol >= 0 && ballTrackCol < TRACK_COLS && ballTrackRow >= 0 && ballTrackRow < TRACK_ROWS)
    {        
        if(isBallAtColRow(ballTrackCol, ballTrackRow))
        {                        
            var prevBallX = ballX - ballSpeedX;
            var prevBallY = ballY - ballSpeedY;
            var prevTrackCol = Math.floor(prevBallX / TRACK_W);
            var prevTrackRow = Math.floor(prevBallY / TRACK_H);

            var bothTestFailed = true;
            if(prevTrackCol != ballTrackCol)
            {
                // если нет блокирующего блока, то направление меняется
                if(isBallAtColRow(prevTrackCol, ballTrackRow) == false)
                {
                    ballSpeedX *= -1;
                    bothTestFailed = false;
                }                
            }  
            if(prevTrackRow != ballTrackRow)
            {
                if(isBallAtColRow(ballTrackCol, prevTrackRow) == false)
                {
                    ballSpeedY *= -1;
                    bothTestFailed = false;
                }                
            }
            
            // мячик меняет направление при удалении блоков наискосок
            if(bothTestFailed)
            {
                ballSpeedX *= -1;
                ballSpeedY *= -1;
            }
        }        
    }
}

// создаем все движения игры
function moveAll(){
    // ballMove();    
    ballTrackHandeling();
}

// создаем все элементы игры
function drawAll(){
    colorRect(0,0, canvas.width,canvas.height, 'black');    // очищаем экран
    colorCircle(ballX, ballY, 10, 'white');                 // рисуем мячик
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