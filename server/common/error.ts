
class TMDError {
    private message: string;
    private detail:any;

    constructor(msg:string, errorDetail?:any) {
        this.message = msg;
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