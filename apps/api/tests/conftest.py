import os

# Disable assistant rate limits before the app module is imported in route tests.
os.environ.setdefault("APP_ENV", "test")
