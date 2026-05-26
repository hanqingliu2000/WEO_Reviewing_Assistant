from flask import Flask, jsonify

from weo_review_backend.features.review.api.review_routes import review_api


def create_app() -> Flask:
    app = Flask(__name__)
    app.register_blueprint(review_api)

    @app.get("/health")
    def health():
        return jsonify({"status": "ok"})

    return app
