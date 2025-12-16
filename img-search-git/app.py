import faiss
import numpy as np
import torch
import clip
from PIL import Image
from fastapi import FastAPI, UploadFile, File
import uvicorn
import os

# Load CLIP
device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = clip.load("ViT-B/32", device=device)

def get_embedding(img):
    img_preprocessed = preprocess(img).unsqueeze(0).to(device)
    with torch.no_grad():
        feat = model.encode_image(img_preprocessed)
    feat = feat.cpu().numpy().flatten()
    return feat / np.linalg.norm(feat)

index = faiss.read_index("faiss_index.bin")
product_ids = np.load("mapping.npy")

# API
app = FastAPI()

@app.post("/search")
async def search(file: UploadFile = File(...)):
    img = Image.open(file.file).convert("RGB")
    q_emb = get_embedding(img).reshape(1, -1).astype("float32")

    index.nprobe = 10  
    D, I = index.search(q_emb, k=1)
    pid = product_ids[I[0][0]]
    # return {"productid": str(pid), "distance": float(D[0][0])}
    return {"productId": str(pid), "distance": float(D[0][0])}


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
