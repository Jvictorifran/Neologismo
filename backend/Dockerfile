FROM python:3.13-slim

# Boas práticas Python em container
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app

# postgresql-client fornece o pg_isready usado pelo entrypoint
RUN apt-get update \
    && apt-get install -y --no-install-recommends postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Instala dependências primeiro para aproveitar o cache de camadas
COPY requirements.txt .
RUN pip install -r requirements.txt gunicorn

# Copia o restante do código
COPY . .

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["/entrypoint.sh"]
# Comando padrão (dev). Em produção o compose sobrescreve com gunicorn.
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
