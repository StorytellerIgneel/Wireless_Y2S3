import os
import zipfile
import requests
from flask import Flask, request, jsonify, Blueprint
from flask_cors import CORS
app = Flask(__name__)
CORS(app)  # Allow requests from React Native

@app.route("/download", methods=["POST"])
def download_and_extract_gutenberg_book(book_id, sandbox_path="sandbox/books"):
    base_url = f"https://www.gutenberg.org/files/{book_id}/{book_id}-h.zip"
    zip_filename = f"pg{book_id}-h.zip"
    download_path = os.path.join(sandbox_path, zip_filename)
    extract_dir = os.path.join(sandbox_path, str(book_id))

    # Make sure sandbox directory exists
    os.makedirs(extract_dir, exist_ok=True)

    # Step 1: Download ZIP file
    response = requests.get(base_url)
    if response.status_code != 200:
        raise Exception(f"Failed to download book {book_id}. HTTP {response.status_code}")
    with open(download_path, "wb") as f:
        f.write(response.content)
    print(f"Downloaded ZIP to {download_path}")

    # Step 2: Extract ZIP file
    with zipfile.ZipFile(download_path, 'r') as zip_ref:
        zip_ref.extractall(extract_dir)
    print(f"Extracted to {extract_dir}")

    # Step 3: Locate the main HTML file
    html_file = None
    for file in os.listdir(extract_dir):
        if file.endswith(".htm") or file.endswith(".html"):
            html_file = file
            break

    if not html_file:
        raise Exception("No HTML file found in the extracted folder.")

    # Full path to HTML file
    full_html_path = os.path.abspath(os.path.join(extract_dir, html_file))
    print(f"HTML path: {full_html_path}")

    return full_html_path

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=6000, debug=True)