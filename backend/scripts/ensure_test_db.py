import os

import psycopg
from psycopg import sql
from sqlalchemy.engine import make_url


def main():
    test_url = make_url(os.environ["TEST_DATABASE_URL"])
    database_name = test_url.database

    if not database_name:
        raise RuntimeError(
            "TEST_DATABASE_URL precisa informar o nome do banco."
        )

    admin_url = test_url.set(
        drivername="postgresql",
        database="postgres",
    )

    with psycopg.connect(
        admin_url.render_as_string(hide_password=False),
        autocommit=True,
    ) as connection:

        database_exists = connection.execute(
            "SELECT 1 FROM pg_database WHERE datname = %s",
            (database_name,),
        ).fetchone()

        if database_exists is None:
            connection.execute(
                sql.SQL("CREATE DATABASE {}").format(
                    sql.Identifier(database_name)
                )
            )
            print(f"Banco de testes '{database_name}' criado.")
        else:
            print(f"Banco de testes '{database_name}' já existe.")


if __name__ == "__main__":
    main()