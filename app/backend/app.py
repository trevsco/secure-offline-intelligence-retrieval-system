from flask import Flask
from flask_cors import CORS
from routes.upload import upload_bp
from routes.analysis import analysis_bp
from routes.search import search_bp
from routes.dashboard import dashboard_bp

app = Flask(__name__)
CORS(app)  # Allow all origins (React dev server on localhost:3000)

# Register blueprints
app.register_blueprint(upload_bp, url_prefix="/api")
app.register_blueprint(analysis_bp, url_prefix="/api")
app.register_blueprint(search_bp, url_prefix="/api")
app.register_blueprint(dashboard_bp, url_prefix="/api")

if __name__ == "__main__":
    app.run(debug=True, port=5000)
    