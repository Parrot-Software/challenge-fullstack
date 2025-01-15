FROM python:3.9

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

# Add wait-for-it script to wait for database
ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

# Copy entrypoint script and set permissions
COPY entrypoint.sh .
RUN chmod +x entrypoint.sh \
    && chmod 755 entrypoint.sh \
    && sed -i 's/\r$//g' entrypoint.sh

COPY . .

ENTRYPOINT ["/bin/bash", "./entrypoint.sh"] 