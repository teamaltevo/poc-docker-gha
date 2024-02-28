import {afterAll, beforeAll, describe, expect, test} from '@jest/globals';
import { PrismaClient, User } from '@prisma/client'

const prisma = new PrismaClient()


beforeAll(async () => {
  return await prisma.user.create({
    data: {
      name: 'Alice',
      email: 'alice@prisma.io',
      posts: {
        create: [
          { title: 'Hello World' },
          { title: 'Join us for Prisma Day 2021' },
        ]
      },
      profile: {
        create: { bio: 'I like turtles' },
      },
    },
  })
});

test('Alice exist', async () => {
  const alice: User = await prisma.user.findUniqueOrThrow({
    where: { email: 'alice@prisma.io' }
  })

  expect(alice).toBeDefined()
  expect(alice.name).toEqual('Alice')  
});

test('Alice has 2 posts', async () => {
  const count = await prisma.post.count({
    where: { author: { email: 'alice@prisma.io' } }
  })

  expect(count).toBe(2)
});

afterAll(async () => {
  await prisma.$disconnect()
});