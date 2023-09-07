# transcendence

## development

	- install node.js on your machine
	- install pnpm on your machine

 ### backend

	- `cd transcendence/backend`
	- `pnpm install` to install dependencies on your machine
	- `pnpm install -g @nestjs/cli`
	- `pnpm install prisma --save-dev`
	- `pnpm install @prisma/client`

Launch back with `pnpm start:dev` inside `transcendence/backend`
Acces is on http://localhost:3333

 ### database

Inside `transcendence/` enter `docker compose up dev-db -d` to launch the Database container

 ### frontend

	- `cd transcendence/frontend`
	- `pnpm install` to install dependencies on your machine

Launch front with `pnpm run dev` inside `transcendence/frontend`
Acces is on http://localhost:5173
