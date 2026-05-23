#!/bin/sh

# Sync database schema with schema.prisma
npx prisma db push --accept-data-loss

# Run seed data (Admin user, etc.)
npx prisma db seed

# Start the application
npm run start:prod
