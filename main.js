// kwiik
// by walitam & h912 - do anything you want, just credit us please
/* versions:
done 0.1 : technical test
done 0.2 : buildings alpha (ex : press) 
done 0.3 : auto-kiwi generator (extractors), gamble system, golden kiwi, extractors, loading screen
upcoming 0.4 : achievements
*/

//Test

//jquery I'm sorry my fellow webdevs

$body = $("body");

// define variables
let saveMade = false;
let kiwis = 0;
let defaultKiwiMakeCount = 1;
let kiwiMakeCount = 1;
let pressCount = 0;
let pressPrice = 250;
let extractorCount = 0;
let extractorMakeCount = 5;
let extractorPrice = 15000;
let lds = localDataStorage("kwiikStorage");
let kiwiCounterText = document.getElementById("kiwiCounterText");
let pressCounterText = document.getElementById("pressCounterText");
let extractorCounterText = document.getElementById("extractorCounterText");
let makeKiwiButton = document.getElementById('makeKiwiButton');
let kiwiPressButton = document.getElementById('kiwiPressButton');
let gamblePrice = 60000;
let gambleAvailable = false;
let startDate = 0;
let quitDate = 0;
let goldenKiwiCounter = 0;
let i = 1;
let pediaPrice = 5000;
let pediaAvailable = false;

// utility funcs
function updateMakeKiwiButton(){
    makeKiwiButton.innerHTML = `make kiwi (${kiwiMakeCount})`;
}
function updateKiwiCounter(){
    kiwiCounterText.innerHTML = `${kiwis} kiwis`;
}
function updatePressCounter(){
    pressCounterText.innerHTML = `${pressCount} presses`;
}
function updateExtractorCounter(){
    extractorCounterText.innerHTML = `${extractorCount} extractors`;
}
function reductDateToSeconds(d){
    let td = d;
    d = Math.floor(td / 1000);
    return d;
}
// debug functions don't touch
function getSaveMade(){
    console.log(saveMade);
}
function getKiwis(){
    console.log(kiwis);
}
function getDefaultKiwiMakeCount(){
    console.log(defaultKiwiMakeCount);
}
function getKiwiMakeCount(){
    console.log(kiwiMakeCount);
}
function getPressCount(){
    console.log(pressCount);
}
function getPressPrice(){
    console.log(pressPrice);
}

// start logic
window.onload = () => {
    $(".loader").fadeOut("slow");
    if (isNaN(lds.get('kiwis'))){
        lds.set('kiwis', 0);
        updateKiwiCounter();
    } else if (lds.get('kiwis') === undefined) {
        lds.set('kiwis', 0);
        updateKiwiCounter();
    }
    saveMade = lds.get("saveMade");
    kiwis = lds.get("kiwis");
    kiwiMakeCount = lds.get("kiwiMakeCount");
    pressCount = lds.get("pressCount");
    pressPrice = lds.get("pressPrice");
    extractorCount = lds.get("extractorCount");
    extractorMakeCount = lds.get("extractorMakeCount");
    extractorPrice = lds.get("extractorPrice");
    gambleAvailable = lds.get("gambleAvailable");
    goldenKiwiCounter = lds.get("goldenKiwiCounter");
    startDate = Date.now();
    startDate = reductDateToSeconds(startDate);
    quitDate = lds.get("quitDate");
    pediaAvailable = lds.get("pediaAvailable");

    console.log(startDate);
    console.log(quitDate);

    let offlineTime = startDate - quitDate;
    if (extractorCount >= 1){
        let toGive = Math.floor(extractorMakeCount * offlineTime * extractorCount);
        console.log(toGive);
        kiwis = kiwis + toGive;
        updateKiwiCounter();
    } 

    updateMakeKiwiButton()
    updateKiwiCounter();
    updatePressCounter()
    updateExtractorCounter()
    goldenTrigger();
    let pressToAdd = pressCount;
    while(pressToAdd > 0){
        pressToAdd--;
        let btn = document.createElement("button");
        btn.innerHTML = "Press";
        btn.name = "PRESS";
        btn.className = "PressStyle";
        document.body.appendChild(btn);
    }

    if (saveMade === false) {
        updateKiwiCounter();
        updatePressCounter()
    }
    if (gambleAvailable === false){
        document.getElementById('gambleKiwiButton').style.display = "none";
    } else {
        document.getElementById('buyGambleButton').style.display = "none";
        document.getElementById('gambleKiwiButton').style.display = "grid";
    }
    if (pediaAvailable === false){
        document.getElementById('buyPediaButton').style.display = "flex";
        document.getElementById('openPedia').style.display = "none";
    } else {
        document.getElementById('openPedia').style.display = "flex";
        document.getElementById('buyPediaButton').style.display = "none";
    }
    //pedia text
    if (pressCount === 0){
        document.getElementById('the-press').style.display = "none";
        document.getElementById('the-golden-kiwi').style.display = "none";
    }
    if (extractorCount === 0){
        document.getElementById('the-extractor').style.display = "none";
    }
    if (gambleAvailable === false){
        document.getElementById('the-gamble').style.display = "none";
    }

    setInterval( function () {
        title = ' kiwis - kwiik'
        document.title = kiwis + title;
    }, 2000);
};



