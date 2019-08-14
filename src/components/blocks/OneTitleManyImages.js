import React, { Component } from 'react';

import { Modal, Button, Input, Icon } from 'antd';

import noImg140 from '../../images/no-img-1400-140.jpg';
import noImg660 from '../../images/no-img-1400-660.jpg';

export default class OneTitleManyImages extends Component {

    constructor(props){

        super(props);
        this.handleAdd = this.handleAdd.bind(this);
        this.handleReduce = this.handleReduce.bind(this);
        this.dontDeleteInfo = this.dontDeleteInfo.bind(this);
        this.handleTitleImgLayerOpen = this.handleTitleImgLayerOpen.bind(this);
        this.handleTitleImgLayerCancel = this.handleTitleImgLayerCancel.bind(this);
        this.handleTitleImgLayerOk = this.handleTitleImgLayerOk.bind(this);
        this.onChangeTitleImgLink = this.onChangeTitleImgLink.bind(this);
        this.handleContentImgLayerOpen = this.handleContentImgLayerOpen.bind(this);
        this.onChangeContentImgLink = this.onChangeContentImgLink.bind(this);
        this.syncDatas = this.syncDatas.bind(this);
        this.getJsonLength = this.getJsonLength.bind(this);

        // init state
        let contentImgsArr = {};
        let childrenNr = 1;
        for(var i = 0; i < childrenNr; ++i){
            let contentImgId = props.idPrefix + "_CONTENT_IMG_" + (i+1);
            let oneContentImg = {
                id : contentImgId,
                link : noImg660,
                link_Cache : noImg660
            }
            contentImgsArr[contentImgId] = oneContentImg;
        }
        this.state = {
            imgsNr : childrenNr,
            contentImgs : contentImgsArr,
            titleImgLink : noImg140,
            titleImgLink_Cache : noImg140,
            currentContentImgId : '',
            titleImgVisibleLayer : false,
            titleImgConfirmLoading : false,
            contentImgVisibleLayer : false,
            contentImgConfirmLoading : false
        }

    }

    /** add or remove a content image */
    handleAdd(){
        let newImgsNr = this.state.imgsNr + 1;
        let newId = this.props.idPrefix + "_CONTENT_IMG_" + newImgsNr;
        let newContentImgs = this.state.contentImgs;
        let newCImg = {
            id : newId,
            link : noImg660,
            link_Cache : noImg660
        }
        newContentImgs[newId] = newCImg;
        this.setState({
            imgsNr : this.state.imgsNr + 1,
            contentImgs : newContentImgs
        });
    }
    handleReduce(){
        if(this.state.imgsNr > 1){

            // remove the last one
            let newContentImgs = this.state.contentImgs;
            delete newContentImgs[this.props.idPrefix + "_CONTENT_IMG_" + this.state.imgsNr];

            this.setState({
                imgsNr : this.state.imgsNr - 1,
                contentImgs : newContentImgs
            });

            setTimeout(() => {
                this.syncDatas();
            }, 0);

        }else{
            this.dontDeleteInfo();
        }
    }
    dontDeleteInfo(){
        Modal.info({
          title : 'System-Info 系统消息',
          content : (
            <div className="margin-t-10">
              <div className="margin-t-5">Die Module muss mindestens ein Bild enthalten.</div>
              <div className="margin-t-5">这个模块儿至少要有一张图。</div>
            </div>
          ),
          onOk () {}
        });
    }

    /** Layer for title */
    handleTitleImgLayerOpen(){
        this.setState({
            titleImgVisibleLayer : true,
            titleImgLink_Cache : this.state.titleImgLink
        });
    }
    handleTitleImgLayerCancel(){
        this.setState({
            titleImgVisibleLayer : false,
            titleImgLink : this.state.titleImgLink_Cache
        });
    }
    handleTitleImgLayerOk(){
        this.setState({
            titleImgVisibleLayer : false,
            titleImgLink_Cache : this.state.titleImgLink
        });
        setTimeout(() => {
            this.syncDatas();
        }, 0);
    }
    onChangeTitleImgLink = (e) => {
        
        //TODO: valid the link of image

        let newLink = e.target.value;
        if(newLink === ''){
            this.setState({
                titleImgLink : noImg140
            });
        }else{
            this.setState({
                titleImgLink : newLink
            });
        }

    }

