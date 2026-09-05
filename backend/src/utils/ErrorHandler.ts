class ErrorHandler extends Error {
    private statusCode;
    constructor(statuscode:any,message:string){
        super(message);
        this.statusCode = statuscode;
    }
}

export default ErrorHandler;