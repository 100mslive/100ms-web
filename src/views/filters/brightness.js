import { HMSVideoPluginType } from "@100mslive/hms-video";

    //private enabled;
let defaultValue  = 1;

export class brighteningPlugin {

    constructor(brightnessMul=1){
        this.brightnessMul = brightnessMul; 
    }

    shouldCallProcess(){
        if(this.brightnessMul!=defaultValue){
            return true;
        }
        else{
            return false;
        }
    }

    get(){
        return this.brightnessMul;
    }
    set(brightnessMul){
        this.brightnessMul = brightnessMul;
    }

    cleanUp() {
        this.brightnessMul = this.defaultValue;
    }

    /**
     * @param input {HTMLCanvasElement}
     * @param output {HTMLCanvasElement}
     */
    processPixels(red,green,blue) {
       
            red = red * this.brightnessMul;
            green = green * this.brightnessMul;
            blue = blue * this.brightnessMul;
            return [red,green,blue];
    }
}








