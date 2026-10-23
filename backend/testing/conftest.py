import pytest
import database

@pytest.fixture
def test_db(tmp_path, monkeypatch):
    monkeypatch.setattr(
        database,
        "DATABASE",
        str(tmp_path / "test_compf1.db")
    )

    database.init_db()