FROM node:18-alpine
WORKDIR /usr/src/app

COPY ./backend/package*.json .
RUN npm ci
COPY ./backend .
RUN npm run build
RUN mkdir ./dist/backend/uploads

COPY ./neural-network-backbone ./dist/backend/neural-network-backbone

ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache 'python3=3.8.15-r0' 'python3-dev=3.8.15-r0' --repository=http://dl-cdn.alpinelinux.org/alpine/v3.13/main && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools
RUN apk add git build-base

RUN pip3 install numpy==1.24.2 Cython
# TODO заставить собираться lap
RUN cd ./dist/backend/neural-network-backbone && git clone https://github.com/gatagat/lap.git
RUN python3 ./dist/backend/neural-network-backbone/lap/setup.py build
RUN python3 ./dist/backend/neural-network-backbone/lap/setup.py install

RUN pip3 install -r ./dist/backend/neural-network-backbone/requirements.txt

CMD ["npm", "run", "start:prod"]