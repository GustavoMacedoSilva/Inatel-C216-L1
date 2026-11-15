
import os
import subprocess
import sys
from pathlib import Path


ROOT_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = ROOT_DIR / "frontend"

COMPOSE = [
    "docker",
    "compose",
    "-p",
    "lab-e2e",
    "-f",
    str(ROOT_DIR / "docker-compose.yml"),
]

NPM = "npm.cmd" if os.name == "nt" else "npm"

COMPOSE_ENV = os.environ.copy()
COMPOSE_ENV.update({
    "API_PORT": "8001",
    "DB_PORT": "5433",
})


def run_command(command, cwd=ROOT_DIR, env=None):
    print(f"\nExecutando: {' '.join(command)}", flush=True)

    subprocess.run(
        command,
        cwd=cwd,
        env=env,
        check=True,
    )


def main():
    exit_code = 0

    try:
        print("Iniciando ambiente E2E...", flush=True)

        run_command(
            COMPOSE + [
                "up",
                "-d",
                "--build",
                "--wait",
                "db",
                "api",
            ],
            env=COMPOSE_ENV,
        )

        print("\nAplicando migrations...", flush=True)

        run_command(
            COMPOSE + [
                "run",
                "--rm",
                "api",
                "alembic",
                "upgrade",
                "head",
            ],
            env=COMPOSE_ENV,
        )

        print("\nExecutando testes Playwright...", flush=True)

        frontend_env = os.environ.copy()
        frontend_env["VITE_API_URL"] = "http://127.0.0.1:8001"

        run_command(
            [NPM, "run", "test:e2e"],
            cwd=FRONTEND_DIR,
            env=frontend_env,
        )

        print("\nTodos os testes E2E passaram!", flush=True)

    except FileNotFoundError as error:
        print(f"\nExecutável não encontrado: {error}", file=sys.stderr)
        exit_code = 127

    except subprocess.CalledProcessError as error:
        print(
            f"\nComando falhou com código {error.returncode}.",
            file=sys.stderr,
        )
        exit_code = error.returncode or 1

    finally:
        print("\nLimpando ambiente E2E...", flush=True)

        try:
            cleanup = subprocess.run(
                COMPOSE + [
                    "down",
                    "-v",
                    "--remove-orphans",
                ],
                cwd=ROOT_DIR,
                env=COMPOSE_ENV,
                check=False,
            )

            if cleanup.returncode != 0:
                print(
                    "Aviso: não foi possível limpar completamente "
                    "o ambiente E2E.",
                    file=sys.stderr,
                )

                if exit_code == 0:
                    exit_code = cleanup.returncode

        except FileNotFoundError:
            print(
                "Docker Compose não encontrado durante a limpeza.",
                file=sys.stderr,
            )

            if exit_code == 0:
                exit_code = 127

    return exit_code


if __name__ == "__main__":
    sys.exit(main())
