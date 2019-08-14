import React, { Component } from 'react';
import { Modal, Input, Icon, Button } from 'antd';
import noImg320 from '../../images/no-img-1400-320.jpg';

const top_slider_imgs_count_min = 2;
const top_slider_imgs_count_max = 4;
const top_slider_imgs_count_init = 4;

export default class Header extends Component {

  constructor(props){
    super(props);
    this.handleLayerOpen = this.handleLayerOpen.bind(this);
    this.handleLayerCancel = this.handleLayerCancel.bind(this);
    this.handleLayerOk = this.handleLayerOk.bind(this);
    this.syncDatas = this.syncDatas.bind(this);
    this.onChangeSliderImgLink = this.onChangeSliderImgLink.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleReduce = this.handleReduce.bind(this);
    this.showInputCountInfo = this.showInputCountInfo.bind(this);
    this.getJsonLength = this.getJsonLength.bind(this);

    let topSliderImgsArr = {};
    for(var i = 0; i < top_slider_imgs_count_init; ++i){
      let id = 'TOP_SLIDER_IMG_' + (i+1);
      let oneTopSliderImg = {
        id : id,
        link : noImg320,
        link_Cache : noImg320
      }
      topSliderImgsArr[id] = oneTopSliderImg;
    }

    this.state = {
      modalText : 'Content of the modal',
      visibleLayer : false,
      confirmLoading : false,
      topSliderImgsCount : top_slider_imgs_count_init,
      topSliderImgs : topSliderImgsArr
    }
  }

  handleLayerOpen = () => {
    let newTopSliderImgs = this.state.topSliderImgs;
    for(var i = 0; i < this.state.topSliderImgsCount; ++i){
      let id = 'TOP_SLIDER_IMG_' + (i+1);
      newTopSliderImgs[id].link_Cache = newTopSliderImgs[id].link;
    }
    this.setState({
      visibleLayer : true,
      topSliderImgs : newTopSliderImgs
    });
  }

  handleLayerCancel = () => {
    let newTopSliderImgs = this.state.topSliderImgs;
    for(var i = 0; i < this.state.topSliderImgsCount; ++i){
      let id = 'TOP_SLIDER_IMG_' + (i+1);
      newTopSliderImgs[id].link = newTopSliderImgs[id].link_Cache;
    }
    this.setState({
      visibleLayer : false,
      topSliderImgs : newTopSliderImgs
    });
  }

  handleLayerOk = (e) => {
    let newTopSliderImgs = this.state.topSliderImgs;
    for(var i = 0; i < this.state.topSliderImgsCount; ++i){
      let id = 'TOP_SLIDER_IMG_' + (i+1);
      newTopSliderImgs[id].link_Cache = newTopSliderImgs[id].link;
    }
    this.setState({
      visibleLayer : false,
      topSliderImgs : newTopSliderImgs
    });
    setTimeout(() => {
      this.syncDatas();
    }, 0);
  }

  syncDatas = () => {
    this.props.setTemplateDatas(1, {
      topSliderImgs : this.state.topSliderImgs
    });
  }

  onChangeSliderImgLink (id, e) {

    //TODO: valid the link of image

    let newValue = e.target.value;
    let newTopSliderImgs = this.state.topSliderImgs;

    if(newValue === ''){
      newTopSliderImgs[id].link = noImg320
    }else{
      newTopSliderImgs[id].link = newValue
    }

    this.setState({
      topSliderImgs : newTopSliderImgs
    });
    
  }

  handleAdd(){
    let tsiCount = this.state.topSliderImgsCount;
    if(tsiCount < top_slider_imgs_count_max){
      let newId = 'TOP_SLIDER_IMG_' + (this.state.topSliderImgsCount + 1);
      let newTopSliderImgs = this.state.topSliderImgs;
      newTopSliderImgs[newId] = {
        id : newId,
        link : noImg320,
        link_Cache : noImg320
      }
      this.setState({
        topSliderImgsCount : tsiCount + 1,
        topSliderImgs : newTopSliderImgs
      });
    }else{
      this.showInputCountInfo(1, top_slider_imgs_count_max);
    }
  }

  handleReduce(){
    let tsiCount = this.state.topSliderImgsCount;
    if(tsiCount > top_slider_imgs_count_min){
      let newTopSliderImgs = this.state.topSliderImgs;
      delete newTopSliderImgs['TOP_SLIDER_IMG_' + this.state.topSliderImgsCount];
      this.setState({
        topSliderImgsCount : tsiCount - 1,
        topSliderImgs : newTopSliderImgs
      });
    }else{
      this.showInputCountInfo(0, top_slider_imgs_count_min);
    }
  }

