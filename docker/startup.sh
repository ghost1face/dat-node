#wait for SQL Server to come up
sleep 15s
#run the script to init DB
/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P W3D01NDAT4SH0! -d master -i init.sql