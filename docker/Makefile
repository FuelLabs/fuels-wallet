up:
	docker compose -p dev --env-file .env up -d --build 

up-test:
	docker compose -p test --env-file .env.test up -d --build

down:
	docker compose -p dev stop

down-test:
	docker compose -p test stop

clean:
	docker compose -p dev down --rmi local -v --remove-orphans

clean-test:
	docker compose -p test down --rmi local -v --remove-orphans
