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

let Game={};

// define variables
Game.saveMade = false;
Game.kiwis = 0;
Game.defaultKiwiMakeCount = 1;
Game.kiwiMakeCount = 1;
Game.pressCount = 0;
Game.pressPrice = 250;
Game.extractorCount = 0;
Game.extractorMakeCount = 5;
Game.extractorPrice = 15000;
Game.lds = localDataStorage("kwiikStorage");
Game.kiwiCounterText = document.getElementById("kiwiCounterText");
Game.pressCounterText = document.getElementById("pressCounterText");
Game.extractorCounterText = document.getElementById("extractorCounterText");
Game.makeKiwiButton = document.getElementById('makeKiwiButton');
Game.kiwiPressButton = document.getElementById('kiwiPressButton');
Game.gamblePrice = 60000;
Game.gambleAvailable = false;
Game.startDate = 0;
Game.quitDate = 0;
Game.goldenKiwiCounter = 0;
Game.i = 1;
Game.pediaPrice = 5000;
Game.pediaAvailable = false;

// utility funcs
Game.updateMakeKiwiButton = function(){
    Game.makeKiwiButton.innerHTML = `make kiwi (${Game.kiwiMakeCount})`;
}
Game.updateKiwiCounter = function(){
    Game.kiwiCounterText.innerHTML = `${Game.kiwis} kiwis`;
}
Game.updatePressCounter = function(){
    Game.pressCounterText.innerHTML = `${Game.pressCount} presses`;
}
Game.updateExtractorCounter = function(){
    Game.extractorCounterText.innerHTML = `${Game.extractorCount} extractors`;
}
Game.reductDateToSeconds = function(d){
    let td = d;
    d = Math.floor(td / 1000);
    return d;
}

// start logic
window.onload = () => {
    $(".loader").fadeOut("slow");
    if (isNaN(Game.lds.get('kiwis'))){
        Game.lds.set('kiwis', 0);
        Game.updateKiwiCounter();
    } else if (Game.lds.get('kiwis') === undefined) {
        Game.lds.set('kiwis', 0);
        Game.updateKiwiCounter();
    }
    Game.saveMade = Game.lds.get("saveMade");
    Game.kiwis = Game.lds.get("kiwis");
    Game.kiwiMakeCount = Game.lds.get("kiwiMakeCount");
    Game.pressCount = Game.lds.get("pressCount");
    Game.pressPrice = Game.lds.get("pressPrice");
    Game.extractorCount = Game.lds.get("extractorCount");
    Game.extractorMakeCount = Game.lds.get("extractorMakeCount");
    Game.extractorPrice = Game.lds.get("extractorPrice");
    Game.gambleAvailable = Game.lds.get("gambleAvailable");
    Game.goldenKiwiCounter = Game.lds.get("goldenKiwiCounter");
    Game.startDate = Date.now();
    Game.startDate = Game.reductDateToSeconds(Game.startDate);
    Game.quitDate = Game.lds.get("quitDate");
    Game.pediaAvailable = Game.lds.get("pediaAvailable");

    console.log(Game.startDate);
    console.log(Game.quitDate);

    let offlineTime = Game.startDate - Game.quitDate;
    if (Game.extractorCount >= 1){
        let toGive = Math.floor(Game.extractorMakeCount * offlineTime * Game.extractorCount);
        console.log(toGive);
        Game.kiwis = Game.kiwis + toGive;
        Game.updateKiwiCounter();
    }

    Game.updateMakeKiwiButton()
    Game.updateKiwiCounter();
    Game.updatePressCounter()
    Game.updateExtractorCounter()
    Game.goldenTrigger();
    let pressToAdd = Game.pressCount;
    while(pressToAdd > 0){
        pressToAdd--;
        let btn = document.createElement("button");
        btn.innerHTML = "Press";
        btn.name = "PRESS";
        btn.className = "PressStyle";
        document.getElementById('press').appendChild(btn);
    }

    if (Game.saveMade === false) {
        Game.updateKiwiCounter();
        Game.updatePressCounter()
    }
    if (Game.gambleAvailable === false){
        document.getElementById('gambleKiwiButton').style.display = "none";
    } else {
        document.getElementById('buyGambleButton').style.display = "none";
        document.getElementById('gambleKiwiButton').style.display = "flex";
    }
    if (Game.pediaAvailable === false){
        document.getElementById('buyPediaButton').style.display = "flex";
        document.getElementById('openPedia').style.display = "none";
    } else {
        document.getElementById('openPedia').style.display = "flex";
        document.getElementById('buyPediaButton').style.display = "none";
    }
    //pedia text
    if (Game.pressCount === 0){
        document.getElementById('the-press').style.display = "none";
        document.getElementById('the-golden-kiwi').style.display = "none";
    }
    if (Game.extractorCount === 0){
        document.getElementById('the-extractor').style.display = "none";
    }
    if (Game.gambleAvailable === false){
        document.getElementById('the-gamble').style.display = "none";
    }

    setInterval( function () {
        Game.title = ' kiwis - kwiik'
        document.title = Game.kiwis + Game.title;
    }, 2000);
};



