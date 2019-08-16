import React, { Component } from 'react';
import TopHeader from './Header';
import { Spin, Button, Modal } from 'antd';
import copy from 'copy-to-clipboard';

import Helper from './util/Helper';

const config = require('../config');

const imgLinkInternalPrefix = '/static/media/';

class HtmlCode extends Component {

  constructor(props){
    super(props);
    this.handleCopy = this.handleCopy.bind(this);
    this.getTemplate = this.getTemplate.bind(this);
    this.getJsonLength = this.getJsonLength.bind(this);
    this.getBodyEPS = this.getBodyEPS.bind(this);
    this.getBodyOTMI = this.getBodyOTMI.bind(this);
    this.helper = new Helper();
  }

  state = {
    loading : true,
    template : null,
    templateDatas : null,
    version: ''
  }

  handleCopy = (text) => {
    copy(text);
    
    Modal.info({
      title: 'System-Info 系统消息',
      content: (
        <div className="margin-t-10">
          <div className="margin-t-5">Die Code wurde erfolgreich in die Zwischenablage kopiert.</div>
          <div className="margin-t-5">模板代码已经成功地复制到剪切板。</div>
        </div>
      ),
      onOk() {},
    });

  }

  getTemplate = async() => {

    // Settings
    const api_host = config.nodejs_api_host;
    const settings = {
        method: 'POST',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: JSON.stringify({
          template_db_id : this.props.match.params.id
        })
    };

    try {

      let response = await fetch( api_host + '/api/template', settings );
      let data = await response.json();
      
      if(data.confirmation === 'success'){

        this.setState({
          //loading : false,
          template : data.template,
          templateDatas : JSON.parse(this.helper.testDecodeForMysql(data.template.content)),
          version : data.template.version
        });

        setTimeout(() => {
          //console.log(this.state.template);
        }, 0);

      }else{
        Modal.error({
          title: 'System-Fehler 系统错误',
          content: 
          <div className="margin-t-10">
            <div className="margin-t-5">{ data.message }</div>
          </div>
        });
      }

    } catch(e) {
      Modal.error({
        title: 'System-Fehler 系统错误',
        content: 
        <div className="margin-t-10">
          <div className="margin-t-5">Sogood API Server ist nicht eingeschaltet.</div>
          <div className="margin-t-5">API服务器没有开启。</div>
        </div>
      });
    }

  }

  render() {

    let divStyle = {
      height: (window.screen.availHeight - 243) + 'px'
    }

    let outputHtml = <textarea id='tpl-html-ta' style={ divStyle } readOnly defaultValue='' />;

    return (
      <div>
        <div className="row top-header width100per">
          <TopHeader page={ 'HtmlCode' } />
        </div>
        <Spin spinning={this.state.loading} size="large" tip="Exporting the HTML Code... Please wait...">
        <div className="row padding-t-100">
          <div className="col-md-12">
            <Button 
                type="primary" 
                icon="save" 
                size="large"
                onClick={ () => this.handleCopy(document.getElementById('tpl-html-ta').value) } 
                className="margin-r-10 margin-b-10"
            >Copy all codes 复制所有代码</Button>
            <a href={ '/template/edit/' + this.props.match.params.id }><Button 
                type="primary" 
                icon="edit" 
                size="large"
            >Edit 编辑修改</Button></a>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            { outputHtml }
          </div>
        </div>
        </Spin>
      </div>
    );
  }



  getJsonLength(obj){
    var len = 0, key;
    for(key in obj){
      if(obj.hasOwnProperty(key)){
        len++;
      }
    }
    return len;
  }

