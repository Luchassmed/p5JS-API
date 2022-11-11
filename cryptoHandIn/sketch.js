let curr = '';
var api = 'https://api.coinstats.app/public/v1/coins/';
var myInput;
var button;
var timer = 0;
var coins;

var client;

var btcButton;
var ethButton;


function setup() {
 createCanvas(windowWidth, windowHeight);
  
 client = mqtt.connect(
    "wss://public:public@public.cloud.shiftr.io",
    {
      clientId: "UltraTest",
    }
  );
  
  client.on("connect", function () {
    console.log("connected!");
    client.subscribe("RUCCryptoPrice");
   });

  client.on("message", function (topic, message) {
     print(topic + ": " + message);
  });
  textSize(30);
  
 myInput = createInput();
 myInput.position(20, 30);
 button = createButton("submit");
 button.position(160, 30);
 button.mousePressed(drawInput);
  
  btcButton = createButton("Bitcoin");
  ethButton = createButton("Ethereum");
  usdtButton = createButton("Tether");
  bnbButton = createButton("Binance-coin");
  solButton = createButton("Solana");
  
  btcButton.position(300, 30);
  ethButton.position(300, 60);
  usdtButton.position(300, 90);
  bnbButton.position(300, 120);
  solButton.position(300, 150);
  
  btcButton.mousePressed(btcShow);
  ethButton.mousePressed(etcShow);
  usdtButton.mousePressed(usdtShow);
  bnbButton.mousePressed(bnbShow);
  solButton.mousePressed(solShow);
 
}

function gotData(data){
  
}

//------ Crypto buttons -------
function btcShow(){
  var api = 'https://api.coinstats.app/public/v1/coins/bitcoin';
  loadJSON(api, buttonText);
}

function etcShow(){
  var api = 'https://api.coinstats.app/public/v1/coins/ethereum';
  loadJSON(api, buttonText);
}

function usdtShow(){
  var api = 'https://api.coinstats.app/public/v1/coins/tether';
  loadJSON(api, buttonText);
}

function bnbShow(){
  var api = 'https://api.coinstats.app/public/v1/coins/binance-coin';
  loadJSON(api, buttonText);
}

function solShow(){
  var api = 'https://api.coinstats.app/public/v1/coins/solana';
  loadJSON(api, buttonText);
}

function buttonText(data){
  var priceChange = data.coin.priceChange1d;
  var arrowColor;
  
  clear();
  textSize(20);
  text("Price of currency: \n" + data.coin.price, 20, 80);
  text("Todays price change: \n" + data.coin.priceChange1d, 20, 140);
  
  
  if(priceChange < -10){
    priceChange = -9.90;
  }
  if(priceChange > 10){
    priceChange = 9.90;
  }
  if(priceChange > 0){
    arrowColor = 'green';
  }
  if(priceChange < 0){
    arrowColor = 'red';
  }
  
  print(priceChange);
  rect(20, 190, 200, 200);
  let v0 = createVector(40, 300);
  let v1 = createVector(160, - (priceChange * 10));
  drawArrow(v0, v1, arrowColor);
  
}
//------ End Buttons -------


function drawArrow(base, vec, myColor) {
  push();
  stroke(myColor);
  strokeWeight(3);
  //fill(myColor);
  translate(base.x, base.y);
  line(0, 0, vec.x, vec.y);
  rotate(vec.heading());
  let arrowSize = 7;
  translate(vec.mag() - arrowSize, 0);
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  pop();
  
}

function drawInput() {
  clear();
 
  var currenturl = api+encodeURI(myInput.value());
  print(currenturl)
   httpGet(currenturl , "json", false, function (response) {
     curr = myInput.value();
      coins = response;
   
         
     if (coins != undefined && coins.coin != undefined)
       {
         print(coins);
         textSize(20);
         text("The price of " + curr + " is: \n" + coins.coin.price, 20, 80);
         text("Todays price change: \n" + coins.coin.priceChange1d, 20, 140);
         client.publish("/CurrentToWatch", curr);
         client.publish("/RUCCryptoPrice", coins.coin.price.toString());
       }
     else 
       {
         text("The chosen cryptocurrency " + curr + " doesn't exist", 70, 150)
       }
  });
}


function draw() {
  
  if (coins != undefined && coins.coin != undefined)
       {
        if (millis() - timer > 2000) {

    timer = millis();
    client.publish("/RUCCryptoPrice", coins.coin.price.toString());
      
    }
  }
}

function keyPressed()
{
}