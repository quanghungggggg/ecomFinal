# Sử dụng Python 3.9
FROM python:3.9

# Đặt thư mục làm việc
WORKDIR /code

# Copy file requirements và cài đặt thư viện
COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Tạo thư mục Cache cho Model (Để tránh lỗi quyền truy cập trên Hugging Face)
RUN mkdir -p /code/cache
ENV XDG_CACHE_HOME=/code/cache
ENV TRANSFORMERS_CACHE=/code/cache

# Cấp quyền cho user 1000 (User mặc định của HF)
RUN chown -R 1000:1000 /code

# Chuyển sang user non-root
USER 1000

# Copy toàn bộ code vào
COPY --chown=1000:1000 . /code

# Mở cổng 7860 (Cổng bắt buộc của Hugging Face)
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]