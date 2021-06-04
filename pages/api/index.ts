import { ApolloServer } from 'apollo-server-micro';
import { DateTimeResolver } from 'graphql-scalars';
import { asNexusMethod, intArg, makeSchema, nonNull, objectType, stringArg } from 'nexus';
import path from 'path';
import SecurePassword from 'secure-password';
import { v4 } from 'uuid';
import prisma from '../../lib/prisma';
import { weekNumber } from '../../src/utils/weekNumber';

export const GQLDate = asNexusMethod(DateTimeResolver, 'date');
const SEC_PASS = new SecurePassword();
const Room = objectType({
  name: 'Room',
  definition(t) {
    t.string('roomid');
    t.string('title');
    t.int('maxmembers');
    t.nullable.string('description');
    t.list.field('members', {
      type: 'User',
      resolve: (parent) => {
        return prisma.user.findMany({
          where: { roomId: parent.roomid },
        });
      },
    });
  },
});
const History = objectType({
  name: 'History',
  definition(t) {
    t.string('historyid');
    t.string('status');
    t.date('timestamp');
    t.nullable.string('userUserid');
    t.nullable.string('roomRoomid');
    t.field('user', {
      type: 'User',
      resolve: (parent) => {
        return prisma.user.findUnique({
          where: { userid: parent.userUserid },
        });
      },
    });
    t.field('room', {
      type: 'Room',
      resolve: (parent) => {
        return prisma.room.findUnique({
          where: { roomid: parent.roomRoomid },
        });
      },
    });
  },
});
const User = objectType({
  name: 'User',
  definition(t) {
    t.string('userid');
    t.string('email');
    t.string('password');
    t.string('role');
    t.nullable.string('roomId');
    t.nullable.field('room', {
      type: 'Room',
      resolve: (parent) => {
        return parent.roomId !== null
          ? prisma.room.findUnique({
              where: { roomid: parent.roomId },
            })
          : null;
      },
    });
  },
});

const Week = objectType({
  name: 'Week',
  definition(t) {
    t.string('weekid');
    t.int('weeknumber');
    t.list.field('days', {
      type: 'Times',
      resolve: async (parent) => {
        return await prisma.times.findMany({
          where: { weekId: parent.weekid },
        });
      },
    });
  },
});

const Times = objectType({
  name: 'Times',
  definition(t) {
    t.string('timesid');
    t.date('start');
    t.date('end');
    t.string('weekId');
    t.list.field('week', {
      type: 'Week',
      resolve: async (parent) => {
        return await prisma.week.findMany({
          where: { weekid: parent.weekId },
        });
      },
    });
  },
});

const Query = objectType({
  name: 'Query',
  definition(t) {
    t.field('room', {
      type: 'Room',
      args: {
        roomId: nonNull(stringArg()),
      },
      resolve: (_, { roomId }) => {
        return prisma.room.findUnique({
          where: { roomid: String(roomId) },
        });
      },
    });
    t.nullable.field('me', {
      type: User,
      resolve: (_root, _args, { user }) => {
        return user;
      },
    });
    t.list.field('statistics', {
      type: History,
      args: {
        roomid: stringArg(),
      },
      resolve: (_root, { roomid }) => {
        return roomid != null
          ? prisma.history.findMany({
              where: { room: { roomid } },
              orderBy: { timestamp: 'desc' },
            })
          : prisma.history.findMany({
              orderBy: { timestamp: 'desc' },
            });
      },
    });
    t.field('user', {
      type: 'User',
      args: {
        id: nonNull(stringArg()),
      },
      resolve: async (_, { id }) => {
        return await prisma.user.findUnique({ where: { userid: id }, include: { room: true } });
      },
    });

    t.list.field('users', {
      type: 'User',
      resolve: async (_) => {
        return await prisma.user.findMany({ include: { room: true } });
      },
    });

    t.list.field('rooms', {
      type: 'Room',
      resolve: async (_) => {
        return await prisma.room.findMany({ include: { members: true } });
      },
    });

    t.list.field('alltimes', {
      type: 'Times',
      resolve: async (_) => {
        return await prisma.times.findMany();
      },
    });

    t.list.field('times', {
      type: 'Times',
      args: {
        weeknumber: intArg(),
      },
      resolve: async (_, { weeknumber }) => {
        let realWeekNumber = weeknumber;
        if (realWeekNumber === null) {
          realWeekNumber = weekNumber();
        }
        return await prisma.times.findMany({
          include: { week: true },
          where: { week: { weekNumber: { equals: realWeekNumber } } },
          orderBy: { start: 'asc' },
        });
      },
    });
  },
});

