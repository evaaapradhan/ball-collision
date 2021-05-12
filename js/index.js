const canvas = document.querySelector('canvas');
const can = canvas.getContext('2d');

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
let circles;
 
function getDistance(x1,y1,x2,y2){ 
    var xDistance = x2 - x1;
    var yDistance = y2 - y1;

    return Math.hypot(xDistance, yDistance);
};
  
//  creating circles
class Circle {
    constructor(x, y, radius, color){
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.momentum = {
        x: Math.random()-0.5,
        y: Math.random()-0.5
    }
    this.mass = 0.09 * radius
    };

    draw = function(){
        can.beginPath();
        can.arc(this.x,this.y,this.radius,0,Math.PI*2,false)
        can.fillStyle = this.color
        can.fill()
        can.closePath();
    };

    move = function(){
        this.x += this.momentum.x;
        this.y += this.momentum.y;
    };

    collisionWithScreen = function(){
        if (this.x + this.radius >= canvas.width || this.x - this.radius <= 0)
            this.momentum.x = -this.momentum.x;
        if (this.y + this.radius >= canvas.height || this.y - this.radius <= 0)
            this.momentum.y = -this.momentum.y;
    };

    resolveCollision = function (anotherCircle){
        let collisionVector = { x: this.x - anotherCircle.x, y: this.y - anotherCircle.y };
        let distance = getDistance(this.x, this.y, anotherCircle.x, anotherCircle.y)
        let unitVector = {
          x: collisionVector.x / distance,
          y: collisionVector.y / distance,
        };
        let relativeVelocity = {
          x: this.momentum.x - anotherCircle.momentum.x,
          y: this.momentum.y - anotherCircle.momentum.y,
        };
        let speed = relativeVelocity.x * unitVector.x + relativeVelocity.y * unitVector.y;
        let impulse = (2 * speed) / (this.mass + anotherCircle.mass);
        this.momentum.x -= impulse * anotherCircle.mass * unitVector.x;
        this.momentum.y -= speed * anotherCircle.mass * unitVector.y;
        anotherCircle.momentum.x += speed * this.mass * unitVector.x;
        anotherCircle.momentum.y += speed * this.mass * unitVector.y;
    };
    
    collisionWithEachOther = function (circles){
        for (let i = 0; i < circles.length; i++) {
          if (this === circles[i]) continue;
          if (getDistance(this.x,this.y,circles[i].x,circles[i].y) - this.radius*2 < 0){
            this.resolveCollision(circles[i]);
        }
        }
    };


}

function randomNumberFromRange(min,max){

    return radius = Math.random() * (max - min) + min;
}

function RandomColor() {
   

        var r = Math.floor(Math.random() * 255);
        var g = Math.floor(Math.random() * 255);
        var b = Math.floor(Math.random() * 255);
    
        return `rgb(${r}, ${g}, ${b})`;
      
}

function randomPositionCircle(){
    var coordinates = {};
    coordinates.x = Math.random() * innerWidth;
    coordinates.y = Math.random() * innerHeight;

    return coordinates;
}

function init(){
    circles = []
    for (let i = 0; i < 90; i++ ){
        positionCoordinate = randomPositionCircle()
        x = positionCoordinate.x
        y = positionCoordinate.y
        var radius = randomNumberFromRange(10,15)
        var color = RandomColor();
        if (i !== 0){
            for (let j=0; j < circles.length; j++){
                if (getDistance(x,y,circles[j].x,circles[j].y) - radius*2 <0 ){
                    positionCoordinate = randomPositionCircle()
                    x = positionCoordinate.x
                    y = positionCoordinate.y
                    j = -1  //loop restart 
                }
            }
        }
        circles.push(new Circle(x,y,radius,color));
    }
}

function animate() {
    requestAnimationFrame(animate);
    can.clearRect(0, 0, canvas.width, canvas.height);
    circles.forEach(function(circle){
        circle.draw()
        circle.move()
        circle.collisionWithScreen()
        circle.collisionWithEachOther(circles)
    })
}

init()
animate()