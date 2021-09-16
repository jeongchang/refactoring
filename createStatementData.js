export default function createStatementData(injvoice, plays){
    const result ={};
    result.customer = invoice.customer;
    result.performances = invoice.performances.map(enrichPerformance);
    result.totalAmount = totalAmount(result);
    result.totalVolumeCredits = totalVolumeCredits(result);
    return result;

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

    function totalAmount(data){ 
        return data.performances.reduce((total,p) => total + p.amount, 0);
    }
    
    function totalVolumeCredits(data){
        return data.performances.reduce((total,p) => total + p.volumeCredits, 0);
    }

}