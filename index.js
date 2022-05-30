const { Telegraf } = require('telegraf')

const bot = new Telegraf('*'); //сюда помещается токен, который дал botFather

var users = {};

var choises = {};

var bluda = ['харчи', 'борщ с пампушками', 'салат веганский', 'мясо и мясо, че бухтеть то', 'коктель "Хунс', 'вода']

var prices = [100, 200, 1000, 33, 122, 10]

bot.start((ctx) => {
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
      provider_token: '*', // токен выданный через бот @SberbankPaymentBot 
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
    return ctx.replyWithInvoice(getInvoice(ctx.from.id)) //  метод replyWithInvoice для выставления счета  
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
    ctx.reply('Вы выбрали харчи');
})
  
bot.command('borch_s_pampushkami', (ctx) =>{
    choises[ctx.chat.id].push(1);
    ctx.reply('Вы выбрали борщ с пампушками \nгероям слава!');
})
  
bot.command('vegans', (ctx) =>{
    choises[ctx.chat.id].push(2);
    ctx.reply('Вы выбрали салат веганский');
})

bot.command('meat', (ctx) =>{
    choises[ctx.chat.id].push(3);
    ctx.reply('Вы выбрали мясо');
})

bot.command('huinks', (ctx) =>{
    choises[ctx.chat.id].push(4);
    ctx.reply('Вы выбрали коктель "Хунс"');
})

bot.command('voda', (ctx) =>{
    choises[ctx.chat.id].push(5);
    ctx.reply('Вы выбрали воду');
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
bot.launch();