import multer from 'multer'; //nodeJS package to manage importation of image to backend 

//Convert the file mimetype into an extension for the future stored image.
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
  };
  
//function that uses multer methods to retrieve the image and give it a specific name
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const beforeName = file.originalname.split(' ').join('_');
    const name = beforeName.substring(0, beforeName.lastIndexOf('.'))
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

//exports the previous function to include it in the routes of the contents
let uploadImg = multer({storage: storage});
export default uploadImg.single('image')