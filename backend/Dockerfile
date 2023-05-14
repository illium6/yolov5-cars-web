FROM node:lts-bullseye
WORKDIR /usr/src/app/backend

COPY ./backend/package*.json .
RUN npm ci
COPY ./backend .
RUN npm run build
RUN mkdir ./dist/backend/uploads
RUN mkdir ./dist/backend/uploads/input
RUN mkdir ./dist/backend/uploads/output

WORKDIR dist/backend/neural-network-backbone
COPY ./neural-network-backbone .
RUN mkdir ./weights && cd ./weights && wget -O best.pt "https://s142vla.storage.yandex.net/rdisk/74a58aba9e9f215f9985fc7e2abcdcfd1c3731a16475405d5a9ff1bfd4be3ce2/64610742/GYpy5MHHBa0isqNUmKGx5m5IXZVA-FFLzk03CP_n1rkM1dOwR6ag5kB4U25Uj0ekVb7R4faC74q_5TC95TK-ig==?uid=161670372&filename=best.pt&disposition=attachment&hash=&limit=0&content_type=application/zip&owner_uid=161670372&fsize=92968661&hid=98ad4f69788ffdbf8bc39b6fdb8c068d&media_type=compressed&tknv=v2&etag=15491e1a074da5f88c51d319a5b4264c&rtoken=A7hIIEDFFEGZ&force_default=yes&ycrid=na-8ca9d4bce5f089704bc7df4aa884042c-downloader6h&ts=5fba988fed480&s=61db14c2303de2b79bb100ccaacad818aa34da01c4d9b2624e574a29af73d3c0&pb=U2FsdGVkX1_GM4PwFOP3bV5z52a7Bm7uj57qlKJ62mr02A9hHrLmdauyDoHgkqk3JnuyoDWFavbCgHswXIsKLMsDb4vxGL3tBHrAZ5Sblxk"

ENV PYTHONUNBUFFERED=1
RUN apt update && apt install -y build-essential zlib1g-dev libncurses5-dev libgdbm-dev libnss3-dev libssl-dev libsqlite3-dev libreadline-dev libffi-dev curl libbz2-dev
RUN cd /usr/src && curl -O https://www.python.org/ftp/python/3.8.12/Python-3.8.12.tar.xz && tar -xf Python-3.8.12.tar.xz && cd Python-3.8.12 && ./configure --enable-optimizations && make -j 2 && make install
RUN python3 --version

RUN apt-get update && apt-get install ffmpeg libsm6 libxext6 -y

RUN pip3 install numpy Cython
RUN pip3 install -r ./requirements.txt
RUN pip3 install torch torchvision --index-url https://download.pytorch.org/whl/cpu

WORKDIR /usr/src/app/backend

CMD ["npm", "run", "start:prod"]