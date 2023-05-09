FROM node:lts-bullseye
WORKDIR /usr/src/app/backend

COPY ./backend/package*.json .
RUN npm ci
COPY ./backend .
RUN npm run build
RUN mkdir ./dist/backend/uploads

WORKDIR dist/backend/neural-network-backbone
COPY ./neural-network-backbone .
RUN mkdir ./weights && cd ./weights && wget -O best.pt "https://s142vla.storage.yandex.net/rdisk/37d0be550a3dc98dca40d3b60f2a123f4270d2e9b12094b7a21132763bb08b66/645a9699/GYpy5MHHBa0isqNUmKGx5m5IXZVA-FFLzk03CP_n1rkM1dOwR6ag5kB4U25Uj0ekVb7R4faC74q_5TC95TK-ig==?uid=0&filename=best.pt&disposition=attachment&hash=azO6rEx2Ui6d17tvYfwE3F0OEQrI98eAj+WQzas3ZBK+Q7lP52s4guY/xZRl/g5Vq/J6bpmRyOJonT3VoXnDag==&limit=0&content_type=application/zip&owner_uid=161670372&fsize=92968661&hid=98ad4f69788ffdbf8bc39b6fdb8c068d&media_type=compressed&tknv=v2&rtoken=n4BVi8XXfkmK&force_default=no&ycrid=na-e3f7cbc0a1ee6434d85a8097d5a12a8e-downloader19e&ts=5fb4744701840&s=f8eaf94273a8d0361b3c8db1496425d0f63d106be2836c45089e5ba7d26171b3&pb=U2FsdGVkX1889c0Z5uPBVPj5fuDrdZKlrTraN1FQLmUUz2bXsChPVh3ufX-tXXjuA-1pu8UgN0ZP_YvcOWNhPsusW03H7H4OIYfbbDtmtXc"

ENV PYTHONUNBUFFERED=1
RUN apt update && apt install -y build-essential zlib1g-dev libncurses5-dev libgdbm-dev libnss3-dev libssl-dev libsqlite3-dev libreadline-dev libffi-dev curl libbz2-dev
RUN cd /usr/src && curl -O https://www.python.org/ftp/python/3.8.12/Python-3.8.12.tar.xz && tar -xf Python-3.8.12.tar.xz && cd Python-3.8.12 && ./configure --enable-optimizations && make -j 2 && make install
RUN python3 --version

RUN apt-get update && apt-get install ffmpeg libsm6 libxext6  -y

RUN pip3 install numpy Cython
RUN pip3 install -r ./requirements.txt
RUN pip3 install torch torchvision --index-url https://download.pytorch.org/whl/cpu

WORKDIR /usr/src/app/backend

CMD ["npm", "run", "start:prod"]