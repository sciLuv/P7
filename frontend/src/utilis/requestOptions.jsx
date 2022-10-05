function options(authCtx, method = 'GET', body = null, type = null) {
    let options = {
        method: method,
        headers: {
            Authorization: 'Bearer ' + authCtx.token,
            'Content-Type': type,
        },
    };

    options.body = body != null ? body : null;

    if (options.headers['Content-Type'] == null) {
        delete options.headers['Content-Type'];
    }

    return options;
}
export default options;
