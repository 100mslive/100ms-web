import { HMSVideoPluginType } from "@100mslive/hms-video";

    //private enabled;
let defaultValue  = 1;

export class brighteningPlugin {

    constructor(brightnessMul=1){
        this.brightnessMul = brightnessMul; 
    }

    shouldCallProcess(){
       return this.brightnessMul!=defaultValue;
    }

    get(){
        return this.brightnessMul;
    }
    set(brightnessMul){
        this.brightnessMul = brightnessMul;
    }

    cleanUp() {
        this.brightnessMul = defaultValue;
    }

    processPixels(red,green,blue) {
       if(this.brightnessMul!=defaultValue){
            red = red * this.brightnessMul;
            green = green * this.brightnessMul;
            blue = blue * this.brightnessMul;
       }
            return [red,green,blue];
    }
}