// click kiwi function
Game.makeKiwi = function() {
    Game.kiwis+=Game.kiwiMakeCount;
    Game.updateKiwiCounter();
}

// runs when you buy a press
Game.buyPress = function() {
    if (Game.kiwis - Game.pressPrice >= 0){
        Game.kiwis -= Game.pressPrice;
        Game.pressCount += 1;
        console.log("press bought");
        console.log(Game.pressCount + "press");
        Game.updateKiwiCounter();
        Game.updatePressCounter()
        // create the button when buyPress clicked
        let btn = document.createElement("button");
        btn.innerHTML = "Press";
        btn.name = "PRESS";
        btn.className = "PressStyle";
        // add press to html
        document.getElementById('press').appendChild(btn);
        if (Game.pressCount > 0) {
            Game.kiwiMakeCount = Game.defaultKiwiMakeCount + Game.pressCount;
            document.getElementById("makeKiwiButton").innerHTML = `make kiwi (${Game.kiwiMakeCount})`;
        }
        // calculate new pressPrice and flatten it
        Game.pressPrice = Math.floor(Game.pressPrice * 1.2);
        document.getElementById("kiwiPressButton").innerHTML = `buy press (${Game.pressPrice})`;
    } else {
        let missingKiwis = Game.pressPrice - Game.kiwis;
        alert(`You don't have enough kiwis (missing ${missingKiwis} kiwis)`);
    }
}

Game.buyExtractor = function(){
    if (Game.kiwis - Game.extractorPrice >= 0){
        Game.kiwis -= Game.extractorPrice;
        Game.extractorCount += 1;
        console.log("extractor bought");
        console.log(Game.extractorCount + "extractor");
        Game.updateKiwiCounter();
        Game.updateExtractorCounter()
    } else {
        let missingKiwis = Game.extractorPrice - Game.kiwis;
        alert(`You don't have enough kiwis (missing ${missingKiwis} kiwis)`);
    }
}

Game.buyGambleMachine = function(){
    if (Game.kiwis - Game.gamblePrice >= 0){
        Game.kiwis -= Game.gamblePrice;
        console.log("gamble machine bought");
        Game.updateKiwiCounter();
        Game.gambleAvailable  = true;
        document.getElementById('buyGambleButton').style.display = "none";
        document.getElementById('gambleKiwiButton').style.display = "grid";
    } else {
        let missingKiwis = Game.gamblePrice - Game.kiwis;
        alert(`You don't have enough kiwis (missing ${missingKiwis} kiwis)`);
    }
}

Game.gambleKiwis = function() {
    document.getElementById('gamblewaiting').style.animation = "fadeIn 1.5s";
    document.getElementById('gamblewaiting').style.display = "flex";
    Game.waitingGamble();
    let proba = Math.random();
    if (proba > 0.50){
        setTimeout(() => {
            let multi = Math.floor(Game.kiwis * 2);
            Game.kiwis = multi;
            Game.updateKiwiCounter();
            console.log(multi);
            alert(`JACKPOT! You have now ${Game.kiwis} kiwis !`);
        }, 2000);
    } else {
        setTimeout(() => {
            Game.kiwis = Math.floor(Game.kiwis / 2);
            Game.updateKiwiCounter();
            alert(`YOU LOOSER! You have now ${Game.kiwis} kiwis !`);
        }, 2000);
    }
}

