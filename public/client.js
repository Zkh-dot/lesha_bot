const ipay = new IPAY({api_token: 'YRF3C5RFICWISEWFR6GJ'});
const payb = document.getElementById('pay');

const add0 = document.getElementById('+0');
const add1 = document.getElementById('+1');
const add2 = document.getElementById('+2');
const add3 = document.getElementById('+3');
const add4 = document.getElementById('+4');
const add5 = document.getElementById('+5');

const tgadd = document.getElementById('tgadd');

var prices = [0, 0, 0, 0, 0, 0];

fetch('/prices', {method: 'POST'})
      .then(function(response) {
        if(response.ok) return response.json();
        throw new Error('Request failed.');
      })
      .then(function(data) {
        prices = data;

        console.log(prices);
        //console.log(data);
      })
      .catch(function(error) {
        //console.log(error);
      });

var ord = [];
tgadd.addEventListener('click', function(e){
    //console.log(document.getElementById('tg').value);
    fetch('/orders', {
        method: 'post',
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        body: JSON.stringify({1: document.getElementById('tg').value}),
    })
    .then(function(data) {
        ord = data.json().then(function (data1) {
            console.log('data =',data1);
            ord = data1;
        //console.log(data);
        })
        .then(function(a){
        console.log(ord);
        document.getElementById('harchi').value = ord[0];
        document.getElementById('borsh').value = ord[1];
        document.getElementById('vegan').value = ord[2];
        document.getElementById('meat').value = ord[3];
        document.getElementById('huinks').value = ord[4];
        document.getElementById('voda').value = ord[5];
        })
    })
    
    
})



//TODO запрос к серверу за:
//1. ценами при старте v
//2. заказами юзера при авторизации
//3. обнулением корзины при оплате
//сревер при запросах отдает изменения боту. может в 1 файле собрать?



payb.addEventListener('click', function(e) {
    var sum = 0;
    sum += parseInt(document.getElementById('harchi').value) * prices[0];
    sum += parseInt(document.getElementById('borsh').value) * prices[1];
    sum += parseInt(document.getElementById('vegan').value) * prices[2];
    sum += parseInt(document.getElementById('meat').value) * prices[3];
    sum += parseInt(document.getElementById('huinks').value) * prices[4];
    sum += parseInt(document.getElementById('voda').value) * prices[5];
    ipayCheckout({
        amount:sum,
        currency:'RUB',
        order_number:'',
        description: 'Ваш заказ'},
        function(order) { showSuccessfulPurchase(order) },
        function(order) { showFailurefulPurchase(order) })

        document.getElementById('harchi').value = ord[0];
        document.getElementById('borsh').value = ord[1];
        document.getElementById('vegan').value = ord[2];
        document.getElementById('meat').value = ord[3];
        document.getElementById('huinks').value = ord[4];
        document.getElementById('voda').value = ord[5];
})

document.getElementById('harchi').value = 0;
document.getElementById('borsh').value = 0;
document.getElementById('vegan').value = 0;
document.getElementById('meat').value = 0;
document.getElementById('huinks').value = 0;
document.getElementById('voda').value = 0;

add0.addEventListener('click', function(e){
    document.getElementById('harchi').value = 1 + parseInt(document.getElementById('harchi').value);
    try{
        fetch('/add', {
            method: 'post',
            headers: {'Content-Type': 'application/json;charset=utf-8'},
            body: JSON.stringify({
                1: document.getElementById('tg').value,
                2: '0'
        
        }),
        })
    }
    catch{
        //
    }
})

add1.addEventListener('click', function(e){
    document.getElementById('borsh').value = 1 + parseInt(document.getElementById('borsh').value);
    try{
        fetch('/add', {
            method: 'post',
            headers: {'Content-Type': 'application/json;charset=utf-8'},
            body: JSON.stringify({
                1: document.getElementById('tg').value,
                2: '1'
        
        }),
        })
    }
    catch{
        //
    }
})

add2.addEventListener('click', function(e){
    document.getElementById('vegan').value = 1 + parseInt(document.getElementById('vegan').value);
    try{
        fetch('/add', {
            method: 'post',
            headers: {'Content-Type': 'application/json;charset=utf-8'},
            body: JSON.stringify({
                1: document.getElementById('tg').value,
                2: '2'
        }),
        })
    }
    catch{
        //
    }
})

add3.addEventListener('click', function(e){
    document.getElementById('meat').value = 1 + parseInt(document.getElementById('meat').value);
    try{
        fetch('/add', {
            method: 'post',
            headers: {'Content-Type': 'application/json;charset=utf-8'},
            body: JSON.stringify({
                1: document.getElementById('tg').value,
                2: '3'
        }),
        })
    }
    catch{
        //
    }
})

add4.addEventListener('click', function(e){
    document.getElementById('huinks').value = 1 + parseInt(document.getElementById('huinks').value);
    try{
        fetch('/add', {
            method: 'post',
            headers: {'Content-Type': 'application/json;charset=utf-8'},
            body: JSON.stringify({
                1: document.getElementById('tg').value,
                2: '4'
        }),
        })
    }
    catch{
        //
    }
})

add5.addEventListener('click', function(e){
    document.getElementById('voda').value = 1 + parseInt(document.getElementById('voda').value);
    try{
        fetch('/add', {
            method: 'post',
            headers: {'Content-Type': 'application/json;charset=utf-8'},
            body: JSON.stringify({
                1: document.getElementById('tg').value,
                2: '5'
        }),
        })
    }
    catch{
        //
    }
})