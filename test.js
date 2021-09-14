function statement(invoice, plays){
    let result = `청구 내역 (고객명 : ${invoice.customer})\n`;

    for(let perf of invoice.performances){
        //청구 내역을 출력한다.
        result += `${playFor(perf).name}: ${usd(amountFor(perf)/100)} (${perf.audience}석\n`; //변수 인라인 적용
        //totalAmount += amountFor(perf); //함수 추출
    }
    

    result +=`총액:${usd(totalAmount/100)}\n`;   //format => usd
    result +=`적립 포인트: ${totalVolumeCredits()}점\n`;    //volumeCredits변수를 인라인 한다.
    return result;
}

//function amountFor(aPerformance, play){ // perf => aPerformance로 이름 변경
function amountFor(aPerformance){ // 필요 없어진 매개변수 제거
    let result = 0;         // 명확한 이름으로 변경
    switch(playFor(aPerformance).type){ //play를 playFor()호출로 변경
        case "tragedy": //비극
            result = 40000;
            if(aPerformance.audience>30){
                result += 1000 * (aPerformance.audience -30);
            }
            break;
        case "comedy": //희극
            result = 30000;
            if(aPerformance.audience >20){
                result += 10000 + 500 * (aPerformance.audience -20);
            }
            result += 300 * aPerformance.audience;
            break;
        default:
            throw new Error(`알 수 없는 장르 : ${playFor(aPerformance)}.type}`);
    }
    return result;      //함수 안에서 값이 바뀌는 변수 반환
}

function playFor(aPerformance){
    return plays[aPerformance.playID];
}


function volumeCreditsFor(aPerformance){
    let result = 0;
    result += Math.max(aPerformance.audience - 30, 0);
    if( "comedy" === playFor(aPerformance).type){
        result += Math.floor(aPerformance.audience /5);
    }
    return result;
}

function usd(aNumber){ 
    return new Intl.NumberFormat("en-US",
    {
        style:"currency", currency:"USD", minimumFractionDigits:2
    }).format(aNumber/100);
}

function totalVolumeCredits(){
    let volumeCredits = 0;
    for(let perf of invoice.performances){
        volumeCredits += volumeCreditsFor(perf);
    }
    return volumeCredits;
}

function totalAmount(){ //함수 이름 변경
    //let totalAmount=0;  //변수이름 변경
    let result = 0;
    for( let perf of invoice.performances){
        //totalAmount += amountFor(perf);   //변수 이름 변경
        result += amountFor(perf);
    }
    //return totalAmount;   //변수 이름 변경
    return result;
}