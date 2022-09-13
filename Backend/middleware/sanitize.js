import sanitizer from 'validator'; //to sanitize content of input

//here to sanitize the content of post(= calling content in backend code) and post.
//change possible problematic symbol to their html entities or remove them from content
// backslash are remove. <>&'"*$=+[]| are change for their html entities forms 
const sanitize = (req, res, next) => {
    //in function of the form of the request body we change the selected part of it (read function after)
    let contentOrComment = isContentOrComment(req.body.content);
    //if contentOrComment is true it a content body form, and a comment if it's false
    let contentToSanitize = contentOrComment ? JSON.parse(req.body.content).text : req.body.text;
    
    //here we use method form validato/sanitizer  package to remove or encode some of problematic symbol 
    let sanitizedFirstStep = sanitizer.blacklist(
                                sanitizer.escape(
                                    sanitizer.ltrim(
                                        sanitizer.rtrim(contentToSanitize))
                                        ), '\\[\\]');
    //for the rest we use split() and join() basic method from js to encode problematic symbol.                                        
    let sanitizedSecondStep = sanitizedFirstStep
                            .split('*').join('&#42;')
                            .split('$').join('&#36;')
                            .split('=').join('&#61;')
                            .split('+').join('&#43;')
                            .split('[').join('&#91;')
                            .split(']').join('&#93;')
                            .split('|').join('&#124;');

    //here we remove the original content by the sanitized one 
    if(contentOrComment){
        //if it's a content
        req.body.content = JSON.stringify({ 'text' : sanitizedSecondStep });
    } else {
        //if it's a comment
        req.body.text = sanitizedSecondStep;
    }
    //to pass to the controllers
    next();
}

//try to pass to an object the body of the request. if its possible, it's a content request
//else, it's a comment request body
function isContentOrComment(value) {
    try { JSON.parse(value) } 
    catch { return false;   }
    return true;
}

//to export the sanitize function
export default sanitize