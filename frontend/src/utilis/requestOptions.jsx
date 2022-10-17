//function to do request to the back end
function options(authCtx, method = 'GET', body = null, type = null) {
    //base of options of the request
    let options = {
        method: method,
        headers: {
            Authorization: 'Bearer ' + authCtx.token,
            'Content-Type': type,
        },
    };
    //if the request have a body, put the body variable in parameter inside
    options.body = body != null ? body : null;

    //in function of type of content send to backend, change the format og it
    if (options.headers['Content-Type'] == null) {
        delete options.headers['Content-Type'];
    }

    return options;
}
export default options;
