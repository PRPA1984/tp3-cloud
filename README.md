Trabajo Práctico Nº3 de Computación en la Nube
Para ejecutar este proyecto, realizar los siguientes pasos:

Ejecutar docker run -p 8000:8000 --network awslocal --name dynamodb amazon/dynamodb-local -jar DynamoDBLocal.jar -sharedDb

Ingresar a http://localhost:8000/shell y ejecutar el script ubicado en el archivo Creacion de tabla e indice.txt

Ejecutar npm install

Ejecutar sam local start-api --docker-network awslocal
