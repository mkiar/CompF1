from fastapi.testclient import TestClient
from main import app
import database

def test_signup_valid_account(test_db):
    client = TestClient(app)

    data = { "email": "google@gmail.com", "username": "Test", "password": "123456789", "confirm_password": "123456789"}
    response = client.post("/api/signup", json=data)
    
    assert response.status_code == 200, (f"Got {response.status_code}: {response.text}")

def test_signup_invalid_email(test_db):
    client = TestClient(app)

    data = { "email": "google@com", "username": "Hello", "password": "123456789", "confirm_password": "123456789"}
    response = client.post("/api/signup", json=data)
    
    assert response.status_code == 422, (f"Got {response.status_code}: {response.text}")

def test_signup_invalid_username(test_db):
    client = TestClient(app)

    data = { "email": "google@google.com", "username": "HHKHJKHhjkhdksfhdskjfhdskjhfjksdhfksfsjdkfhsdkf", "password": "123456789", "confirm_password": "123456789"}
    response = client.post("/api/signup", json=data)
    
    assert response.status_code == 422, (f"Got {response.status_code}: {response.text}")

def test_signup_invalid_password(test_db):
    client = TestClient(app)

    data = { "email": "google@google.com", "username": "Hello", "password": "123456", "confirm_password": "123456"}
    response = client.post("/api/signup", json=data)
    
    assert response.status_code == 422, (f"Got {response.status_code}: {response.text}")

def test_signup_invalid_confirm_password(test_db):
    client = TestClient(app)

    data = { "email": "google@google.com", "username": "Hello", "password": "12345678", "confirm_password": "123456789"}
    response = client.post("/api/signup", json=data)
    
    assert response.status_code == 422, (f"Got {response.status_code}: {response.text}")

def test_signup_duplicate_username(test_db):
    client = TestClient(app)
    
    data = { "email": "google@google.com", "username": "user", "password": "12345678", "confirm_password": "12345678"}
    response_one = client.post("/api/signup", json=data)
    
    data = { "email": "google@yahoo.com", "username": "User", "password": "12345678", "confirm_password": "12345678"}
    response_two = client.post("/api/signup", json=data)
        
    assert response_one.status_code == 200, (f"Got {response_one.status_code}: {response_one.text}")
    assert response_two.status_code == 409, (f"Got {response_two.status_code}: {response_two.text}")

def test_signup_duplicate_email(test_db):
    client = TestClient(app)

    data = { "email": "google@google.com", "username": "User", "password": "12345678", "confirm_password": "12345678"}
    response_one = client.post("/api/signup", json=data)

    data = { "email": "google@google.com", "username": "DifferentUser", "password": "12345678", "confirm_password": "12345678"}
    response_two = client.post("/api/signup", json=data)
    
    assert response_one.status_code == 200, (f"Got {response_one.status_code}: {response_one.text}")
    assert response_two.status_code == 409, (f"Got {response_two.status_code}: {response_two.text}")

def test_signup_missing_field(test_db):
    client = TestClient(app)

    data = { "email": "google@google.com", "username": "Hello", "password": "123456789"}
    response = client.post("/api/signup", json=data)
    
    assert response.status_code == 422, (f"Got {response.status_code}: {response.text}")