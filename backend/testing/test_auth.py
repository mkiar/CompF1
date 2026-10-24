from fastapi.testclient import TestClient
from main import app
import database

def test_signup_valid_account(test_db):
    client = TestClient(app)

    # valid account creation
    data = { "email": "google@gmail.com", "username": "Test", "password": "123456789", "confirm_password": "123456789"}
    response = client.post("/api/signup", json=data)
    
    assert response.status_code == 201, (f"Got {response.status_code}: {response.text}")

def test_signup_invalid_email(test_db):
    client = TestClient(app)

    # email field is not a valid email
    data = { "email": "google@com", "username": "Hello", "password": "123456789", "confirm_password": "123456789"}
    response = client.post("/api/signup", json=data)
    
    assert response.status_code == 422, (f"Got {response.status_code}: {response.text}")

def test_signup_invalid_username(test_db):
    client = TestClient(app)

    # Username length exceeds length limit
    data = { "email": "google@google.com", "username": "HHKHJKHhjkhdksfhdskjfhdskjhfjksdhfksfsjd324", "password": "123456789", "confirm_password": "123456789"}
    response = client.post("/api/signup", json=data)
    assert response.status_code == 422, (f"Got {response.status_code}: {response.text}")

    # Username length is too short
    data = { "email": "google@gmail.com", "username": "He", "password": "123456789", "confirm_password": "123456789"}
    response = client.post("/api/signup", json=data)
    assert response.status_code == 422, (f"Got {response.status_code}: {response.text}")

    # Username is not alphanumeric
    data = { "email": "google@yahoo.com", "username": "The GOAT123", "password": "123456789", "confirm_password": "123456789"}
    response = client.post("/api/signup", json=data)
    assert response.status_code == 422, (f"Got {response.status_code}: {response.text}")



def test_signup_invalid_password(test_db):
    client = TestClient(app)

    # password length is too short
    data = { "email": "google@google.com", "username": "Hello", "password": "123456", "confirm_password": "123456"}
    response = client.post("/api/signup", json=data)
    
    assert response.status_code == 422, (f"Got {response.status_code}: {response.text}")

def test_signup_invalid_confirm_password(test_db):
    client = TestClient(app)

    # password and confirm password do not match
    data = { "email": "google@google.com", "username": "Hello", "password": "12345678", "confirm_password": "123456789"}
    response = client.post("/api/signup", json=data)
    
    assert response.status_code == 422, (f"Got {response.status_code}: {response.text}")

def test_signup_duplicate_username(test_db):
    client = TestClient(app)

    # username field is automatically lowered when passed the post request, so it reads both usernames as the same one
    data = { "email": "google@google.com", "username": "user", "password": "12345678", "confirm_password": "12345678"}
    response = client.post("/api/signup", json=data)
    assert response.status_code == 201, (f"Got {response.status_code}: {response.text}")
    
    data = { "email": "google@yahoo.com", "username": "User", "password": "12345678", "confirm_password": "12345678"}
    response = client.post("/api/signup", json=data)
    assert response.status_code == 409, (f"Got {response.status_code}: {response.text}")

def test_signup_duplicate_email(test_db):
    client = TestClient(app)

    data = { "email": "google@google.com", "username": "User", "password": "12345678", "confirm_password": "12345678"}
    response = client.post("/api/signup", json=data)
    assert response.status_code == 201, (f"Got {response.status_code}: {response.text}")

    data = { "email": "google@google.com", "username": "DifferentUser", "password": "12345678", "confirm_password": "12345678"}
    response = client.post("/api/signup", json=data)
    assert response.status_code == 409, (f"Got {response.status_code}: {response.text}")

def test_signup_missing_field(test_db):
    client = TestClient(app)

    # missing confirm_password field
    data = { "email": "google@google.com", "username": "Hello", "password": "123456789"}
    response = client.post("/api/signup", json=data)
    assert response.status_code == 422, (f"Got {response.status_code}: {response.text}")

    # missing password field
    data = { "email": "google@gmail.com", "username": "Hello1", "confirm_password": "123456789"}
    response = client.post("/api/signup", json=data)
    assert response.status_code == 422, (f"Got {response.status_code}: {response.text}")

    # missing username field
    data = { "email": "google@yahoo.com", "password": "123456789", "confirm_password": "123456789"}
    response = client.post("/api/signup", json=data)
    assert response.status_code == 422, (f"Got {response.status_code}: {response.text}")

    # missing email field
    data = { "username": "Hello2", "password": "123456789", "confirm_password": "123456789"}
    response = client.post("/api/signup", json=data)
    assert response.status_code == 422, (f"Got {response.status_code}: {response.text}")

def test_login(test_db):
    client = TestClient(app)

    # create new account
    data = { "email": "google@google.com", "username": "Hello", "password": "123456789", "confirm_password": "123456789"}
    response = client.post("/api/signup", json=data)
    assert response.status_code == 201, (f"Got {response.status_code}: {response.text}")

    # login to new account
    data = { "username": "Hello", "password": "123456789"}
    response = client.post("/api/login", json=data)
    assert response.status_code == 200, (f"Got {response.status_code}: {response.text}")

    # verify that user is logged in
    response = client.get("/api/me")
    assert response.status_code == 200, (f"Got {response.status_code}: {response.text}")

def test_logout(test_db):
    client = TestClient(app)

    # create new account
    data = { "email": "google@google.com", "username": "Hello", "password": "123456789", "confirm_password": "123456789"}
    response = client.post("/api/signup", json=data)
    assert response.status_code == 201, (f"Got {response.status_code}: {response.text}")
    
    # login to new account
    data = { "username": "Hello", "password": "123456789"}
    response = client.post("/api/login", json=data)
    assert response.status_code == 200, (f"Got {response.status_code}: {response.text}")
    
    # verify that user is logged in
    response = client.get("/api/me")
    assert response.status_code == 200, (f"Got {response.status_code}: {response.text}")

    # logout the user
    response = client.post("/api/logout")
    assert response.status_code == 200, (f"Got {response.status_code}: {response.text}")

    # verify that user is logged out
    response = client.get("/api/me")
    assert response.status_code == 401, (f"Got {response.status_code}: {response.text}")
