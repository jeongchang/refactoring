function statement(invoice, plays){

    return renderPlainText(createStatementData(invoice, plays));
}

function createStatementData(invoice, plays){
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance); // 얕은 복사 수행
    //map 매서드는 배열 내의 모든 요소 각각에 대하여 주어진 함수를 호출한 결과를 모아 새로운 배열을 반환합니다.
    
    statementData.totalAmount = totalAmount(statementData);
    statementData.totalVolumeCredits = totalVolumeCredits(statementData);

    //return renderPlainText(statementData, plays);      // 중간데이터로 옮겨져서 필요 없어진 인수 삭제
    return statementData;

    function enrichPerformance(aPerformance){
        const result = Object.assign({}, aPerformance); //얕은 복사 수행
        result.play = playFor(result);  // 중간데이터에 연극 정보를 저장.
        result.amount = amountFor(result); 
        result.volumeCredits = volumeCreditsFor(result);
        return result;
    }


    function playFor(aPerformance){
        return plays[aPerformance.playID];
    }

    function amountFor(aPerformance){ // 필요 없어진 매개변수 제거
        let result = 0;         // 명확한 이름으로 변경
        switch(aPerformance.play.type){ // 중간 데이터를 사용하도록 바꿈
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
                throw new Error(`알 수 없는 장르 : ${aPerformance.play.type}`);
        }
        return result;      //함수 안에서 값이 바뀌는 변수 반환
    }

    function volumeCreditsFor(aPerformance){
        let result = 0;
        result += Math.max(aPerformance.audience - 30, 0);
        if( "comedy" === aPerformance.play.type){   //중간 데이터를 사용하도록 바꿈
            result += Math.floor(aPerformance.audience /5);
        }
        return result;
    }

    function totalVolumeCredits(data){

        return data.performances.reduce((total,p) => total + p.volumeCredits, 0);
    }

    function totalAmount(data){ 

        return data.performances.reduce((total,p) => total + p.amount, 0);
    }


}



    //function renderPlainText(data, invoice, plays){     
function renderPlainText(data, plays){     // 중간데이터로 옮겨져서 필요 없어진 인수 삭제
    let result = `청구 내역 (고객명 : ${data.customer})\n`; //고객 데이터를 중간 데이터로부터 얻음

    //for(let perf of invoice.performances){
    for(let perf of data.performances){ // 중간데이터로 대체됨
        //청구 내역을 출력한다.
        result += `${perf.play.name}: ${usd(perf.amount)} (${perf.audience}석\n`; //중간데이터를 사용하도록 바꿈
    }

    result +=`총액:${usd(data.totalAmount/100)}\n`;   //format => usd
    result +=`적립 포인트: ${data.totalVolumeCredits}점\n`;    //volumeCredits변수를 인라인 한다.
    return result;



    function usd(aNumber){ 
        return new Intl.NumberFormat("en-US",
        {
            style:"currency", currency:"USD", minimumFractionDigits:2
        }).format(aNumber/100);
    }



}