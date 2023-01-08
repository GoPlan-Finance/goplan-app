FROM node:19


WORKDIR /var/www/goplan-finance/app
ADD .  /var/www/goplan-finance/app

########################################################################################################################
###   Config & Params                                                                                                ###
########################################################################################################################

# Add chromium if PDF generation is needed
RUN apt-get update && apt-get -y install vim \
    && rm -rf /var/lib/apt/lists/*


# @todo this might conflict with an existing bashrc
ADD k8s/scripts/bashrc.sh  /root/.login_banner.sh

RUN echo "sh /root/.login_banner.sh" >>  /root/.bashrc



########################################################################################################################
###   Common Stuff                                                                                                   ###
########################################################################################################################

RUN yarn install --frozen-lockfile  --cache-folder .yarncache  \
    && rm -rf .yarncache

########################################################################################################################
###   FRONTEND                                                                                                       ###
########################################################################################################################

RUN echo "prod" > ./frontend/.env

RUN yarn --cwd frontend run frontend-build \
    && rm -rf frontend/node_modules


########################################################################################################################
###   BACKEND                                                                                                            ###
########################################################################################################################


########################################################################################################################
###   HTTPS & LetsEncrypt                                                                                            ###
########################################################################################################################

ENV APP_ID=
ENV MASTER_KEY=
ENV DATABASE_URI=

EXPOSE 80 1337

ENV PARSE_PORT=80

CMD [ "yarn", "--cwd" , "backend" , "run", "backend-serve" ]
