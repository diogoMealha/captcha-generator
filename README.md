# Captcha Generator

Use this program to generate your own captcha image from string


## Usage
Import the package and use the function:
```javascript
const captcha = require('captcha-generator-md')
const callback = (buffer) => {
    console.log(buffer)
}
captcha("<your string>", callback)
```
Additonally this function can take another argument with the following params:
```javascript
const params = {
    offset: int,
    height: int,
    out_name: string,
    img_overlap_min: float,
    img_overlap_max: float,
    back_color: string,
    out_to_img, boolean
}
```
- **offset:** pixel value for the right and left offset of generated image
- **height:** pixel value of image height
- **out_name** : name for output file ex. captcha
- **img_overlap** : min and max values that define overlaping of image characters. Values from 0 to 1
- **back_color:** : background color of image
- **out_to_img:** : checks if output image will be saved

## License
This project is licensed under the MIT License

## Dependencies
Jimp ^0.22.10