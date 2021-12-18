import { HMSVideoPluginType } from "@100mslive/hms-video";



export class grayscalePlugin {
    //private enabled;
    constructor(){
        this.enabled = true; 
    }

    shouldCallProcess(){
        if(this.enabled){
            return true;
        }
        else{
            return false;
        }
    }

    get(){
        return this.enabled;
    }

    cleanUp() {
        this.enabled = false;
    }

    /**
     * @param input {HTMLCanvasElement}
     * @param output {HTMLCanvasElement}
     */
    processPixels(red,green,blue) {
            const lightness = Math.floor(red * 0.299 + green * 0.587 + blue * 0.114);
            red = green = blue = lightness;
            return [red,green,blue];
    }
}

