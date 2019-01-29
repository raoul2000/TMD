
class TMDError {
    private message: string;
    private detail:any;

    constructor(cause:any, errorDetail?:any) {
        if( typeof cause === 'string'){
            this.message = cause;
        }
        this.detail = this.extractDetail(errorDetail);
    }
    private extractDetail(errorDetail) {
        if( ! errorDetail ) {
            return null;
        }

        if( errorDetail.message) {
            return errorDetail.message;
        }

        return errorDetail;
    }
    getMessage():string {
        return this.message;
    }
    getDetail():any {
        return this.detail;
    }
}

export default TMDError;