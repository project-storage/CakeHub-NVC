#!/bin/sh

# Note: Database migrations and seeding have been commented out to:
# 1. Prevent wiping out production database data every time the container restarts
# 2. Drastically reduce startup time (preventing client-side timeouts on Render cold-starts)
#
# If you need to sync the schema or seed the database, run these commands manually:
# - npx prisma db push
# - npx prisma db seed

# Sync database schema with schema.prisma (Run manually or during build/release pipeline instead)
# npx prisma db push --accept-data-loss

# Run seed data (Run manually instead)
# npx prisma db seed

# Start the application
npm run start:prod
