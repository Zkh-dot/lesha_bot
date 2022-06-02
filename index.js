const { Telegraf } = require('telegraf')

const bot = new Telegraf('5426815210:AAG_eyLkha4BSRwhnraGJKqBM04LFaUz30c'); //сюда помещается токен, который дал botFather

var users = {};

var bluda = ['харчи', 'борщ с пампушками', 'салат веганский', 'мясо и мясо, че бухтеть то', 'коктель "Хунс', 'вода']

var prices = [100, 200, 1000, 33, 122, 10];

var choises = {};

var choises_serv = {};
  


bot.start((ctx) => {
    choises_serv[ctx.chat.id] = [0,0,0,0,0,0];
    ctx.reply('Welcome')
    users[ctx.chat.id] = 0;
    choises[ctx.chat.id] = [];
}) 
bot.help((ctx) => ctx.reply('Send me a sticker')) //ответ бота на команду /help
bot.on('sticker', (ctx) => ctx.reply('О, это стикер')) //bot.on это обработчик введенного юзером сообщения, в данном случае он отслеживает стикер, можно использовать обработчик текста или голосового сообщения
bot.hears('hi', (ctx) => ctx.reply('Hey there'))

const getInvoice = (id) => {
    var price = 0;
    choises[id].forEach(function (item, index) {
        price += prices[item];
      });
    const invoice = {
      chat_id: id, // Уникальный идентификатор целевого чата или имя пользователя целевого канала
      provider_token: '401643678:TEST:d6812502-2a71-411e-abba-0897c0505949', // токен выданный через бот @SberbankPaymentBot 
      start_parameter: 'get_access', //Уникальный параметр глубинных ссылок. Если оставить поле пустым, переадресованные копии отправленного сообщения будут иметь кнопку «Оплатить», позволяющую нескольким пользователям производить оплату непосредственно из пересылаемого сообщения, используя один и тот же счет. Если не пусто, перенаправленные копии отправленного сообщения будут иметь кнопку URL с глубокой ссылкой на бота (вместо кнопки оплаты) со значением, используемым в качестве начального параметра.
      title: 'InvoiceTitle', // Название продукта, 1-32 символа
      description: 'InvoiceDescription', // Описание продукта, 1-255 знаков
      currency: 'RUB', // Трехбуквенный код валюты ISO 4217
      prices: [{ label: 'Invoice Title', amount: price * 100 }], // Разбивка цен, сериализованный список компонентов в формате JSON 100 копеек * 100 = 100 рублей
      payload: { // Полезные данные счета-фактуры, определенные ботом, 1–128 байт. Это не будет отображаться пользователю, используйте его для своих внутренних процессов.
        unique_id: `${id}_${Number(new Date())}`,
        provider_token: process.env.PROVIDER_TOKEN 
      }
    }
  
    return invoice
  }
  
  bot.use(Telegraf.log())
  
  bot.hears('pay', (ctx) => { // это обработчик конкретного текста, данном случае это - "pay"
    return ctx.replyWithInvoice(getInvoice(ctx.from.id));
    choises_serv[ctx.chat.id] = [0,0,0,0,0,0]; //  метод replyWithInvoice для выставления счета  
  })
  
  bot.on('pre_checkout_query', (ctx) => ctx.answerPreCheckoutQuery(true)) // ответ на предварительный запрос по оплате
  
  bot.on('successful_payment', async (ctx, next) => { // ответ в случае положительной оплаты
    await ctx.reply('Спасибо за покупку, оплата прошла!')
    users[ctx.chat.id] = 0;
    choises[ctx.chat.id] = [];
  })

  bot.command('menu', (ctx) => {
    ctx.reply(`
Выберите секцию меню:
/soop
/salad
/hot
/drinks
/skyrim
/back  
    `)
  })


  bot.command('soop', (ctx) => {
      ctx.reply(`
Супы:
/harchi
/borch_s_pampushkami
      `)
  })
  bot.command('salad', (ctx) => {
      ctx.reply(`
Салаты:      
/vegans
      `)
  })

  bot.command('hot', (ctx) => {
    ctx.reply(`
Горячее:
/meat
    `)
    })

bot.command('drinks', (ctx) => {
        ctx.reply(`
Напитки:
/huinks
/voda
        `)
})

bot.command('harchi', (ctx) =>{
    choises[ctx.chat.id].push(0);
    choises_serv[ctx.chat.id][0]++;
    ctx.reply('Вы выбрали харчи');
})
  
bot.command('borch_s_pampushkami', (ctx) =>{
    choises[ctx.chat.id].push(1);
    ctx.reply('Вы выбрали борщ с пампушками \nгероям слава!');
    choises_serv[ctx.chat.id][1]++;
})
  
bot.command('vegans', (ctx) =>{
    choises[ctx.chat.id].push(2);
    ctx.reply('Вы выбрали салат веганский');
    choises_serv[ctx.chat.id][2]++;
})

bot.command('ipconfig', (ctx) =>{ 
  ctx.reply( ); 
})

bot.command('meat', (ctx) =>{
    choises[ctx.chat.id].push(3);
    ctx.reply('Вы выбрали мясо');
    choises_serv[ctx.chat.id][3]++;
})

bot.command('huinks', (ctx) =>{
    choises[ctx.chat.id].push(4);
    ctx.reply('Вы выбрали коктель "Хунс"');
    choises_serv[ctx.chat.id][4]++;
})

bot.command('voda', (ctx) =>{
    choises[ctx.chat.id].push(5);
    ctx.reply('Вы выбрали воду');
    choises_serv[ctx.chat.id][5]++;
})

bot.command('my_order', (ctx) =>{
    var order = ''
    choises[ctx.chat.id].forEach(function (item, index) {
        order += bluda[item] + ' - ' + prices[item] + 'р.\n';
        //ctx.reply(item, index);
      });
    ctx.reply(`
Ваш заказ:
` + order)
})

  bot.command('skyrim', (ctx) =>{
    ctx.replyWithPhoto({ source: './tod.jpg' });
    for(i = 0; i < 5; i++)ctx.reply('Купи скайрим!')
  })
  
bot.command('/registr', (ctx) => {
  ctx.reply(`Ваш id для регистрации на сайте:`)
  ctx.reply(ctx.chat.id);
})
bot.launch();


console.log('Server-side code running');

const express = require('express');

const app = express('express');
app.use(express.json());

app.listen(3000, () => {
  console.log('listening on http://192.168.2.72:3000');
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/client.js', (req, res) => {
  res.sendFile(__dirname + '/public/client.js');
});

app.post('/prices', (req, res) => {
  //res.sendStatus(200);
  res.send(prices);
});

app.post('/orders', (req, res) => {
  res.send(choises_serv[req.body[1]]);
});

app.post('/add', (req, res) => {
  //res.send(choises_serv[req.body[1]]);
  choises[req.body[1]].push(parseInt(req.body[2]));
    choises_serv[req.body[1]][parseInt(req.body[2])]++;
    console.log(choises);
});