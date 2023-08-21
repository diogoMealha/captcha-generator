/**
 * 
 * @param {string} text input string
 * @param {Function} callback function to call after creating image
 * @param {Object} params object to configure output
 * @return {buffer} buffer of captcha image
 */
function generateCaptcha(text, callback=NaN, params=NaN){
    const Jimp = require('jimp');
    
    utils = {
        decToHex: (hex_num, string_size) => {
            // turns decimal number to hexadecimal number of length string size
            hex_str = hex_num.toString(16).toUpperCase(); 
            while (hex_str.length != string_size)
                hex_str = "0" + hex_str
            return hex_str
        },
        getRandomInt: (low, high)=>{return Math.floor(Math.random() * (high - low) + low)}

    }

    //###### Actions on char #######//
    let char_actions = (img)=>{
        return img
            .rotate(utils.getRandomInt(-30, 30)) 
    }

    const OFFSET = params.offset ? params.offset : 10
    const HEIGHT = params.height ? params.height : 90
    const OUT_NAME = params.out_name ? params.out_name : "captcha"
    const IMG_OVERLAP_MIN = params.img_overlap_min ? params.img_overlap_min : 0.3
    const IMG_OVERLAP_MAX = params.img_overlap_max ? params.img_overlap_min : 0.5
    const BACK_COLOR = params.back_color ? params.back_color : 'white'
    const OUT_TO_IMAGE = params.out_to_img ? params.out_to_img : true
    const CHARWIDTH = 64 // character width
    const MESSAGE = text
    const WIDTH = CHARWIDTH * MESSAGE.length + OFFSET

    let image = new Jimp(WIDTH, HEIGHT, BACK_COLOR, (err, image) => {if (err) throw err})
    let char_image = new Jimp(CHARWIDTH, CHARWIDTH, 0x0, (err, image) => {if (err) throw err})
    Jimp.loadFont(Jimp.FONT_SANS_64_BLACK)
    .then(font => {
    
        // loop through characters
        let image_pos = OFFSET // used to control image overlaping
        for (let i = 0; i < MESSAGE.length ; i++) {
            const char = MESSAGE[i];
            char_image.print(
            font, 0, 0, 
            {
            text: char,
            alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
            alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
            },
            CHARWIDTH, CHARWIDTH)
      
        
        char_actions(char_image).resize(CHARWIDTH, CHARWIDTH)
      
        image.composite(char_image, image_pos, (HEIGHT - CHARWIDTH)/2, {
            mode: Jimp.BLEND_SOURCE_OVER,
            opacityDest: 1,
            opacitySource: 1
        })
      
        // final image
        if (i == (MESSAGE.length - 1)){image.crop(0,0, image_pos + CHARWIDTH + OFFSET , HEIGHT);break;}
        
        image_pos += utils.getRandomInt(CHARWIDTH * IMG_OVERLAP_MIN, CHARWIDTH * IMG_OVERLAP_MAX)   
        char_image = char_image.crop(0,0,1,1).resize(CHARWIDTH, CHARWIDTH)
    }
    return image
    }).then(image => {
    let new_image = new Jimp(image.bitmap.width, HEIGHT, function (err, new_image) {
        if (err) throw err;
      
        for (let y = 0; y < HEIGHT; y++) {
            for (let x = 0; x < WIDTH; x++) {
                const pixel_color = utils.decToHex(image.getPixelColor(x, y), 8).substring(0, 6)
                const new_opacity = utils.decToHex(utils.getRandomInt(0, 255), 2)
                const new_pixel_color = pixel_color + new_opacity
                new_image.setPixelColor(Number("0x" + new_pixel_color) ,x, y) 
            }
        }
        if (OUT_TO_IMAGE)
            new_image.write(OUT_NAME + ".png") // save

        if (callback)
            new_image.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
                callback(buffer)
            });
    })
  })

}

module.exports = generateCaptcha