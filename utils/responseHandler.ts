import OtherUtils from './tools';

export default class ResponseHandler {
  send(
    httpRespondler: any,
    responseCode: number,
    response: unknown,
    additionalData: unknown = null,
  ) {
    try {
      let contentType: string = 'application/json';
      if (typeof response === 'string') contentType = 'text/html';

      return httpRespondler.status(responseCode).send(
        Object.freeze({
          headers: {
            'Content-Type': contentType,
            'Last-Modified': new Date().toUTCString(),
          },
          statusCode: responseCode,
          body: response,
          additionalData,
        }),
      );
    } catch (error) {
      return OtherUtils.getErrorMessage(error);
    }
  }

  response(responseCode: number, response: unknown) {
    try {
      let contentType: string = 'application/json';
      if (typeof response === 'string') contentType = 'text/html';
      return Object.freeze({
        headers: {
          'Content-Type': contentType,
          'Last-Modified': new Date().toUTCString(),
        },
        statusCode: responseCode,
        body: response,
      });
    } catch (error) {
      return OtherUtils.getErrorMessage(error);
    }
  }
}