Game.waitingGamble = function() {
    setTimeout(() => {
        document.getElementById('gamblewaiting').style.animation = "fadeOut 1.5s";
        setTimeout(() => {
            document.getElementById('gamblewaiting').style.display = "none";
        }, 2200);
    }, 2000);
}

Game.goldenTrigger = function() {
    if (Game.pressCount > 1){
        let rand = Math.floor(Math.random() * 50);
        function goldenLoop() {
            setTimeout(function() {
                console.log('Golden kiwi summoned'); Game.i = 3; Game.goldenKiwi();
                if (Game.i < 2) {
                    goldenLoop();
                }
            }, rand * 5000)
        }
        goldenLoop();
    }
}

let goldenbtn = document.createElement("button");
goldenbtn.name = "GOLDEN";
goldenbtn.id = "goldenKiwi";

Game.goldenKiwi = function() {
    //create the button, assign to the html document, set his properties
    goldenbtn.innerHTML = "<img src='https://cdn.discordapp.com/attachments/468526089153544212/1030787434264416306/unknown.png' class='golden'/>";
    document.body.appendChild(goldenbtn);
    //choosing a random place to pop
    let rand = Math.floor(Math.random() * 10);
    goldenbtn.style.position = 'absolute';
    goldenbtn.style.top = Math.floor(rand * 70)+'px';
    goldenbtn.style.left = Math.floor(rand * 70)+'px';
    //onclick event
    const golden = document.getElementById('goldenKiwi');
    golden.addEventListener('click', goldenonclick);
    function goldenonclick() {
        let addkiwi = Math.floor(Game.kiwis / 4);
        Game.kiwis += addkiwi;
        Game.updateKiwiCounter();
        Game.goldenKiwiCounter += 1;
        goldenbtn.remove();
        Game.i = 1;
        Game.goldenTrigger();
    }

}

Game.buyPedia = function() {
    if (Game.kiwis - Game.pediaPrice >= 0){
        Game.kiwis -= Game.pediaPrice;
        console.log("kwiik pedia bought");
        Game.updateKiwiCounter();
        document.getElementById('buyPediaButton').style.display = "none";
        document.getElementById('openPedia').style.display = "flex";
        Game.pediaAvailable = true;
    } else {
        let missingKiwis = Game.pediaPrice - Game.kiwis;
        alert(`You don't have enough kiwis (missing ${missingKiwis} kiwis)`);
    }
}



Game.openPedia = function() {
    document.getElementById("pedia").style.width = "60%";
    document.getElementById("pedia").style.height = "60%";
    document.getElementById("pedia").style.border = "azure 5px solid";
}

Game.closePedia = function() {
    document.getElementById("pedia").style.width = "0%";
    document.getElementById("pedia").style.height = "0%";
    document.getElementById("pedia").style.border = "none";
}

// reset kiwi function
Game.resetSave = function(){
    Game.lds.clear();
    Game. saveMade = false;
    Game.kiwis = 0;
    Game.pressCount = 0;
    Game.pressPrice = 250;
    Game.kiwiMakeCount = 1;
    Game.extractorPrice = 15000;
    Game.extractorCount = 0;
    Game.extractorMakeCount = 5;
    Game.goldenKiwiCounter = 0;
    Game.updateKiwiCounter();
    Game.pressCounterText.innerHTML = `${Game.pressCount} press`;
    Game.updateExtractorCounter()
    Game.updateMakeKiwiButton()
    Game.gambleAvailable = false;
    Game.pediaAvailable = false;
    document.getElementById('buyPediaButton').style.display = "grid";
    document.getElementById('openPedia').style.display = "none";
    document.getElementById('buyGambleButton').style.display = "grid";
    document.getElementById('gambleKiwiButton').style.display = "none";
    Game.kiwiPressButton.innerHTML = `buy press (${Game.pressPrice})`;
    $('.PressStyle').remove();
}

