# transcendence

## development

	- make a `pnpm install`` to install dependencies on your machine

 ### backend

	- install node.js on your machine

	- `cd transcendence/backend`
	- `pnpm install -g @nestjs/cli`
	- `pnpm install prisma --save-dev`
	- `pnpm install @prisma/client`

Launch back with `pnpm start:dev` inside `transcendence/backend`

Acces is on http://localhost:3333

 ### database

Inside `transcendence/` enter `docker compose up dev-db -d` to launch the Database container

 ### frontend

Launch front with `pnpm run dev` inside `transcendence/frontend`
Acces is on http://localhost:5173
