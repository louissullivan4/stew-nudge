# Nudge - Occurrence Based Reminder App

User crud operations
- Create:
```
curl -X POST http://localhost:3000/users -H "Content-Type: application/json" -d '{"email": "john.doe2@example.com","username": "johndoe2","first_name": "John","last_name": "Doe","phone_number": "1234567890","timezone": "UTC","subscription": true,"birthday": "1990-01-01"}'
```

- Get (by id):
```
curl -X GET http://localhost:3000/users/123e4567-e89b-12d3-a456-426614174000
```

- Update (by id):
```
curl -X PUT http://localhost:3000/users/123e4567-e89b-12d3-a456-426614174000 -H "Content-Type: application/json" -d '{"first_name": "Johnny","last_name": "Doe","phone_number": "0987654321"}'
```

- Delete (by id):
```
curl -X DELETE http://localhost:3000/users/123e4567-e89b-12d3-a456-426614174000
```