// click kiwi function
function makeKiwi() {
    kiwis+=kiwiMakeCount;
    updateKiwiCounter();
}

// runs when you buy a press
function buyPress() {
    if (kiwis - pressPrice >= 0){
        kiwis -= pressPrice;
        pressCount += 1;
        console.log("press bought");
        console.log(pressCount + "press");
        updateKiwiCounter();
        updatePressCounter()
        // create the button when buyPress clicked
        let btn = document.createElement("button");
        btn.innerHTML = "Press";
        btn.name = "PRESS";
        btn.className = "PressStyle";
        // add press to html
        document.body.appendChild(btn);
        if (pressCount > 0) {
            kiwiMakeCount = defaultKiwiMakeCount + pressCount;
            document.getElementById("makeKiwiButton").innerHTML = `make kiwi (${kiwiMakeCount})`;
        }
        // calculate new pressPrice and flatten it
        pressPrice = Math.floor(pressPrice * 1.2);
        document.getElementById("kiwiPressButton").innerHTML = `buy press (${pressPrice})`;
    } else {
        let missingKiwis = pressPrice - kiwis;
        alert(`You don't have enough kiwis (missing ${missingKiwis} kiwis)`);
    }
}

function buyExtractor(){
    if (kiwis - extractorPrice >= 0){
        kiwis -= extractorPrice;
        extractorCount += 1;
        console.log("extractor bought");
        console.log(extractorCount + "extractor");
        updateKiwiCounter();
        updateExtractorCounter()
    } else {
        let missingKiwis = extractorPrice - kiwis;
        alert(`You don't have enough kiwis (missing ${missingKiwis} kiwis)`);
    }
}

function buyGambleMachine(){
    if (kiwis - gamblePrice >= 0){
        kiwis -= gamblePrice;
        console.log("gamble machine bought");
        updateKiwiCounter();
        gambleAvailable  = true;
        document.getElementById('buyGambleButton').style.display = "none";
        document.getElementById('gambleKiwiButton').style.display = "grid";
    } else {
        let missingKiwis = gamblePrice - kiwis;
        alert(`You don't have enough kiwis (missing ${missingKiwis} kiwis)`);
    }
}

function gambleKiwis() {
    document.getElementById('gamblewaiting').style.animation = "fadeIn 1.5s";
    document.getElementById('gamblewaiting').style.display = "flex";
    waitingGamble();
    let proba = Math.random();
    if (proba > 0.50){
        setTimeout(() => {
            let multi = Math.floor(kiwis * 2);
            kiwis = multi;
            updateKiwiCounter();
            console.log(multi);
            alert(`JACKPOT! You have now ${kiwis} kiwis !`);
        }, 2000);
    } else {
        setTimeout(() => {
            kiwis = Math.floor(kiwis / 2);
            updateKiwiCounter();
            alert(`YOU LOOSER! You have now ${kiwis} kiwis !`);
        }, 2000);
    }
}

