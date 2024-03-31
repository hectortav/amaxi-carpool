cd carpool
git fetch --all
git reset --hard origin/main

docker build -t web:latest .
docker compose up -d

DATABASE_URL='mysql://<user>:<password>@localhost:3306/carpool?parseTime=true' npx prisma db push --schema prisma/schema.prisma

