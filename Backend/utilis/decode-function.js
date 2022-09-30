import he from "he";

function decodeHTMLentitiesContent(elements){
    console.log('TEST');
    for(const element in elements){
        elements[element].text = he.decode(elements[element].text);
        for(const comment in elements[element].comments){
            elements[element].comments[comment].text = he.decode(elements[element].comments[comment].text);
            console.log(elements[element].comments[comment].text);
        };
    }
    
}

function decodeHTMLentitiesComment(elements){
    let elementsDecoded
    for(const element in elements){
        elements[element].text = he.decode(elements[element].text);
    };
}


export {decodeHTMLentitiesComment, decodeHTMLentitiesContent}; 