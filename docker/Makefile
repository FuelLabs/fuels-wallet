start:
	docker compose -p dev --env-file .env up -d --build 

start-test:
	docker compose -p test --env-file .env.test up -d --build

stop:
	docker compose -p dev down --rmi local -v --remove-orphans
	docker compose -p test down --rmi local -v --remove-orphans
