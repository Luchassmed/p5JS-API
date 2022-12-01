var api = "https://api.coinstats.app/public/v1/coins/";
let curr = "";
var img;
var myInput;
var button;
var timer = 0;
var coins;
var binanceCoin = "binance coin";
var stopSpeech = false;
var btcButton;
var ethButton;
// Speech Object
let speech;
let speechCurr = "";

function setup() {
  createCanvas(windowWidth, 500);
  background(0);

  fill(255);
  textStyle(ITALIC);
  textSize(50);
  text("CryptoHub", 20, 60);

  // Create a Speech Recognition object with callback
  speechRec = new p5.SpeechRec("en-US", gotSpeech);
  // "Continuous recognition" (as opposed to one time only)
  let continuous = false;
  print(continuous);
  // If you want to try partial recognition (faster, less accurate)
  let interimResults = false;

  textSize(30);

  myInput = createInput();
  myInput.position(20, 80);
  button = createButton("Search");
  button.position(160, 80);
  button.mousePressed(drawInput);

  btcButton = createButton("Bitcoin");
  ethButton = createButton("Ethereum");
  usdtButton = createButton("Tether");
  bnbButton = createButton("Binance-coin");
  solButton = createButton("Solana");
  speechButton = createButton("Activate speech rec 🎤");

  btcButton.position(280, 80);
  ethButton.position(280, 110);
  usdtButton.position(280, 140);
  bnbButton.position(280, 170);
  solButton.position(280, 200);
  speechButton.position(280, 230);

  btcButton.mousePressed(btcShow);
  ethButton.mousePressed(etcShow);
  usdtButton.mousePressed(usdtShow);
  bnbButton.mousePressed(bnbShow);
  solButton.mousePressed(solShow);
  speechButton.mousePressed(activateSpeech);

  // Speech recognized event
  function gotSpeech() {
    // Get it as a string, you can also get JSON with more info
    console.log(speechRec);
    if (speechRec.resultValue) {
      speechCurr = speechRec.resultString;
      console.log(speechCurr);
      myInput.value(speechCurr);
      drawInput();
      stopSpeech = false;
      let col = color(255, 255, 255);
      speechButton.style("background-color", col);
    }
  }

  function activateSpeech() {
    if (stopSpeech == false) {
      stopSpeech = true;
      // This must come after setting the properties
      speechRec.start(continuous, interimResults);
    }
    let col = color(0, 255, 0);
    speechButton.style("background-color", col);
  }
}

//------ Crypto buttons -------
function btcShow() {
  var api = "https://api.coinstats.app/public/v1/coins/bitcoin";
  loadJSON(api, showCurrency);
}

function etcShow() {
  var api = "https://api.coinstats.app/public/v1/coins/ethereum";
  loadJSON(api, showCurrency);
}

function usdtShow() {
  var api = "https://api.coinstats.app/public/v1/coins/tether";
  loadJSON(api, showCurrency);
}

function bnbShow() {
  var api = "https://api.coinstats.app/public/v1/coins/binance-coin";
  loadJSON(api, showCurrency);
}

function solShow() {
  var api = "https://api.coinstats.app/public/v1/coins/solana";
  loadJSON(api, showCurrency);
}

function showCurrency(data) {
  var priceChange = data.coin.priceChange1d;
  var icon = data.coin.icon;
  var cryptoName = data.coin.id;
  var cryptoPrice = data.coin.price;
  var arrowColor;

  if (img != undefined) {
    img.remove();
  }
  img = createImg(icon);
  img.position(27, 380);

  clear();
  background(0);
  fill(255);
  textStyle(ITALIC);
  textSize(50);
  text("CryptoHub", 20, 60);
  textSize(20);
  text("Price of " + cryptoName + ":\n" + cryptoPrice, 20, 140);
  text("Todays price change: \n" + priceChange, 20, 200);

  if (priceChange < -10) {
    priceChange = -9.9;
  }
  if (priceChange > 10) {
    priceChange = 9.9;
  }
  if (priceChange > 0) {
    arrowColor = "green";
  }
  if (priceChange < 0) {
    arrowColor = "red";
  }
  if (priceChange == 0) {
    arrowColor = "grey";
  }

  print(priceChange);
  rect(20, 250, 200, 200);
  let v0 = createVector(40, 360);
  let v1 = createVector(160, -(priceChange * 10));
  drawArrow(v0, v1, arrowColor);
}
//------ End Buttons -------

function drawArrow(base, vec, myColor) {
  push();
  stroke(myColor);
  strokeWeight(3);
  translate(base.x, base.y);
  line(0, 0, vec.x, vec.y);
  rotate(vec.heading());
  let arrowSize = 7;
  translate(vec.mag() - arrowSize, 0);
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  pop();
}

function drawInput() {
  fill(255);
  curr = myInput.value().toLowerCase();
  if (curr == binanceCoin) {
    curr = "binance-coin";
  }

  var currenturl = api + encodeURI(curr);
  httpGet(currenturl, "json", function (response) {
    if (response != undefined && response.coin != undefined) {
      loadJSON(currenturl, showCurrency);
    } else {
      clear();
      background(0);
      fill(255);
      textStyle(ITALIC);
      textSize(50);
      text("CryptoHub", 20, 60);
      textSize(20);

      text("The chosen cryptocurrency:", 20, 140);
      text("'" + curr + "'" + " doesn't exist", 20, 165);
    }
    print(response);
  });
}
