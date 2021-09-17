import createStatementData from './createStatementData.js';

function statement(invoice, plays){
    return renderPlainText(createStatementData(invoice, plays));
}

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

}

function htmlStatement(invoice, plays){
    return renderHtml(createStatementData(invoice, plays)); //중간 데이터 생성 함수를 공유
}

function renderHtml(data){
    let result = `<h1>청구 내역 (고객명 : ${data.customer})</h1>\n`
    result += "<table>\n"
    result += "<tr><th>연극</th><th>좌석 수</th><th>금액</th></tr>;"
    for( let perf of data.performances){
        result += ` <tr><td>${perf.play.name}</td><td>(${perf.audience}석)</td>`;
        result += `<td>${usd(perf.amount)}</td></tr>\n`;
    }
    result += "</table>\n";
    result += `<p>총액 : <em>${usd(data.totalAmount)}</em></p>\n`;
    result += `<p>적립 포인트 : <em>${data.totalVolumeCredits}</em>점</p>\n`;
    return result;
}


function usd(aNumber){ 
    return new Intl.NumberFormat("en-US",
    {
        style:"currency", currency:"USD", minimumFractionDigits:2
    }).format(aNumber/100);
}


///////////////////////////////////////////////////////////////////

let invoice = 
    {
        "customer": "BigCo",
        "performances":[
            {
                "playID": "hamlet",
                "audience" : 55
            },
            {
                "playID" : "as-like",
                "audience": 35
            },
            {
                "playID":"othello",
                "audience":40
            }
        ]
    }



let plays = {
    "hamlet" : {"name": "Hamlet", "type" : "tragedy"},
    "as-like" : {"name": "As You Like It", "type" : "comedy"},
    "othello" : {"name": "Othello", "type" : "tragedy"}
}


/////////////////////////////////////////


let asd = htmlStatement(invoice, plays);

console.log(asd);