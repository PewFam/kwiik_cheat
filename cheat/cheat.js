alert("C'est ciao")

function pausecomp(millis)
{
    var date = new Date();
    var curDate = null;
    do { curDate = new Date(); }
    while(curDate-date < millis);
}
pausecomp(2000);
Game.kiwis = 10e+450;

i=0

while(i<100){
Game.buyPress()
Game.buyExtractor()
i = i+0.05
}