//check every second (will probably begin to be extremely laggy in the future sorry)
setInterval(function(){
    //update kiwis every sec
    Game.updateKiwiCounter();
    // click upgrades unlock check
    if (Game.kiwis > Game.gamblePrice - 1) {
        document.getElementById('buyGambleButton').style.border = "rgb(202, 52, 165) solid 5px";
        document.getElementById('buyGambleButton').style.color = "rgb(161, 26, 89)";
        document.getElementById('buyGambleButton').style.opacity = "100%";   
    }  else {
        document.getElementById('buyGambleButton').style.border = "rgb(80, 80, 80) solid 5px";
        document.getElementById('buyGambleButton').style.color = "rgb(75, 75, 75)";
        document.getElementById('buyGambleButton').style.opacity = "0.5";
    }
    //press
    if (Game.kiwis > Game.pressPrice - 1) {
        document.getElementById('kiwiPressButton').style.border = "rgb(0, 138, 185) solid 5px";
        document.getElementById('kiwiPressButton').style.color = "rgb(43, 150, 87)";
        document.getElementById('kiwiPressButton').style.opacity = "100%";
    } else {
        document.getElementById('kiwiPressButton').style.border = "rgb(80, 80, 80) solid 5px";
        document.getElementById('kiwiPressButton').style.color = "rgb(75, 75, 75)";
        document.getElementById('kiwiPressButton').style.opacity = "0.5";
    }
    //extractor
    if (Game.kiwis > Game.extractorPrice - 1) {
        document.getElementById('buyExtractorButton').style.border = "rgb(102, 0, 255) solid 5px";
        document.getElementById('buyExtractorButton').style.color = "rgb(153, 51, 255)";
        document.getElementById('buyExtractorButton').style.opacity = "100%";
    } else {
        document.getElementById('buyExtractorButton').style.border = "rgb(80, 80, 80) solid 5px";
        document.getElementById('buyExtractorButton').style.color = "rgb(75, 75, 75)";
        document.getElementById('buyExtractorButton').style.opacity = "0.5";
    }
    if (Game.extractorCount > 0) {
        Game.kiwis = Game.kiwis + Game.extractorMakeCount * Game.extractorCount;
        Game.kiwiCounterText.innerHTML = `${Game.kiwis} kiwis`;
    }
    //pedia
    if (Game.kiwis > Game.pediaPrice - 1) {
        document.getElementById('buyPediaButton').style.border = "rgb(27, 66, 119) solid 5px";
        document.getElementById('buyPediaButton').style.color = "rgb(14, 37, 68)";
        document.getElementById('buyPediaButton').style.opacity = "100%";
    } else {
        document.getElementById('buyPediaButton').style.border = "rgb(80, 80, 80) solid 5px";
        document.getElementById('buyPediaButton').style.color = "rgb(75, 75, 75)";
        document.getElementById('buyPediaButton').style.opacity = "0.5";
    }
    //pedia text
    if (Game.pressCount > 0) {
        document.getElementById('the-press').style.display = "inline block";
        document.getElementById('the-golden-kiwi').style.display = "inline block";
    }
    if (Game.extractorCount > 0){
        document.getElementById('the-extractor').style.display = "inline block";
    }
    if (Game.gambleAvailable === true){
        document.getElementById('the-gamble').style.display = "inline block";
    }
}, 1000);

// before quitting
window.onbeforeunload = () => {
    Game.saveMade = true;
    let d = Date.now();
    Game.quitDate = Game.reductDateToSeconds(d);
    console.log(Game.quitDate);
    Game.lds.set("saveMade", Game.saveMade);
    Game.lds.set("kiwis", Game.kiwis);
    Game.lds.set("kiwiMakeCount", Game.kiwiMakeCount);
    Game.lds.set("pressCount", Game.pressCount);
    Game.lds.set("pressPrice", Game.pressPrice);
    Game.lds.set("extractorCount", Game.extractorCount);
    Game.lds.set("extractorMakeCount", Game.extractorMakeCount);
    Game.lds.set("extractorPrice", Game.extractorPrice);
    Game.lds.set("gambleAvailable", Game.gambleAvailable);
    Game.lds.set("quitDate", Game.quitDate);
    Game.lds.set("goldenKiwiCounter", Game.goldenKiwiCounter);
    Game.lds.set("pediaAvailable", Game.pediaAvailable);
};