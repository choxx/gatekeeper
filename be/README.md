# Gatekeeper Backend

## Setup
- Clone the repo
- Navigate to directory `be`
- Create `.env` file. A `sample.env` file has been added for reference
- Hit `docker-compose up -d`

## Endpoints
### Configuration API (POST)
```
curl --location 'localhost:5000/configuration' \
--header 'x-api-key: {{ your-api-key-here }}' \
--header 'x-application-id: {{ your-application-id-here }}' \
--header 'x-admin-secret: {{ your-admin-secret-here }}' \
--header 'Content-Type: application/json' \
--data '{
    "cron": {
        "blocked": false
    },
    "system": {
        "error": {
            "type": "PERFORMANCE_DEGRADE",
            "title": "System under high load",
            "description": "System in running under high load. You may experience in slowness.",
            "action": "DISMISS"
        }
    },
    "actors": [
        {
            "id": "0",
            "error": {
                "type": "PERFORMANCE_DEGRADE",
                "title": "Servers are under high load",
                "description": "Servers are under high load. System will stabilize soon enough.",
                "action": "DISMISS"
            }
        }
    ]
}'
```

### Gatekeeper API (GET)
```
curl --location 'localhost:5000/gatekeeper' \
--header 'x-api-key: {{ your-api-key-here }}' \
--header 'x-application-id: {{ your-application-id-here }}'
```