export default class {
    constructor(method, url, params, success, failure) {
        this.method = method;
        this.url = url;
        this.params = params;
        this.success = success;
        this.failure = failure;
    }

    //  List vue use
    //  optOrder.pagination
    static optOrderPagination(){
        return window.API_ROOT + 'rest/optOrder.pagination/v1';
    }

}
