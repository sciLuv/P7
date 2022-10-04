function options(authCtx, method = 'GET', body = null) {
    let options = {
        method: method,
        headers: {
            Authorization: 'Bearer ' + authCtx.token,
        },
    };
    options.body = body != null ? body : null;
    return options;
}
export default options;
