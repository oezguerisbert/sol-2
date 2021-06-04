const SecurePassword = require('secure-password');
const { Base64 } = require('js-base64');
const { PrismaClient } = require('@prisma/client');
const roomsJSON = require('../config/rooms.json');
const timesJSON = require('../config/times.json');
const { v4 } = require('uuid');

const prisma = new PrismaClient();
const formatWithLeadingZero = (n: number) => (n < 10 ? '0'.concat(n.toString()) : n.toString());
const formatDay = (date: Date): string => {
  return date
    .getDate()
    .toString()
    .concat('/')
    .concat(formatWithLeadingZero(date.getMonth() + 1))
    .concat('/')
    .concat(formatWithLeadingZero(date.getFullYear()))
    .concat(' ')
    .concat(formatWithLeadingZero(date.getHours()))
    .concat(':')
    .concat(formatWithLeadingZero(date.getMinutes()));
};

const weekNumber = (from: Date = new Date()) => {
  const date = new Date(from.getTime());
  date.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  // January 4 is always in week 1.
  var week1 = new Date(date.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
};

async function main() {
  for (const room of roomsJSON) {
    const createdRoom = await prisma.room.create({
      data: { ...room, roomid: v4() },
    });
    // if (createdRoom) {
    //   console.log(`Created Room: '${createdRoom.title}'<${createdRoom.roomid}>`);
    // }
  }
  await fillYear();

  await prisma.user.create({
    data: {
      userid: v4(),
      email: 'admin@localhost.com',
      password: '$argon2id$v=19$m=65536,t=2,p=1$yNOnlapWH0gmrRHX1o3yjg$YECWYGvB1huDezXPFF8+PjnbOCYexneR78LN1qzG1VA',
      role: 'admin',
    },
  });
}

const weekDay: Record<number, string> = {
  0: 'sunday',
  1: 'monday',
  2: 'tuesday',
  3: 'wednesday',
  4: 'thursday',
  5: 'friday',
  6: 'saturday',
};

const fillYear = async () => {
  const today = new Date();

  const endOfYear = new Date(today.getFullYear() + 1, 1, 1);
  const one_day = 1000 * 60 * 60 * 24;
  // const leftDays = Math.ceil((endOfYear.getTime() - today.getTime()) / one_day);
  const leftDays = 56;
  let lastCalculatedDay = today;
  let lastCreatedWeek = await prisma.week.create({
    data: { weekid: v4(), weekNumber: weekNumber(lastCalculatedDay) },
  });
  for (let i = 0; i <= leftDays; i++) {
    const dayOfWeek = lastCalculatedDay.getDay();
    if (dayOfWeek === 1) {
      lastCreatedWeek = await prisma.week.create({
        data: {
          weekid: v4(),
          weekNumber: weekNumber(lastCalculatedDay),
        },
      });
    }

    const { start, end } = timesJSON[weekDay[dayOfWeek]];
    const [startHour, startMinute] = (start as string).split(':').map((s) => parseInt(s));
    const [endHour, endMinute] = (end as string).split(':').map((s) => parseInt(s));

    const startDate = new Date(
      lastCalculatedDay.getFullYear(),
      lastCalculatedDay.getMonth(),
      lastCalculatedDay.getDate(),
      startHour,
      startMinute
    );

    const endDate = new Date(
      lastCalculatedDay.getFullYear(),
      lastCalculatedDay.getMonth(),
      lastCalculatedDay.getDate(),
      endHour,
      endMinute
    );

    const time = await prisma.times.create({
      data: {
        timesid: v4(),
        start: startDate,
        end: endDate,
      },
    });
    // if (time) {
    //   console.log(`Created Time: '${formatDay(time.start)} - ${formatDay(time.end)}'<${time.timesid}>`);
    // }
    await prisma.week.update({
      data: { days: { connect: { timesid: time.timesid } } },
      where: { weekid: lastCreatedWeek.weekid },
    });
    // console.log(
    //   `Connected week<${lastCreatedWeek.weekNumber},'${lastCreatedWeek.weekid}'> with times<'${time.timesid}'>`
    // );
    lastCalculatedDay.setDate(lastCalculatedDay.getDate() + 1);
  }
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
