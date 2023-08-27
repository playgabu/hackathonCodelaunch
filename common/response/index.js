class Response {
  constructor() {
    this.responseObject = {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      statusCode: 200,
      body: "",
    };
  }

  set statusCode(statusCode) {
    this.responseObject.statusCode = statusCode;
  }

  set body(bodyObject) {
    this.responseObject.body = JSON.stringify(bodyObject);
  }

  toObject() {
    return this.responseObject;
  }
}

export default Response;
