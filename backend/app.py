from flask import Flask, request, jsonify
from flask_cors import CORS
from diffusers import StableDiffusionPipeline

app = Flask(__name__)
CORS(app)

model = StableDiffusionPipeline.from_pretrained("CompVis/stable-diffusion-v1-4", use_auth_token=True)

@app.route('/generate-image', methods=['POST'])
def generate_image():
    data = request.json
    prompt = data['prompt']
    image = model(prompt).images[0]
    image.save("output.png")
    return jsonify({"message": "Image generated successfully", "path": "output.png"})

if __name__ == '__main__':
    app.run(debug=True)
