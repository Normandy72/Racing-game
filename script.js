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
const BRICK_W = 80;
const BRICK_H = 20;
const BRICK_GAP = 2;
const BRICK_COLS = 10;
const BRICK_ROWS = 14;

// массив блоков
var brickGrid = new Array(BRICK_COLS * BRICK_ROWS);

// кол-во исчезнувших блоков
var bricksLeft = 0;


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

    brickReset();
    ballReset();
}

// функция для заполнения массива
function brickReset(){
    bricksLeft = 0;
    // т.к. объявляет i за пределами циклов, значение этой переменной делится между двумя циклами (=> во втором можно не указывать)
    var i; 
    // первые 3 строки пустые
    for(i = 0; i < 3 * BRICK_COLS; i++)
    {
        brickGrid[i] = false;
    }
    // далее с четвертой строки создаются блоки
    for(; i < BRICK_COLS * BRICK_ROWS; i++)
    {
        // if(Math.random() < 0.5)
        // {
        //     brickGrid[i] = true;
        // }
        // else
        // {
        //     brickGrid[i] = false;
        // }  
        brickGrid[i] = true;
        bricksLeft++;
    }
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
    ballX = canvas.width/2;
    ballY = canvas.height/2;
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
        brickReset();
    }
 
    if(ballY < 0 && ballSpeedY < 0.0)
    {
        ballSpeedY *= -1;
    }
}

// вспомогательная функция
function isBallAtColRow(col, row)
{
    if(col >= 0 && col < BRICK_COLS && row >= 0 && row < BRICK_ROWS)
    {
        var brickIndexUnderCoord = rowColToArrayIndex(col, row);
        return brickGrid[brickIndexUnderCoord];
    }
    else
    {
        return false;
    }    
}

// взаимодействие мячика и блоков
function ballBrickHandeling(){
    var ballBrickCol = Math.floor(ballX / BRICK_W);
    var ballBrickRow = Math.floor(ballY / BRICK_H);
    var brickIndexUnderBall = rowColToArrayIndex(ballBrickCol, ballBrickRow);
    if(ballBrickCol >= 0 && ballBrickCol < BRICK_COLS && ballBrickRow >= 0 && ballBrickRow < BRICK_ROWS)
    {        
        if(isBallAtColRow(ballBrickCol, ballBrickRow))
        {            
            bricksLeft--;
            brickGrid[brickIndexUnderBall] = false;
            
            var prevBallX = ballX - ballSpeedX;
            var prevBallY = ballY - ballSpeedY;
            var prevBrickCol = Math.floor(prevBallX / BRICK_W);
            var prevBrickRow = Math.floor(prevBallY / BRICK_H);

            var bothTestFailed = true;
            if(prevBrickCol != ballBrickCol)
            {
                // если нет блокирующего блока, то направление меняется
                if(isBallAtColRow(prevBrickCol, ballBrickRow) == false)
                {
                    ballSpeedX *= -1;
                    bothTestFailed = false;
                }                
            }  
            if(prevBrickRow != ballBrickRow)
            {
                if(isBallAtColRow(ballBrickCol, prevBrickRow) == false)
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
    ballMove();    
    ballBrickHandeling();
}

// создаем все элементы игры
function drawAll(){
    colorRect(0,0, canvas.width,canvas.height, 'black');    // очищаем экран
    colorCircle(ballX, ballY, 10, 'white');                 // рисуем мячик
    drawBricks();

    // код, который позволяет увидеть номер столбца, строки и номер блока
    // var mouseBrickCol = Math.floor(mouseX / BRICK_W);
    // var mouseBrickRow = Math.floor(mouseY / BRICK_H);
    // var brickIndexUnderMouse = rowColToArrayIndex(mouseBrickCol, mouseBrickRow);
    // colorText(mouseBrickCol + ", " + mouseBrickRow + ": " + brickIndexUnderMouse, mouseX, mouseY, 'yellow');    // создаем текст с позицией курсора мыши

    // исчезновение блока при наведении курсора
    // if(brickIndexUnderMouse >= 0 && brickIndexUnderMouse < BRICK_COLS * BRICK_ROWS)
    // {
    //     brickGrid[brickIndexUnderMouse] = false;
    // }
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
   return col + BRICK_COLS * row;
}

// создаем блоки
function drawBricks(){
    for(var eachRow = 0; eachRow < BRICK_ROWS; eachRow++)
    {
        for(var eachCol = 0; eachCol < BRICK_COLS; eachCol++)
        {
            var arrayIndex = rowColToArrayIndex(eachCol, eachRow);
            if(brickGrid[arrayIndex])
            {
                colorRect(BRICK_W * eachCol, BRICK_H * eachRow, BRICK_W - BRICK_GAP, BRICK_H - BRICK_GAP, 'blue');
            } 
        }
    }
}