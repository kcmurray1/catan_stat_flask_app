from app import create_app

# NOTE: This file is used to run the application locally
def main():
    
    app = create_app()
    app.run(debug=True)

if __name__ == "__main__":
    main()