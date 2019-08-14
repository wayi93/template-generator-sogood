class Helper {

    constructor() {

        /** bind functions */
        this.textEncodeForMysql = this.textEncodeForMysql.bind(this);
        this.testDecodeForMysql = this.testDecodeForMysql.bind(this);
        this.convertLinkRoot = this.convertLinkRoot.bind(this);

    }

    textEncodeForMysql(json){
        var txt = JSON.stringify(json);
        var newTxt = txt.replace(/&/g, "#TS001ZF#");
        newTxt = newTxt.replace(/=/g, "#TS002ZF#");
        newTxt = newTxt.replace(/%/g, "#TS003ZF#");
        newTxt = newTxt.replace(/http:/g, "https:");
        return JSON.parse(newTxt);
    }

    testDecodeForMysql(json){
        var txt = JSON.stringify(json);
        var newTxt = txt.replace(/#TS001ZF#/g, "&");
        newTxt = newTxt.replace(/#TS002ZF#/g, "=");
        newTxt = newTxt.replace(/#TS003ZF#/g, "%");
        return JSON.parse(newTxt);
    }

    /** convert the link root for aliCloud and amazonCloud */
    convertLinkRoot(json){
        var txt = JSON.stringify(json);
        var newTxt = txt.replace(/\/\/doporro-hangzhou.oss-cn-hangzhou.aliyuncs.com\/DE-Product-Images\//g, "//s3.eu-central-1.amazonaws.com/manufacture-shop-pictures/");
        return JSON.parse(newTxt);
    }

}

export default Helper;
