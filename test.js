function statement(invoice, plays){
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = '청구 내역 (고객명 : ${invoice.customer})\n';
    const format = new Intl.NumberFormat("en-S", 
                                    { style: "currency", currency:"USD",
                                        minimumFractionDigits: 2}).format;

    for(let perf of invoice.performances){
        const play = plays[perf.playID];
/*
        let thisAmount = 0;
        switch(play.type){
            case "tragedy": //비극
                thisAmount = 40000;
                if(perf.audience > 30){
                    thisAmount += 1000* (perf.audience - 30);
                }
                break;
            case "comedy": //희극
                thisAmount = 30000;
                if(perf.audience > 20){
                    thisAmount += 10000 + 500 * (perf.audience -20);
                }
                thisAmount += 300*perf.audience;
                break;
            default:
                throw new Error('알 수 없는 장르 : ${play.type}');
            }
            */
            // 이 부분을 전부 추출했으므로 추출한 함수를 이용한다.
            
            let thisAmount = amountFor(perf, play); // 추출한 함수를 이용
            
        //포인트를 적립한다.
        volumeCredits += Math.max(perf.audience - 30, 0);
        
        //희극 관객 5명마다 추가 포인트를 제공한다.
        if("comedy" === play.type) volumeCredits += Math.floor(perf.audience /5);

        //청구 내역을 출력한다.
        result += ' ${play.name}: ${format(thisAmount/100)} (${perf.audience}석\n';
        totalAmount += thisAmount;
    }

    result +='총액:${format(totalAmount/100)}\n';
    result +='적립 포인트: ${volumeCredits}점\n';
    return result;
}

function amountFor(perf, play){ //값이 바뀌지 않는 변수는 매개변수로 전달
    //let thisAmount = 0;         //변수를 초기화 하는 코드
    let result = 0;         // 명확한 이름으로 변경
    switch(play.type){
        case "tragedy": //비극
            result = 40000;
            if(perf.audience>30){
                result += 1000 * (perf.audience -30);
            }
            break;
        case "comedy": //희극
            result = 30000;
            if(perf.audience >20){
                result += 10000 + 500 * (perf.audience -20);
            }
            result += 300 * perf.audience;
            break;
        default:
            throw new Error('알 수 없는 장르 : ${paly.type}');
    }
    return result;      //함수 안에서 값이 바뀌는 변수 반환
}