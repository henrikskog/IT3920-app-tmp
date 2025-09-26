FROM python:3.12-slim

# Install uv.
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

COPY pyproject.toml uv.lock /app/
WORKDIR /app
RUN uv sync --frozen --no-cache  # Cached unless dependencies change

# Copy source code last so you dont have to rerun uv sync 
COPY . /app

# Run the application.
CMD ["uv", "run", "fastapi", "run", "app/main.py", "--port", "80", "--host", "0.0.0.0"]