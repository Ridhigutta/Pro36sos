var dogImg,happyDog,database,foodS,foodStock,dog,milk;
var feed,addFood,fedTime,lastFed,foodObj,addFoods;
var gameState,changeGameState, readGameState;
var bedroom, garden, washroom;

function preload()
{
dogImg=loadImage("images/dogImg.png");
happyDog=loadImage("images/dogImg1.png");

bedroom=loadImage("images/Bed Room.png");
garden=loadImage("images/Garden.png");
washroom=loadImage("images/Wash Room.png");
}

function setup() {
createCanvas(1000, 500);
database=firebase.database();

foodObj= new Food();

dog=createSprite(850,250,2,40)
dog.addImage(dogImg)
dog.scale=0.25;

foodStock=database.ref("Food")
foodStock.on("value",readStock)

feed=createButton("Feed the dog");
feed.position(700,95);
feed.mousePressed(feedDog);

addFood=createButton("Add Food");
addFood.position(800,95);
addFood.mousePressed(addFoods);

readGameState=database.ref('gameState');
readGameState.on("value", function(data){
  gameState=data.val();
})
}


function draw() {  
background(46,139,87)
foodObj.display();
fedTime=database.ref('FeedTime');
fedTime.on("value",function(data){
  lastFed=data.val();
});

fill(0);

 currentTime=hour();
 if(currentTime==(lastFed+1)){
   update("Playing");
   foodObj.garden();
 }else if(currentTime==(lastFed+2)){
   update("Sleeping");
   foodObj.bedroom();
 }else if(currentTime>(lastfed+2)&&currentTime<=(lastFed+4)){
  update("Bathing");
  foodObj.washroom();
 }else{
  update("Hungry");
  foodObj.display();
 }

 if(gameState!="Hungry"){
   feed.hide();
   addFood.hide();
   dog.remove();
 }else{
   feed.show();
   addFood.show();
   dog.addImage(sadDog);
 }
  drawSprites();
 // text("Food Stock:"+foodS,20,20)
  
  
}

function readStock(data){
foodS=data.val();
foodObj.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(happyDog);

  //foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  if(foodObj.getFoodStock()<=0){
    foodObj.updateFoodStock(foodObj.getFoodStock()*0);
  }
  else{
    foodObj.updateFoodStock(foodObj.getFoodStock()-1);  
  }

  database.ref("/").update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  })
}