    /** Layer for content images */
    handleContentImgLayerOpen(id){
        
        this.setState({
            currentContentImgId : id
        });

        setTimeout(()=>{

            //console.log(this.state.currentContentImgId);

            let _this = this;

            Modal.confirm({
                title: 'Beschreibungsbild hinzufügen [ 添加一个描述圖片 ]',
                iconType: 'file-jpg',
                width: 500,
                content: (
                    <div className="padding-r-35">
                        <div>Produkt ID: { id }</div>
                        <Input 
                        placeholder="Link des Bilds 描述图片Link"
                        prefix={ <Icon type="link" /> }
                        defaultValue={ (this.state.contentImgs[id].link).includes(this.props.imgLinkInternalPrefix) ? '' : (this.state.contentImgs[id].link) }
                        onChange={ (e) => this.onChangeContentImgLink(id, e) }
                        size="large"
                        className="margin-t-15"
                        />
                    </div>
                ),
                onOk(){
                    
                    // set Value to Cache
                    let newContentImgs = _this.state.contentImgs;
                    newContentImgs[id].link_Cache = newContentImgs[id].link;
                    _this.setState({
                        contentImgs : newContentImgs
                    });

                    // set Value to parent component
                    setTimeout(() => {
                        _this.syncDatas();
                    }, 0);

                },
                onCancel(){

                    // set Cache to Value back
                    let newContentImgs = _this.state.contentImgs;
                    newContentImgs[id].link = newContentImgs[id].link_Cache;
                    _this.setState({
                        contentImgs : newContentImgs
                    });
                }

            });

        }, 0);

    }
    onChangeContentImgLink (id, e) {
        
        //TODO: valid the link of image

        let newValue = e.target.value;
        let newContentImgs = this.state.contentImgs;

        if(newValue === ''){
            newContentImgs[id].link = noImg660;
        }else{
            newContentImgs[id].link = newValue;
        }

        this.setState({
            contentImgs : newContentImgs
        });

    }


    /** Upload datas */
    syncDatas = () => {
        this.props.setBodyDatas(this.props.idPrefix, {
            contentImgs : this.state.contentImgs,
            titleImgLink : this.state.titleImgLink
        });
    }

    render() {

        let items = [];
        for(var i = 0; i < this.state.imgsNr; ++i){
            let contentImgId = this.props.idPrefix + "_CONTENT_IMG_" + (i+1);
            items.push(
                <div id={ contentImgId } key={ contentImgId } className="col-md-12 clearPadding margin-b-10">
                    <img src={ this.state.contentImgs[contentImgId].link } width="100%" className="over-hand" onClick={ () => this.handleContentImgLayerOpen(contentImgId) } alt="template-img-content 1400x660px" />
                </div>
            );
        }

        return (
            <div className="row">

                <div className="col-md-12 clearPadding margin-b-10 title-block">
                    <img src={ this.state.titleImgLink } width="100%" className="over-hand" onClick={ this.handleTitleImgLayerOpen } alt="template-img-title 1400x140px" />
                </div>
                <Modal title="Bild hinzufügen [ 输入图片的Link ]" 
                visible={ this.state.titleImgVisibleLayer }
                confirmLoading={this.state.titleImgConfirmLoading}
                onCancel={ this.handleTitleImgLayerCancel } 
                onOk={ this.handleTitleImgLayerOk }
                >
                    <div>Title ID: { this.props.idPrefix + "_TITLE" }</div>
                    <Input 
                        placeholder="https://"
                        prefix={<Icon type="link" />}
                        value={ (this.state.titleImgLink).includes(this.props.imgLinkInternalPrefix) ? '' : this.state.titleImgLink }
                        onChange={ this.onChangeTitleImgLink }
                        size="large"
                        className="margin-t-15"
                    />
                </Modal>
        
                {/* one or more than one images here */}
                <div id={ this.props.idPrefix + "-wrap" }>
                    { items }
                </div>

                <div className="col-md-12 margin-b-30">
                    <Button 
                        type="dashed" 
                        icon="plus-circle" 
                        size="large"
                        onClick={ this.handleAdd }
                        className="margin-r-10"
                    >Bild hinzufügen 增加一张图</Button>
                    <Button 
                        type="dashed" 
                        icon="minus-circle" 
                        size="large"
                        onClick={ this.handleReduce }
                    >Letztes Bild entfernen 删除最后一张图</Button>
                </div>

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

                this.setState({
                    imgsNr : this.getJsonLength(initDatas.contentImgs),
                    contentImgs : initDatas.contentImgs,
                    titleImgLink : initDatas.titleImgLink,
                    titleImgLink_Cache : initDatas.titleImgLink
                });
        
			}

		}

	}

}