function waitingGamble() {
    setTimeout(() => {
        document.getElementById('gamblewaiting').style.animation = "fadeOut 1.5s";
        setTimeout(() => {
            document.getElementById('gamblewaiting').style.display = "none";
        }, 2100);
    }, 2000);
}

function goldenTrigger() {
    if (pressCount > 1){
        let rand = Math.floor(Math.random() * 50);
        function goldenLoop() {
            setTimeout(function() {console.log('a golden kiwi is gonna appear! be ready'); i = 3; goldenKiwi();
                if (i < 2) {
                    goldenLoop();
                }
            }, rand * 5000)
        }
        goldenLoop();
    }
}
function goldenKiwi() {
    //create the button, assign to the html document, set his properties
    let goldenbtn = document.createElement("button");
    goldenbtn.name = "GOLDEN";
    goldenbtn.id = "goldenKiwi";
    goldenbtn.innerHTML = "<img class='golden' src='gkiwi.PNG' style='width: 30%;' alt='golden'/>";
    document.body.appendChild(goldenbtn);
    //peaking a random place to pop
    let rand = Math.floor(Math.random() * 10);
    let randtop = Math.floor(Math.random() * 10);
    goldenbtn.style.position = 'absolute';
    goldenbtn.style.top = Math.floor(randtop * 100)+'px';
    goldenbtn.style.left = Math.floor(rand * 100)+'px';
    //onclick event
    const golden = document.getElementById('goldenKiwi');
    golden.addEventListener('click', goldenonclick);
    function goldenonclick() {
        addkiwi = Math.floor(pressCount * 500);
        kiwis += addkiwi;
        updateKiwiCounter();
        goldenKiwiCounter += 1;
        goldenbtn.remove();
        i = 1;
        goldenTrigger();
    }

}

function buyPedia() {
    if (kiwis - pediaPrice >= 0){
        kiwis -= pediaPrice;
        console.log("kwiik pedia bought");
        updateKiwiCounter();
        document.getElementById('buyPediaButton').style.display = "none";
        document.getElementById('openPedia').style.display = "flex";
        pediaAvailable = true;
    } else {
        let missingKiwis = pediaPrice - kiwis;
        alert(`You don't have enough kiwis (missing ${missingKiwis} kiwis)`);
    }
}



function openPedia() {
    document.getElementById("pedia").style.width = "60%";
    document.getElementById("pedia").style.height = "60%";
    document.getElementById("pedia").style.border = "azure 5px solid";
}

function closePedia() {
    document.getElementById("pedia").style.width = "0%";
    document.getElementById("pedia").style.height = "0%";
    document.getElementById("pedia").style.border = "none";
}

// reset kiwi function
function resetSave(){
    lds.clear();
    saveMade = false;
    kiwis = 0;
    pressCount = 0;
    pressPrice = 250;
    kiwiMakeCount = 1;
    extractorPrice = 15000;
    extractorCount = 0;
    extractorMakeCount = 5;
    goldenKiwiCounter = 0;
    updateKiwiCounter();
    pressCounterText.innerHTML = `${pressCount} press`;
    updateExtractorCounter()
    updateMakeKiwiButton()
    gambleAvailable = false;
    pediaAvailable = false;
    document.getElementById('buyPediaButton').style.display = "grid";
    document.getElementById('openPedia').style.display = "none";
    document.getElementById('buyGambleButton').style.display = "grid";
    document.getElementById('gambleKiwiButton').style.display = "none";
    kiwiPressButton.innerHTML = `buy press (${pressPrice})`;
    $('.PressStyle').remove();
}