  showInputCountInfo(index, count){
    switch(index){
      case 0:
        Modal.info({
          title : 'System-Info 系统消息',
          content : (
            <div className="margin-t-10">
              <div className="margin-t-5">Die Module muss mindestens { count } Slider Bilder enthalten.</div>
              <div className="margin-t-5">这个模块儿至少要有{ count }张幻灯片。</div>
            </div>
          ),
          onOk () {}
        });
        break;
      case 1:
        Modal.info({
          title : 'System-Info 系统消息',
          content : (
            <div className="margin-t-10">
              <div className="margin-t-5">Die Module kann maximal { count } Slider Bilder enthalten.</div>
              <div className="margin-t-5">这个模块儿最多可以有{ count }张幻灯片。</div>
            </div>
          ),
          onOk () {}
        });
        break;
      default:
        //
    }
  }

  render() {
    let items1 = [];
    let items2 = [];
    let items3 = [];
    let items4 = [];
    let items5 = [];
    let items6 = [];
    for(var i = 0; i < this.state.topSliderImgsCount; ++i){
      let idNr = i + 1;
      let id = 'TOP_SLIDER_IMG_' + idNr;
      if(idNr === 1){
        items1.push(
          <input type="radio" name="header-slider" defaultChecked className={ "header-slide-radio" + idNr } id={ "header-slider_" + idNr } key={ "top_slider_items1_" + idNr } />
        );
      }else{
        items1.push(
          <input type="radio" name="header-slider" className={ "header-slide-radio" + idNr } id={ "header-slider_" + idNr } key={ "top_slider_items1_" + idNr } />
        );
      }
      items2.push(
        <label htmlFor={ "header-slider_" + idNr } className={ "page" + idNr } key={ "top_slider_items2_" + idNr }></label>
      );
      items3.push(
        <label htmlFor={ "header-slider_" + idNr } className={ "numb" + idNr } key={ "top_slider_items3_" + idNr }><i className="fa fa-arrow-circle-right"></i></label>
      );
      items4.push(
        <label htmlFor={ "header-slider_" + idNr } className={ "numb" + idNr } key={ "top_slider_items4_" + idNr }><i className="fa fa-arrow-circle-left"></i></label>
      );
      items5.push(
        <div className={ "header-slider header-slide" + idNr } key={ "top_slider_items5_" + idNr }>
          <img src={ this.state.topSliderImgs[id].link } width="100%" className="over-hand" onClick={ this.handleLayerOpen } alt="template-img-top-slider 1400x320px" />
        </div>
      );
      items6.push(
        <Input 
            placeholder="https://"
            prefix={<Icon type="link" />}
            size="large"
            className="margin-t-15"
            key={ "top_slider_items6_" + idNr }
            value={ (this.state.topSliderImgs[id].link).includes(this.props.imgLinkInternalPrefix) ? '' : (this.state.topSliderImgs[id].link) }
            onChange={ (e) => this.onChangeSliderImgLink(id, e) }
        />
      );
    }
    return (
      <div className="width100per">
        <div className="col-md-12 margin-b-10 min-height-noImg">
          <div className="header-slider-wrapper">
            { items1 }
            <div className="header-slider-pagination">
              { items2 }
            </div>
            <div className="next control">
              { items3 }
            </div>
            <div className="previous control">
              { items4 }
            </div>
            { items5 }
          </div>
        </div>
        <Modal title="Bild hinzufügen [ 输入图片的Link ]" 
          visible={ this.state.visibleLayer }
          confirmLoading={this.state.confirmLoading}
          onCancel={ this.handleLayerCancel } 
          onOk={ this.handleLayerOk }
        >
          <div>Top Slider 页面顶部幻灯片</div>
          { items6 }
          <div className="margin-t-15">
            <Button 
                type="dashed" 
                icon="plus-circle" 
                size="large"
                onClick={ this.handleAdd }
            >Hinzufügen 增加</Button>
            <Button 
                type="dashed" 
                icon="minus-circle" 
                size="large"
                onClick={ this.handleReduce }
                className="margin-l-10"
            >Entfernen 减少</Button>
          </div>
        </Modal>
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

  componentDidMount(){

		// init data
		if(this.props.action === 'edit'){

			let initDatas = this.props.initDatas;

			if(initDatas !== null){

        var imgsNr = this.getJsonLength(initDatas.topSliderImgs);

				this.setState({
					topSliderImgsCount : imgsNr,
          topSliderImgs : initDatas.topSliderImgs
        });
        
			}

		}

	}

}
