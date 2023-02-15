import { Platform } from "react-native";

let baseURL = '';

{
    Platform.OS == 'android' ?
        baseURL = 'http://localhost:5000/api/v1/' :
        baseURL = 'http://hoodiechinhhang.onrender.com/api/v1/'

}

export default baseURL;