  getBodyEPS(obj, hasTitle, countInRow){

    var htmlCodeResult = '';

    if(obj !== null){

      if(hasTitle && !(obj.blockTitleImgLink).includes(imgLinkInternalPrefix)){
        htmlCodeResult += '<div class="col-md-12 clearPadding margin-b-10 title-block">'+
          '<img src="' + obj.blockTitleImgLink + '" width="100%" />'+
          '</div>';
      }

      htmlCodeResult += '<div class="col-md-12 margin-b-20">'+
        '<div class="row">';

      for(var bodyEPS_k in obj){
        if(bodyEPS_k.substring(5,14) === '_PRODUCT_'){

          if(obj[bodyEPS_k].imgLink !== "" && !(obj[bodyEPS_k].imgLink).includes(imgLinkInternalPrefix)){

            //htmlCodeResult += '<div class="col-md-3 margin-b-10">';
            if(countInRow === 3){
              htmlCodeResult += '<div class="col-md-4 margin-b-10">';
            }else if(countInRow === 5){
              htmlCodeResult += '<div class="col-md-1-5 margin-b-10">';
            }else{
              htmlCodeResult += '<div class="col-md-3 margin-b-10">';
            }
            htmlCodeResult += '<div class="one-product-block">'+
              '<a href="https://www.ebay.de/itm/' + obj[bodyEPS_k].eBayArtikelNr + '" target="_blank"><img src="' + obj[bodyEPS_k].imgLink + '" width="100%" /></a>';

            let proNamehere = obj[bodyEPS_k].name;
            if(proNamehere !== "Produktname 商品名称" && proNamehere !== ""){
              htmlCodeResult += '<div class="one-product-title">' + obj[bodyEPS_k].name + '</div>';
            }

            htmlCodeResult += '</div>'+
            '</div>';

          }
          
        }
      }

      htmlCodeResult += '</div>'+
        '</div>';

    }
    
    return htmlCodeResult;
  }

  getBodyOTMI(obj){

    var htmlCodeResult = '';
    
    if(obj !== null){
      htmlCodeResult += '<div class="col-md-12 clearPadding margin-b-10 title-block">'+
        '<img src="' + obj.titleImgLink + '" width="100%" />'+
        '</div>';
      var cImgs = obj.contentImgs;
      for(var kB_OTMI in cImgs){
        htmlCodeResult += '<div class="col-md-12 clearPadding margin-b-10">'+
          '<img src="' + cImgs[kB_OTMI].link + '" width="100%" />'+
          '</div>';
      }
    }

    return htmlCodeResult;

  }

