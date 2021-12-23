import { HMSVideoPluginType } from "@100mslive/hms-video";

    //private enabled;
let defaultValue  = 1;

export class contrastPlugin {

    constructor(contrast=1){
        this.contrast = contrast; 
        this.intercept =  128 * (1 - this.defaultValue);
    }

    shouldCallProcess(){
       return this.contrast!=defaultValue;
    }

    get(){
        return this.contrast;
    }
    set(contrast){
        this.contrast = contrast;
        this.intercept =  128 * (1 - contrast);
    }

    cleanUp() {
        this.contrast = this.defaultValue;
        this.intercept =  128 * (1 - this.defaultValue)
    }

    /**
     * @param input {HTMLCanvasElement}
     * @param output {HTMLCanvasElement}
     */
    processPixels(red,green,blue) {
            red = red * this.contrast + this.intercept;
            green = green * this.contrast + this.intercept;
            blue = blue * this.contrast + this.intercept;
            return [red,green,blue];
    }
}








