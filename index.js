require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const keyboards = require("./helpers/keyboards");
const { read, write } = require("./utils/FS.readWrite");

const courses = {};

const bot = new TelegramBot(process.env.TELEGRAM_BOT_API, {
  polling: true,
});

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, `Assalom-u Aleykum, ${msg.from.username}`, {
    reply_markup: JSON.stringify({
      keyboard: keyboards.info,
      resize_keyboard: true,
    }),
  });
});

bot.on("message", (msg) => {
  const chatId = msg.chat.id;

  if (msg.text == "Bizning kurslar 🧠") {
    bot.sendMessage(chatId, "Bizning kurslar 🧠", {
      reply_markup: JSON.stringify({
        keyboard: keyboards.courses,
        resize_keyboard: true,
      }),
    });
  }

  if (msg.text == "Biz haqimizda 📈") {
    bot.sendMessage(
      chatId,
      "Everything on its About Us page—from the simple black-and-white format to the images—screams quality and innovation. As you craft your About Us story, consider infusing it with your brand personality by using different branding elements. Bonus points if you can sprinkle in reasons why your customers should trust your brand over others. To illustrate, BRADY states its focus is on producing the world’s “finest performance brand.” "
    );
  }

  if (msg.text == "Bizning Manzil 📍") {
    bot.sendMessage(chatId, "Bizning Manzil: Tashkent, Amir Temur street 21");
  }

  if (msg.text == "Previous ⬅") {
    bot.sendMessage(chatId, "Previous ⬅", {
      reply_markup: JSON.stringify({
        keyboard: keyboards.info,
        resize_keyboard: true,
      }),
    });
  }
});

bot.on("message", (msg) => {
  const chatId = msg.chat.id;

  const foundCourse = read("courses.model.json").find(
    (e) => e.course == msg.text
  );

  if (foundCourse) {
    bot.sendPhoto(
      chatId,
      "https://www.quotemaster.org/images/99/99c1b099c8143b9eb12f789b01916654.png",
      {
        caption: `
        <strong>${foundCourse.course}</strong>
        \n<i>Price: ${foundCourse.price}</i>
        
    `,
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Register",
                callback_data: "course_registration",
              },
            ],
          ],
        },
      }
    );
  }
});

bot.on("callback_query", (msg) => {
  const chatId = msg.message.chat.id;
  if (msg.data == "course_registration") {
    const register = msg.message.caption.split("\n");

    courses.courseName = register[0];
    courses.coursePrice = register[2];

    bot.deleteMessage(chatId, msg.message.message_id);

    bot.sendMessage(
      chatId,
      `
    <strong>${courses.courseName}</strong>
    \n<i>${courses.coursePrice}</i>
    `,
      {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Register",
                callback_data: "book_course",
              },
            ],
          ],
        },
      }
    );
  }

  if (msg.data == "book_course") {
    bot.sendMessage(chatId, "Send your phone number", {
      reply_markup: JSON.stringify({
        keyboard: [
          [
            {
              text: "Send",
              request_contact: true,
            },
          ],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      }),
    });
  }
});

bot.on("contact", (msg) => {
  const chatId = msg.chat.id;

  if (msg.contact) {
    const data = read("students.model.json");

    data.push({
      id: data[data.length - 1]?.id + 1 || 1,
      username: msg.chat.username,
      course: courses[0],
      phone: msg.contact.phone_number,
    });

    write("students.model.json", data);

    bot.sendMessage(chatId, "Registration completed successfully ✅", {
      reply_markup: JSON.stringify({
        keyboard: keyboards.info,
        resize_keyboard: true,
      }),
    });
  }
});
