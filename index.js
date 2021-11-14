const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')

const token = '2109766417:AAEyWdN1X8KUSWjbz4SJrVHiYclcVDjlIrE'

const bot = new TelegramApi(token, {polling: true})

const chats = {}

bot.setMyCommands([
    { command: '/start', description: 'Стартове вітання' },
    { command: '/info', description: 'Інформація про користувача' },
    { command: '/game', description: 'Розпочати гру' },
])

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Зараз я загадаю цифру від 1 до 10, а ти спробуй її відгадати!')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;

    await bot.sendMessage(chatId, 'Відгадай!', gameOptions)
}

const start = () => {
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if(text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/80a/5c9/80a5c9f6-a40e-47c6-acc1-44f43acc0862/1.webp')
            return  bot.sendMessage(chatId, 'Добро пожаловать в телеграм бот MarsTestBot')
        }
        if(text === '/info') {
            return  bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}`)
        }

        if(text === '/game') {
            return startGame(chatId)
        }

        return bot.sendMessage(chatId, 'Я тебе не розумію')
    })

    bot.on('callback_query', msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if(data === '/again') {
            return startGame(chatId)
        }
        if(data == chats[chatId]) {
            return bot.sendMessage(chatId, `Вітаю, ти відгадав цифру ${chats[chatId]}`, againOptions)
        } else {
            return bot.sendMessage(chatId, `Нажаль ти не відгадав, бот загадав цифру ${chats[chatId]}`, againOptions)
        }
    })
}

start()