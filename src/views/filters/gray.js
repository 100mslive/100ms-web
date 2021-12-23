import { HMSVideoPluginType } from "@100mslive/hms-video";



export class grayscalePlugin {
    //private enabled;
    constructor(){
        this.enabled = false; 
    }

    shouldCallProcess(){
        return this.enabled;
    }

    get(){
        return this.enabled;
    }
    set(enabled){
        this.enabled=enabled;
    }

    cleanUp() {
        this.enabled = false;
    }

  
    processPixels(red,green,blue) {
            const lightness = Math.floor(red * 0.299 + green * 0.587 + blue * 0.114);
            red = green = blue = lightness;
            return [red,green,blue];
    }
}

