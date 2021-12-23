import { HMSVideoPluginType } from "@100mslive/hms-video";

//private enabled;
let defaultValue = 2; // saturation value. 0 = grayscale, 1 = original

let luR = 0.3086; // constant to determine luminance of red. Similarly, for green and blue
let luG = 0.6094;
let luB = 0.082;

export class saturationPlugin {
  constructor(saturation = 1) {
    this.saturation = saturation;
    var az = (1 - saturation) * luR + saturation;
    var bz = (1 - saturation) * luG;
    var cz = (1 - saturation) * luB;
    var dz = (1 - saturation) * luR;
    var ez = (1 - saturation) * luG + saturation;
    var fz = (1 - saturation) * luB;
    var gz = (1 - saturation) * luR;
    var hz = (1 - saturation) * luG;
    var iz = (1 - saturation) * luB + saturation;
  }

  shouldCallProcess() {
   return this.saturation!=defaultValue;
  }

  get() {
    return this.saturation;
  }
  set(contrast) {
    this.saturation = saturation;
  }

  cleanUp() {
    this.saturation = this.defaultValue;
  }

 
  processPixels(red, green, blue) {
    var saturatedRed = (az*red + bz*green + cz*blue);
    var saturatedGreen = (dz*red + ez*green + fz*blue);
    var saturateddBlue = (gz*red + hz*green + iz*blue);

    return [saturatedRed, saturatedGreen, saturateddBlue];
  }
}
