
class TMDError {
    private message: string;
    private detail:any;

    constructor(cause:any, errorDetail?:any) {
        if( typeof cause === 'string'){
            this.message = cause;
        }
        this.detail = errorDetail;
    }
    getMessage():string {
        return this.message;
    }
    getDetail():any {
        return this.detail;
    }
}

export default TMDError;