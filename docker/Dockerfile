FROM microsoft/mssql-server-linux:2017-latest
ENV SA_PASSWORD=W3D01NDAT4SH0!
ENV ACCEPT_EULA=Y
COPY entrypoint.sh entrypoint.sh
COPY startup.sh startup.sh
COPY init.sql init.sql
RUN chmod +x ./startup.sh
CMD /bin/bash ./entrypoint.sh