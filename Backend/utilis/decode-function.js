import he from "he";

function decodeHTMLentities(elements){
    for(const element in elements){
        elements[element].text = he.decode(elements[element].text);
    } 
}

export default decodeHTMLentities; 