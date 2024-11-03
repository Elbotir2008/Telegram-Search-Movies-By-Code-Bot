const TelegramBot = require('node-telegram-bot-api');
const token = '7416945525:AAHfNDjnz9OJdDYAA03fwrEEtR8GA-dVEFY';
const bot = new TelegramBot(token, { polling: true });

// Kino fayllari va kodlarini saqlovchi obyekt
let movies = {
    '1234': 'path/to/movie1.mp4',
    '5678': 'path/to/movie2.mp4'
};

// Admin Telegram ID’sini kiriting
const adminId = 5192347958; // Bu yerga adminning Telegram ID sini kiriting

// /start komandasini ushlaydi
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Salom! Kino kodini yuboring.');
});

// Kino kodini qo'shish (/add) komandasi
bot.onText(/\/add (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    
    // Faqat admin foydalanuvchiga ruxsat berish
    if (chatId !== adminId) {
        return bot.sendMessage(chatId, 'Sizda ushbu amalni bajarish uchun ruxsat yo\'q.');
    }
    
    const [code, path] = match[1].split(" ");
    if (!code || !path) {
        return bot.sendMessage(chatId, 'Noto\'g\'ri format. Foydalanish: /add <code> <file_path>');
    }

    // Kinoni movies obyektiga qo'shish
    movies[code] = path;
    bot.sendMessage(chatId, `Kino qo'shildi: ${code} - ${path}`);
});

// Kino kodini o'chirish (/delete) komandasi
bot.onText(/\/delete (.+)/, (msg, match) => {
    const chatId = msg.chat.id;

    // Faqat admin foydalanuvchiga ruxsat berish
    if (chatId !== adminId) {
        return bot.sendMessage(chatId, 'Sizda ushbu amalni bajarish uchun ruxsat yo\'q.');
    }

    const code = match[1].trim();

    if (movies[code]) {
        delete movies[code];
        bot.sendMessage(chatId, `Kino o'chirildi: ${code}`);
    } else {
        bot.sendMessage(chatId, 'Kino topilmadi.');
    }
});

// Kino kodini yuborganida ishlovchi funksiyani qo'shish
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text.trim();

    // Kino kodi tekshiriladi
    if (movies[text]) {
        // Kino mavjud bo'lsa, video jo'natiladi
        const videoPath = movies[text];
        bot.sendVideo(chatId, videoPath);
    } else if (text !== '/start' && !text.startsWith('/add') && !text.startsWith('/delete')) {
        bot.sendMessage(chatId, 'Bunday kino kodi topilmadi. Kodni to\'g\'ri kiriting.');
    }
});
        