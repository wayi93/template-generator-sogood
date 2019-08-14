import React, { Component } from 'react';

import { Modal, Button, Input, Icon } from 'antd';

import noEbayProductImg from '../../images/no-ebay-product.jpg';
import noImg140 from '../../images/no-img-1400-140.jpg';
import imgBestseller from '../../images/img-title-bestseller.jpg';
import imgSimilar from '../../images/img-title-similar.jpg';

export default class EbayProducts extends Component {

    constructor(props){
        super(props);
        this.handleAdd = this.handleAdd.bind(this);
        this.handleReduce = this.handleReduce.bind(this);
        this.handleLayerOpen = this.handleLayerOpen.bind(this);
        this.dontDeleteInfo = this.dontDeleteInfo.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);

        this.handleTitleLayerOpen = this.handleTitleLayerOpen.bind(this);
        this.handleTitleLayerCancel = this.handleTitleLayerCancel.bind(this);
        this.handleTitleLayerOk = this.handleTitleLayerOk.bind(this);
        this.onChangeTitleImgLink = this.onChangeTitleImgLink.bind(this);
        this.getJsonLength = this.getJsonLength.bind(this);

        /* set defaut value for all inputs */
        let productsArr = {};
        productsArr.blockTitleImgLink = noImg140;
        productsArr.blockTitleImgLink_Cache = noImg140;
        switch(this.props.typ){
            case 'BESTSELLER':
                productsArr.blockTitleImgLink = imgBestseller;
                productsArr.blockTitleImgLink_Cache = imgBestseller;
                break;
            case 'SIMILAR':
                productsArr.blockTitleImgLink = imgSimilar;
                productsArr.blockTitleImgLink_Cache = imgSimilar;
                break;
            default:
                productsArr.blockTitleImgLink = noImg140;
                productsArr.blockTitleImgLink_Cache = noImg140;
        }
        for(var i = 0; i < props.nrInRow; ++i){
            let pId = props.idPrefix + "_PRODUCT_" + (i+1);
            let oneProduct = {
                id : pId,
                name : 'Produktname 商品名称',
                name_Cache : 'Produktname 商品名称',
                eBayArtikelNr : '',
                eBayArtikelNr_Cache : '',
                imgLink : noEbayProductImg,
                imgLink_Cache : noEbayProductImg
            }
            productsArr[pId] = oneProduct;
        }
        this.state = {
            products : productsArr,
            childrenNr : props.nrInRow,
            currentProductId : '',
            titleVisibleLayer : false,
            titleConfirmLoading : false
        };

    }

    handleAdd(){
        let newChildrenNr = this.state.childrenNr + 1;
        let newPid = this.props.idPrefix + "_PRODUCT_" + newChildrenNr;
        let newProduct = {
            id : newPid,
            name : 'Produktname 商品名称',
            name_Cache : 'Produktname 商品名称',
            eBayArtikelNr : '',
            eBayArtikelNr_Cache : '',
            imgLink : noEbayProductImg,
            imgLink_Cache : noEbayProductImg
        }
        let newProducts = this.state.products;
        newProducts[newPid] = newProduct;
        this.setState({
            childrenNr : this.state.childrenNr + 1,
            products : newProducts
        });
    }

    handleReduce(){
        if(this.state.childrenNr > this.props.nrInRow){

            // remove the last product
            let newProducts = this.state.products;
            delete newProducts[this.props.idPrefix + "_PRODUCT_" + this.state.childrenNr];

            this.setState({
                childrenNr : this.state.childrenNr - 1,
                products : newProducts
            });

            setTimeout(() => {
                this.props.setBodyDatas(this.props.idPrefix, this.state.products);
            }, 0);

        }else{
            this.dontDeleteInfo();
        }
    }

    handleLayerOpen(productId){

        this.setState({
            currentProductId : productId
        });

        setTimeout(() => {

            //console.log(this.state.currentProductId);
            let _this = this;

            Modal.confirm({
                title: 'Produkt hinzufügen [ 添加一个商品 ]',
                iconType: 'code-sandbox',
                width: 500,
                content: (
                    <div className="padding-r-35">
                        <div>Produkt ID: { productId }</div>
                        <Input 
                        placeholder="Produktname 商品名称"
                        prefix={ <Icon type="tag" /> }
                        defaultValue={ (this.state.products[productId].name) === ("Produktname 商品名称") ? '' : (this.state.products[productId].name) }
                        onChange={ (e) => this.handleOnChange(productId, 0, e) }
                        size="large"
                        className="margin-t-15"
                        />
                        <Input 
                        placeholder="eBay-Artikelnummer"
                        prefix={ <Icon type="barcode" /> }
                        defaultValue={ this.state.products[productId].eBayArtikelNr }
                        onChange={ (e) => this.handleOnChange(productId, 1, e) }
                        size="large"
                        className="margin-t-10"
                        />
                        <Input 
                        placeholder="Link des Produktbilds 商品图片Link"
                        prefix={ <Icon type="link" /> }
                        defaultValue={ (this.state.products[productId].imgLink).includes(this.props.imgLinkInternalPrefix) ? '' : (this.state.products[productId].imgLink) }
                        onChange={ (e) => this.handleOnChange(productId, 2, e) }
                        size="large"
                        className="margin-t-10"
                        />
                    </div>
                ),
                onOk(){
                    
                    // set Value to Cache
                    let productsInState = _this.state.products;
                    productsInState[productId].name_Cache = productsInState[productId].name;
                    productsInState[productId].eBayArtikelNr_Cache = productsInState[productId].eBayArtikelNr;
                    productsInState[productId].imgLink_Cache = productsInState[productId].imgLink;
                    _this.setState({
                        products : productsInState
                    });

                    // set Value to parent component 001 - pics
                    _this.props.setBodyDatas(_this.props.idPrefix, productsInState);

                },
                onCancel(){

                    // set Cache to Value back
                    let productsInState = _this.state.products;
                    productsInState[productId].name = productsInState[productId].name_Cache;
                    productsInState[productId].eBayArtikelNr = productsInState[productId].eBayArtikelNr_Cache;
                    productsInState[productId].imgLink = productsInState[productId].imgLink_Cache;
                    _this.setState({
                        products : productsInState
                    });

                }
            });

        }, 0);
        
    }

    dontDeleteInfo(){
        Modal.info({
            title : 'System-Info 系统消息',
            content : (
              <div className="margin-t-10">
                <div className="margin-t-5">Die Module muss mindestens { this.props.nrInRow } Produkte aus eBay enthalten.</div>
                <div className="margin-t-5">这个模块儿至少要有{ this.props.nrInRow }个eBay商品。</div>
              </div>
            ),
            onOk () {}
        });
    }

    handleOnChange (productId, index, e) {
        
        //TODO: valid the link of image

        let newValue = e.target.value;
        let newProducts = this.state.products;
        
        switch (index) {
            case 0:
                newProducts[productId].name = newValue;
                break;
            case 1:
                newProducts[productId].eBayArtikelNr = newValue;
                break;
            case 2:
                newProducts[productId].imgLink = newValue;
                break;
            default:
                //
        }

        this.setState({
            products : newProducts
        });

        /*
        console.log('Name: ' + this.state.products[productId].name);
        console.log('eBayArtikelNr: ' + this.state.products[productId].eBayArtikelNr);
        console.log('Link: ' + this.state.products[productId].imgLink);
        */

    }


    /** Functions for Title Input Layer */
    handleTitleLayerOpen(){
        this.setState({
            titleVisibleLayer : true
        });

        //console.log(this.state.products);
    }
    handleTitleLayerCancel(){
        let productsInState = this.state.products;
        productsInState.blockTitleImgLink = productsInState.blockTitleImgLink_Cache;
        this.setState({
            titleVisibleLayer : false,
            products : productsInState
        });
    }
    handleTitleLayerOk(){
        let productsInState = this.state.products;
        productsInState.blockTitleImgLink_Cache = productsInState.blockTitleImgLink;
        this.setState({
            titleVisibleLayer : false,
            products : productsInState
        });

        // set Value to parent component 002 - title img
        setTimeout(()=>{
            this.props.setBodyDatas(this.props.idPrefix, productsInState);
        }, 0);
    }
    onChangeTitleImgLink = (e) => {
        
        //TODO: valid the link of image

        let newVal = e.target.value;
        let productsInState = this.state.products;
        if(newVal === ''){
            productsInState.blockTitleImgLink = noImg140;
        }else{
            productsInState.blockTitleImgLink = newVal;
        }
        this.setState({
            products : productsInState
        });

    }



    /*********************************************************
     * Render
     *********************************************************/
    render() {

        let items = [];
        for(var i = 0; i < this.state.childrenNr; ++i){

            let pId = this.props.idPrefix + "_PRODUCT_" + (i+1);

            items.push(
                <div id={ pId } key={ pId } className={ this.props.colClassName + " margin-b-10" }>
                    <div className="one-product-block">
                        <a href={ (this.state.products[pId].eBayArtikelNr === '') ? 'https://www.ebay.de/' : 'https://www.ebay.de/itm/' + this.state.products[pId].eBayArtikelNr } rel="noopener noreferrer" target="_blank"><img src={ this.state.products[pId].imgLink } width="100%" alt="template-img-product-ebay 500x500px" /></a>
                        <div className="one-product-title">{ this.state.products[pId].name }</div>
                    </div>
                    <div>
                        <Button 
                            type="dashed" 
                            icon="edit" 
                            size="large"
                            onClick={ () => this.handleLayerOpen(pId) }
                        >Bearbeiten 编辑</Button>
                    </div>
                </div>
            );

        }

        let title = (
            <div className="col-md-12 clearPadding margin-b-10 title-block">
                <img src={ this.state.products.blockTitleImgLink } width="100%" className="over-hand" onClick={ this.handleTitleLayerOpen } alt="template-img-title 1400x140px" />
                <Modal title="Bild hinzufügen [ 输入图片的Link ]" 
                visible={ this.state.titleVisibleLayer }
                confirmLoading={ this.state.titleConfirmLoading }
                onCancel={ this.handleTitleLayerCancel } 
                onOk={ this.handleTitleLayerOk }
                >
                    <div>Title ID: { this.props.idPrefix + "_TITLE" }</div>
                    <Input 
                    placeholder="https://"
                    prefix={<Icon type="link" />}
                    value={ (this.state.products.blockTitleImgLink).includes(this.props.imgLinkInternalPrefix) ? '' : (this.state.products.blockTitleImgLink) }
                    onChange={ this.onChangeTitleImgLink }
                    size="large"
                    className="margin-t-15"
                    />
                </Modal>
            </div>
        );

        return (
            <div className="row">

                { this.props.hasTitle ? title : '' }

                <div className="col-md-12 margin-b-20">

                    <div className="row" id={ this.props.idPrefix + "-wrap" }>
                        { items }
                    </div>

                    <div className="row">
                        <div className="col-md-12 margin-b-30">
                            <Button 
                                type="dashed" 
                                icon="plus-circle" 
                                size="large"
                                onClick={ this.handleAdd }
                                className="margin-r-10"
                            >Produkt hinzufügen 增加一个eBay商品</Button>
                            <Button 
                                type="dashed" 
                                icon="minus-circle" 
                                size="large"
                                onClick={ this.handleReduce }
                            >Letztes Produkt entfernen 删除最后一个eBay商品</Button>
                        </div>
                    </div>

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
                    products : initDatas,
                    childrenNr : this.getJsonLength(initDatas) - 2
                });
        
			}

		}

	}

}