const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    t.field('signup', {
      type: 'User',
      args: {
        password: nonNull(stringArg()),
        email: nonNull(stringArg()),
      },
      resolve: (_, { password, email }, ctx) => {
        const hashPassword = SEC_PASS.hashSync(Buffer.from(password)).toString('utf8').split(`\x00`).join('');

        return prisma.user.create({
          data: {
            userid: v4(),
            password: hashPassword,
            email,
          },
        });
      },
    });

    t.field('login', {
      type: 'User',
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      resolve: async (_, { password, email }, ctx) => {
        const user = await prisma.user.findFirst({
          where: {
            email,
          },
        });
        const hashedPwd = Buffer.alloc(SecurePassword.HASH_BYTES);
        hashedPwd.write(user.password, 'utf8');
        return SEC_PASS.verifySync(Buffer.from(password), hashedPwd).description === 'VALID' ? user : null;
      },
    });
    t.field('editUser', {
      type: 'User',
      args: {
        oldemail: nonNull(stringArg()),
        newemail: nonNull(stringArg()),
        password: nonNull(stringArg()),
        role: nonNull(stringArg()),
      },
      resolve: async (_, { password, oldemail, newemail, role }, ctx) => {
        if (password.length >= 4) {
          return await prisma.user.update({
            data: {
              email: newemail,
              password: SEC_PASS.hashSync(Buffer.from(password)).toString(),
              role,
            },
            where: {
              email: oldemail,
            },
          });
        } else {
          throw new Error('Password has to be at least 4 characters long');
        }
      },
    });
    t.field('userEnterRoom', {
      type: 'Room',
      args: {
        roomid: nonNull(stringArg()),
        userid: nonNull(stringArg()),
      },
      resolve: async (parent, { userid, roomid }) => {
        const user = await prisma.user.findUnique({ where: { userid }, include: { room: true } });

        if (user.roomId) {
          await prisma.history.create({
            data: {
              timestamp: new Date(),
              user: { connect: { userid } },
              room: { connect: { roomid: user.room.roomid } },
              status: 'left',
            },
          });
          await prisma.room.update({
            data: {
              members: {
                disconnect: { userid: user.userid },
              },
            },
            where: { roomid: user.roomId },
          });
        }
        const currentDate = new Date();
        const timeValid =
          (
            await prisma.times.findMany({
              where: {
                week: { weekNumber: { equals: weekNumber() } },
                end: { gte: currentDate },
                start: { lte: currentDate },
              },
            })
          ).length > 0;
        const room = await prisma.room.findUnique({ where: { roomid }, include: { members: true } });
        if (room.members.length + 1 <= room.maxmembers && timeValid) {
          await prisma.history.create({
            data: {
              timestamp: new Date(),
              user: { connect: { userid } },
              room: { connect: { roomid } },
              status: 'entered',
            },
          });
          return await prisma.room.update({
            data: {
              members: { connect: { userid: user.userid } },
            },
            where: { roomid },
          });
        }
        return null;
      },
    });

    t.field('userLeaveRoom', {
      type: 'Room',
      args: {
        roomid: nonNull(stringArg()),
        userid: nonNull(stringArg()),
      },
      resolve: async (parent, { userid, roomid }) => {
        const user = await prisma.user.findUnique({ where: { userid } });
        await prisma.history.create({
          data: {
            timestamp: new Date(),
            user: { connect: { userid } },
            room: { connect: { roomid } },
            status: 'left',
          },
        });
        return await prisma.room.update({
          data: {
            members: {
              disconnect: { userid: user.userid },
            },
          },
          where: { roomid: user.roomId },
        });
      },
    });

    t.field('editRoom', {
      type: 'Room',
      args: {
        roomid: nonNull(stringArg()),
        description: nonNull(stringArg()),
        maxmembers: nonNull(intArg()),
        title: nonNull(stringArg()),
      },
      resolve: async (parent, { description, maxmembers, title, roomid }) => {
        return await prisma.room.update({
          data: {
            maxmembers,
            description,
            title,
          },
          where: { roomid },
        });
      },
    });

    t.field('edittime', {
      type: 'Times',
      args: {
        timesid: nonNull(stringArg()),
        starttime: nonNull(stringArg()),
        endtime: nonNull(stringArg()),
      },
      resolve: async (parent, { timesid, starttime, endtime }) => {
        const tm = await prisma.times.findUnique({ where: { timesid } });
        const sD = tm.start;
        const eD = tm.end;
        const [startHours, startMinute] = starttime.split(':');
        const [endHours, endMinute] = endtime.split(':');
        sD.setHours(parseInt(startHours));
        sD.setMinutes(parseInt(startMinute));

        eD.setHours(parseInt(endHours));
        eD.setMinutes(parseInt(endMinute));

        return await prisma.times.update({
          data: {
            start: sD,
            end: eD,
          },
          where: { timesid },
        });
      },
    });
  },
});

export const schema = makeSchema({
  types: [Query, Mutation, History, Room, Week, Times, User, GQLDate],
  outputs: {
    typegen: path.join(process.cwd(), 'pages/api/nexus-typegen.ts'),
    schema: path.join(process.cwd(), 'pages/api/schema.graphql'),
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default new ApolloServer({ schema }).createHandler({
  path: '/api',
});
