var AWS = require('aws-sdk');
const { 
    v1: uuidv1,
    v4: uuidv4,
  } = require('uuid')

exports.handler = async (event) => {
    var dynamodb = new AWS.DynamoDB({
        apiVersion: '2012-08-10',
        endpoint: 'http://dynamodb:8000',
        region: 'us-west-2',
        credentials: {
            accessKeyId: '2345',
            secretAccessKey: '2345'
        }
    });
    var docClient = new AWS.DynamoDB.DocumentClient({
        apiVersion: '2012-08-10',
        service: dynamodb
    });


    if(event.path === '/envios' && event.httpMethod === 'POST'){
        if (event.body == null){
            return {body: 'Debe enviar el destino y su direccion de email', statusCode: 400}
        }
        let body = JSON.parse(event.body)
        if (body.destino === null || typeof body.destino !== 'string') {
            return {body: 'Debe enviar el destino como string', statusCode: 400}
        }
        else if (body.email === null || typeof body.email !== 'string') {
            return {body: 'Debe enviar el email como string', statusCode: 400}
        }
        let params = {
            TableName: 'Envio',
            Item: {
                id: uuidv4(),
                fechaAlta: new Date().toString(),
                destino: body.destino,
                email: body.email,
                pendiente: new Date().toString()
            }
        };
        let response
        await docClient.put(params, function(err, data) {
            if (err) {
                response = {body: 'Error al guardar el objeto', statusCode: 400}
            }
            else {
                response = {body: params.Item, statusCode: 200}
            }
        }).promise()

        return response
    }

    else if (event.path === '/envios/pendientes' && event.httpMethod === 'GET') {
        var params = {
            TableName: 'Envio',
            IndexName: 'EnviosPendientesIndex'
        };

        let response
        await docClient.scan(params, function(err, data) {
            if (err) {
                response = {body: 'Error al buscar envios pendientes', statusCode: 400}
            }
            else {
                response = {body: data.Items, statusCode: 200}
            }
        }).promise();

        return response
    }

    else if (event.path === `/envios/${event.pathParameters.idEnvio}/entregado`) {
        var params = {
            TableName : "Envio",
            Key : {
                "id": event.pathParameters.idEnvio           
            },
            UpdateExpression : "REMOVE pendiente",
            ReturnValues : "UPDATED_NEW"
        };

        let response
        await docClient.update(params, function(err, data) {
            if (err) {
                response = {body: 'No se pudo actualizar el elemento', statusCode:400}
            } else {
                console.log(JSON.stringify(data))
                response = {body: `Objeto con id ${event.pathParameters.idEnvio} marcado como entregado`, statusCode:200}
            }
        }).promise();
        return response
    }
    else {
        return {body: 'Ruta no encontrada', statusCode:400}
    }
}