//check every second (will probably begin to be extremely laggy in the future sorry)
setInterval(function(){
    //update kiwis every sec
    updateKiwiCounter();
    // click upgrades unlock check
    if (kiwis > gamblePrice - 1) {
        document.getElementById('buyGambleButton').style.border = "rgb(202, 52, 165) solid 5px";
        document.getElementById('buyGambleButton').style.color = "rgb(161, 26, 89)";
        document.getElementById('buyGambleButton').style.opacity = "100%";   
    }  else {
        document.getElementById('buyGambleButton').style.border = "rgb(80, 80, 80) solid 5px";
        document.getElementById('buyGambleButton').style.color = "rgb(75, 75, 75)";
        document.getElementById('buyGambleButton').style.opacity = "0.5";
    }
    //press
    if (kiwis > pressPrice - 1) {
        document.getElementById('kiwiPressButton').style.border = "rgb(0, 138, 185) solid 5px";
        document.getElementById('kiwiPressButton').style.color = "rgb(43, 150, 87)";
        document.getElementById('kiwiPressButton').style.opacity = "100%";
    } else {
        document.getElementById('kiwiPressButton').style.border = "rgb(80, 80, 80) solid 5px";
        document.getElementById('kiwiPressButton').style.color = "rgb(75, 75, 75)";
        document.getElementById('kiwiPressButton').style.opacity = "0.5";
    }
    //extractor
    if (kiwis > extractorPrice - 1) {
        document.getElementById('buyExtractorButton').style.border = "rgb(102, 0, 255) solid 5px";
        document.getElementById('buyExtractorButton').style.color = "rgb(153, 51, 255)";
        document.getElementById('buyExtractorButton').style.opacity = "100%";
    } else {
        document.getElementById('buyExtractorButton').style.border = "rgb(80, 80, 80) solid 5px";
        document.getElementById('buyExtractorButton').style.color = "rgb(75, 75, 75)";
        document.getElementById('buyExtractorButton').style.opacity = "0.5";
    }
    if (extractorCount > 0) {
        kiwis = kiwis + extractorMakeCount * extractorCount;
        kiwiCounterText.innerHTML = `${kiwis} kiwis`;
    }
    //pedia
    if (kiwis > pediaPrice - 1) {
        document.getElementById('buyPediaButton').style.border = "rgb(27, 66, 119) solid 5px";
        document.getElementById('buyPediaButton').style.color = "rgb(14, 37, 68)";
        document.getElementById('buyPediaButton').style.opacity = "100%";
    } else {
        document.getElementById('buyPediaButton').style.border = "rgb(80, 80, 80) solid 5px";
        document.getElementById('buyPediaButton').style.color = "rgb(75, 75, 75)";
        document.getElementById('buyPediaButton').style.opacity = "0.5";
    }
    //pedia text
    if (pressCount > 0) {
        document.getElementById('the-press').style.display = "inline block";
        document.getElementById('the-golden-kiwi').style.display = "inline block";
    }
    if (extractorCount > 0){
        document.getElementById('the-extractor').style.display = "inline block";
    }
    if (gambleAvailable === true){
        document.getElementById('the-gamble').style.display = "inline block";
    }
}, 1000);

// before quitting
window.onbeforeunload = () => {
    saveMade = true;
    let d = Date.now();
    quitDate = reductDateToSeconds(d);
    console.log(quitDate);
    lds.set("saveMade", saveMade);
    lds.set("kiwis", kiwis);
    lds.set("kiwiMakeCount", kiwiMakeCount);
    lds.set("pressCount", pressCount);
    lds.set("pressPrice", pressPrice);
    lds.set("extractorCount", extractorCount);
    lds.set("extractorMakeCount", extractorMakeCount);
    lds.set("extractorPrice", extractorPrice);
    lds.set("gambleAvailable", gambleAvailable);
    lds.set("quitDate", quitDate);
    lds.set("goldenKiwiCounter", goldenKiwiCounter);
    lds.set("pediaAvailable", pediaAvailable);
};