import uvicorn

if __name__ == "__main__":
    print("==================================================")
    print("Starting JobCurrent FastAPI Server...")
    print("Open http://localhost:8000/docs for Swagger UI")
    print("==================================================")
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
