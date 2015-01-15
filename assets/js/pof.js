
/*var canvas = document.getElementById("canvas");
var width = window.innerWidth;
var height = window.innerHeight;
var photos = new Array();
canvas.height = height;
canvas.width = width;
var ctx = canvas.getContext("2d");
function Photo(order, url){
    this.url = url;
    this.order = order;
    this.width = 50;
    this.height = 71;
    canvas.width = this.width*this.order;
}
Photo.prototype.draw = function(){
    var img = new Image();
    img.src = this.url;
    var photo = this;
    img.onload = function(){
        ctx.drawImage(this,photo.width*photo.order,height-photo.height,photo.width,photo.height);        
    };    
};

for(var i = 0; i < 50; i++){
    photos.push(new Photo(i,"./images/greenscreen/test.png"));
    photos[i].draw();
}*/
var nr = 6;
var grid = 20*Math.PI;
var width = window.innerWidth;
var height = window.innerHeight;
var functions = new Array();
functions.push(function(x){return 0});
functions.push(function(x){return Math.cos(1*x)*1/2*Math.PI; });
functions.push(function(x){return -Math.cos(1*x)*1/2*Math.PI; });
functions.push(function(x){return Math.cos(1/2*x)*1*Math.PI;; });
functions.push(function(x){return -Math.cos(1/2*x)*1*Math.PI;; });
functions.push(function(x){return Math.cos(1/3*x)*3/2*Math.PI;; });
functions.push(function(x){return -Math.cos(1/3*x)*3/2*Math.PI;; });
functions.push(function(x){return Math.cos(1/4*x)*2*Math.PI;; });
functions.push(function(x){return -Math.cos(1/4*x)*2*Math.PI;; });
functions.push(function(x){return Math.cos(1/5*x)*5/2*Math.PI;; });
functions.push(function(x){return -Math.cos(1/5*x)*5/2*Math.PI;; });
draw();

function draw() {
 var canvas = document.getElementById("canvas");
 canvas.height = height;
 canvas.width = width;
 if (null==canvas || !canvas.getContext) return;
    
 var axes={}, ctx=canvas.getContext("2d");
 drawGrid(ctx,"rgb(0,0,0)",1);
 axes.x0 = .5  // x0 pixels from left to x=0
 axes.y0 = 100*Math.PI+grid/2 // y0 pixels from top to y=0
 axes.scale = 40;                 // 40 pixels from x=0 to x=1
 axes.doNegativeX = false;

 showAxes(ctx,axes);
 for(var i = 0; i < nr*2-1; i++)
 {
     funGraph(ctx,axes,functions[i],"rgb(11,10*$i,11)",3); 
 }
}
function drawGrid (ctx ,color, thick){
    ctx.beginPath();
    ctx.lineWidth = thick;
    ctx.strokeStyle = color;
    for(var i = 0; i < width; i+=grid){
        ctx.moveTo(i,0);
        ctx.lineTo(i,height);
    }
    for(var i = 0; i < height; i+=grid){
        ctx.moveTo(0,i);
        ctx.lineTo(width,i);
    }
    ctx.stroke();
}
function funGraph (ctx,axes,func,color,thick) {
 var xx, yy, dx=1, x0=axes.x0, y0=axes.y0, scale=axes.scale;
 var iMax = Math.round((ctx.canvas.width-x0)/dx);
 var iMin = axes.doNegativeX ? Math.round(-x0/dx) : 0;
 ctx.beginPath();
 ctx.lineWidth = thick;
 ctx.strokeStyle = color;
 for (var i=iMin;i<=iMax;i++) {
  xx = dx*i; yy = scale*func(xx/scale);
  if (i==iMin) ctx.moveTo(x0+xx,y0-yy);
  else         ctx.lineTo(x0+xx,y0-yy);
 }
 ctx.stroke();

 for (var i=iMin;i<=iMax;i++) {
    xx = i; yy = scale*func(xx/scale);
    if(xx%Math.round(grid) == 0){
     var y = (y0-yy);
     var ceil = Math.ceil(y/grid)*grid;
     y = func(ceil);
     var test = xx/y;
     //ctx.fillRect(x0+xx+grid/6,Math.round((y0-yy-5)/grid)*grid,grid*2/3,grid*4/5);
    }    
 }
}

function showAxes(ctx,axes) {
 var x0=axes.x0, w=ctx.canvas.width;
 var y0=axes.y0, h=ctx.canvas.height;
 var xmin = axes.doNegativeX ? 0 : x0;
 ctx.beginPath();
 ctx.strokeStyle = "rgb(128,128,128)"; 
 ctx.moveTo(xmin,y0); ctx.lineTo(w,y0);  // X axis
 ctx.moveTo(x0,0);    ctx.lineTo(x0,h);  // Y axis
 ctx.stroke();
}