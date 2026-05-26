from flask import Blueprint, jsonify

review_api = Blueprint("review_api", __name__, url_prefix="/api/review")


@review_api.get("/health")
def health():
    return jsonify({"status": "ok"})