  componentDidMount(){

    this.getTemplate();

    setTimeout(() => {

      let templateDatas = this.state.templateDatas;

      /** show or hidden the Produktbeschreibung Tabs 1/3 */
      let showBeschreinungTitleTab = true;
      if(templateDatas.infoForm.channelId + "" === "1"){
        showBeschreinungTitleTab = false;
      }

      let htmlCodeResult = '<meta charset="utf-8">'+
      '<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">'+
      '<link rel="stylesheet" type="text/css" media="all" href="https://manufacture-shop-pictures.s3.eu-central-1.amazonaws.com/ebay-template-v18.01/style.css">'+
      '<body>'+
      '<div class="container">'+
      '<div class="row padding-t-15 padding-b-15">';



      /**
       * Top Slider show or hidden
       */
      let showSliderBlock = false;
      if(templateDatas.header !== null){
        
        let isAllIncludeDefPath = true;

        let Json_topSliderImgs = templateDatas.header.topSliderImgs;
        let topSliderImgsNr = this.getJsonLength(Json_topSliderImgs);
        for(var i_tsinr = 1; i_tsinr < (topSliderImgsNr + 1); ++i_tsinr){
          var link_tsinr = Json_topSliderImgs["TOP_SLIDER_IMG_" + i_tsinr].link;
          if(!link_tsinr.includes(imgLinkInternalPrefix)){
            isAllIncludeDefPath = false;
          }
        }

        if(isAllIncludeDefPath){
          showSliderBlock = false;
        }else{
          showSliderBlock = true;
        }

      }
      /**
       * Top Slider
       */
      if(showSliderBlock){

        let eds_topSliderImgs = templateDatas.header.topSliderImgs;

        htmlCodeResult += '<div class="col-md-12 margin-b-10">'+
          '<div class="header-slider-wrapper">';

        //iTS
        var iTS_len = this.getJsonLength(eds_topSliderImgs);
        for(var iTS = 0; iTS < iTS_len; ++iTS){
          var idTS = iTS + 1;
          if(idTS === 1){
            htmlCodeResult += '<input type="radio" name="header-slider" class="header-slide-radio' + idTS + '" id="header-slider_' + idTS + '" checked>';
          }else{
            htmlCodeResult += '<input type="radio" name="header-slider" class="header-slide-radio' + idTS + '" id="header-slider_' + idTS + '">';
          }
        }

        htmlCodeResult += '<div class="header-slider-pagination">';

        //iTS1
        for(var iTS1 = 0; iTS1 < iTS_len; ++iTS1){
          var idTS1 = iTS1 + 1;
          htmlCodeResult += '<label for="header-slider_' + idTS1 + '" class="page' + idTS1 + '"></label>';
        }

        htmlCodeResult += '</div>'+
        '<div class="next control">';

        //iTS2
        for(var iTS2 = 0; iTS2 < iTS_len; ++iTS2){
          var idTS2 = iTS2 + 1;
          htmlCodeResult += '<label for="header-slider_' + idTS2 + '" class="numb' + idTS2 + '"><i class="fa fa-arrow-circle-right"></i></label>';
        }

        htmlCodeResult += '</div>'+
        '<div class="previous control">';

        //iTS3
        for(var iTS3 = 0; iTS3 < iTS_len; ++iTS3){
          var idTS3 = iTS3 + 1;
          htmlCodeResult += '<label for="header-slider_' + idTS3 + '" class="numb' + idTS3 + '"><i class="fa fa-arrow-circle-left"></i></label>';
        }

        htmlCodeResult += '</div>';

        //iTS4
        var idTS4 = 1;
        for(var kTS4 in eds_topSliderImgs){
          htmlCodeResult += '<div class="header-slider header-slide' + idTS4 + '">'+
          '<image src="' + eds_topSliderImgs[kTS4].link + '" width="100%" />'+
          '</div>';
          ++idTS4;
        }

        htmlCodeResult += '</div>'+
        '</div>';

      }
      

      
      let eds_topGalleryImgs = templateDatas.topSlider;
      /**
       * Gallery show or hidden
       */
      let showGalleryBlock = false;
      if(eds_topGalleryImgs !== null){

        let isAllIncludeDefPath = true;

        for(var i_Glry = 1; i_Glry < 6; ++i_Glry){
          var link_Glry = eds_topGalleryImgs["sliderImgLink0" + i_Glry];
          if(!link_Glry.includes(imgLinkInternalPrefix)){
            isAllIncludeDefPath = false;
          }
        }

        if(isAllIncludeDefPath){
          showGalleryBlock = false;
        }else{
          showGalleryBlock = true;
        }

      }
      /**
       * Gallery
       */
      if(showGalleryBlock){

        //Gallery Title
        htmlCodeResult += '<div class="col-md-12 margin-b-10">'+
        '<img src="' + eds_topGalleryImgs.titleImgLink + '" width="100%" />'+
        '</div>'+
        '<div class="col-md-12 margin-b-10">'+
        '<div class="slider">';

        //Gallery Imgs
        var idGI = 1;
        for(var kGI in eds_topGalleryImgs){
          if(kGI.substring(0, 13) === 'sliderImgLink'){
              if(idGI === 1){
                htmlCodeResult += '<input type="radio" name="slide_switch" id="id' + idGI + '" checked="checked" />';
              }else{
                htmlCodeResult += '<input type="radio" name="slide_switch" id="id' + idGI + '" />';
              }
              htmlCodeResult += '<label for="id' + idGI + '">'+
                '<img src="' + eds_topGalleryImgs[kGI] + '" width="100%" />'+
                '</label>'+
                '<img src="' + eds_topGalleryImgs[kGI] + '" width="100%" />';

                ++idGI;
          }
        }

        htmlCodeResult += '</div>'+
        '</div>';

      }





      
      

      htmlCodeResult += '<div class="col-md-12">'+
      '<div id="tab-container" class="tab-container">';



      /** show or hidden the Produktbeschreibung Tabs 2/3 */
      if(showBeschreinungTitleTab){
        htmlCodeResult += '<div id="content1" class="active">';
      }
      
      

      /**
       * Body
       */
      let eds_tplBody = templateDatas.body;
      if(eds_tplBody !== null){

        htmlCodeResult += '<div class="row">';

        switch(this.state.version){
          case '18.01':

            /**
             * Body OTMI_1
             */
            htmlCodeResult += this.getBodyOTMI(eds_tplBody.OTMI_1);

            /**
             * Body EPS_1
             */
            htmlCodeResult += this.getBodyEPS(eds_tplBody.EPS_1, false, 3);

            /**
             * Body EPS_2
             */
            htmlCodeResult += this.getBodyEPS(eds_tplBody.EPS_2, true, 4);

            /**
             * Body OTMI_2
             */
            htmlCodeResult += this.getBodyOTMI(eds_tplBody.OTMI_2);

            /**
             * Body OTMI_3
             */
            htmlCodeResult += this.getBodyOTMI(eds_tplBody.OTMI_3);

            /**
             * Body EPS_3
             */
            htmlCodeResult += this.getBodyEPS(eds_tplBody.EPS_3, true, 5);

            /**
             * Body EPS_4
             */
            htmlCodeResult += this.getBodyEPS(eds_tplBody.EPS_4, true, 5);

            break;
          case '18.02':
            
            /**
             * Body OTMI_1
             */
            htmlCodeResult += this.getBodyOTMI(eds_tplBody.OTMI_1);

            /**
             * Body EPS_1
             */
            htmlCodeResult += this.getBodyEPS(eds_tplBody.EPS_1, false, 5);

            /**
             * Body EPS_2
             */
            htmlCodeResult += this.getBodyEPS(eds_tplBody.EPS_2, true, 5);

            /**
             * Body EPS_3
             */
            htmlCodeResult += this.getBodyEPS(eds_tplBody.EPS_3, true, 5);

            break;
          case '18.03':

            /**
             * Body EPS_1
             */
            htmlCodeResult += this.getBodyEPS(eds_tplBody.EPS_1, false, 4);
            
            /**
             * Body OTMI_1
             */
            htmlCodeResult += this.getBodyOTMI(eds_tplBody.OTMI_1);

            /**
             * Body EPS_2
             */
            htmlCodeResult += this.getBodyEPS(eds_tplBody.EPS_2, true, 5);

            /**
             * Body EPS_3
             */
            htmlCodeResult += this.getBodyEPS(eds_tplBody.EPS_3, true, 5);

            break;
          case '18.04':
            
            /**
             * Body EPS_1
             */
            htmlCodeResult += this.getBodyEPS(eds_tplBody.EPS_1, false, 5);
            
            /**imgLinkInternalPrefix
             * Body OTMI_1
             */
            htmlCodeResult += this.getBodyOTMI(eds_tplBody.OTMI_1);

            /**
             * Body EPS_2
             */
            htmlCodeResult += this.getBodyEPS(eds_tplBody.EPS_2, true, 5);

            /**
             * Body EPS_3
             */
            htmlCodeResult += this.getBodyEPS(eds_tplBody.EPS_3, true, 5);

            break;
          default:
            window.location.href='/404';
        }
        
        


        htmlCodeResult += '</div>';


      }

      

      /** show or hidden the Produktbeschreibung Tabs 3/3 */
      if(showBeschreinungTitleTab){
        htmlCodeResult += '</div>'+
        '<div id="content2">'+
        '<div class="row">'+
        '<div class="col-md-12 margin-b-10">'+
        'Fabrik Seite'+
        '</div>'+
        '</div>'+
        '</div>'+
        '<ul class="tabs">'+
        '<!--'+
        '<li class="active"><a href="#content1" target="_blank"><i class="fa fa-file-alt"></i> Produktbeschreibung</a></li>'+
        '<li><a href="#content2" target="_blank"><i class="fa fa-industry"></i> Unsere Fabrik</a></li>'+
        '-->'+
        '<li class="active" style="background-color: #434343;"><i class="fa fa-file-alt"></i> Produktbeschreibung</li>'+
        '<li></li>'+
        '</ul>'+
        '<div class="tab-content-wrap"></div>';
      }

      htmlCodeResult += '</div>'+
      '</div>'+
      '</div>'+
      '</div>'+
      '</body>';



      document.getElementById('tpl-html-ta').value = this.helper.convertLinkRoot(htmlCodeResult);

      this.setState({
        loading : false
      });

    }, 2000);
    

  }

}

export default HtmlCode;
