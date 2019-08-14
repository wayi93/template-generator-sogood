import React, { Component } from 'react';
import { Input, Icon, Button, Tag, Select } from 'antd';
const Option = Select.Option;

export default class InfoForm extends Component {

    constructor(props){
        super(props);
        this.handleSave = this.handleSave.bind(this);
        this.syncDatas = this.syncDatas.bind(this);
        this.onChangeProductName = this.onChangeProductName.bind(this);
        this.onChangeEbayArtikelNr = this.onChangeEbayArtikelNr.bind(this);
        this.onChangeChannel = this.onChangeChannel.bind(this);
    }

    state = {
        templateId : 0,
        channelId : "1",
        productName : '',
        eBayArtikelNr : ''
    }

    handleSave = () => {
        this.props.saveTemplate();
    }

    syncDatas = () => {
        this.props.setTemplateDatas(0, {
            templateId : this.state.templateId,
            channelId : this.state.channelId,
            productName : this.state.productName,
            eBayArtikelNr : this.state.eBayArtikelNr
        });
    }

    onChangeChannel = (value) => {
        this.setState({
            channelId : value
        });
        setTimeout(() => {
            this.syncDatas();
        }, 0);
    }

    onChangeProductName = (e) => {
        this.setState({
            productName : e.target.value
        });
        setTimeout(() => {
            this.syncDatas();
        }, 0);
    }

    onChangeEbayArtikelNr = (e) => {
        this.setState({
            eBayArtikelNr : e.target.value
        });
        setTimeout(() => {
            this.syncDatas();
        }, 0);
    }

    render() {

        let vTag = null;
        if(this.props.action === 'add'){
            vTag = <Tag color="blue" size="large">{ 'version: ' + this.props.version }</Tag>;
        }

        return (
            <div className="width100per padding-15">
                <div className="row">
                    <div className="col-md-2">
                        <Select 
                            value={ "" + this.state.channelId }
                            size="large"
                            className="width100per"
                            onChange={ this.onChangeChannel }
                        >
                            <Option value="1">eBay Mai&Mai</Option>
                            <Option value="2">eBay Sogood</Option>
                        </Select>
                    </div>
                    <div className="col-md-3">
                        <Input 
                        placeholder="Produktname* 产品名称*"
                        prefix={<Icon type="tag" />}
                        size="large"
                        value={ this.state.productName }
                        onChange={ e => this.onChangeProductName(e) }
                        />
                    </div>
                    <div className="col-md-3">
                        <Input 
                        placeholder="eBay-Artikelnummer"
                        prefix={<Icon type="barcode" />}
                        size="large"
                        value={ this.state.eBayArtikelNr }
                        onChange={ e => this.onChangeEbayArtikelNr(e) }
                        />
                    </div>
                    <div className="col-md-4">
                        <Button 
                            type="primary" 
                            icon="save" 
                            size="large"
                            onClick={ this.handleSave } 
                            className="margin-r-20"
                        >Speichern 保存模板</Button>
                        { vTag }
                    </div>
                </div>
            </div>
        )
    }

    componentDidMount(){

        // init data
        if(this.props.action === 'edit'){

            let initDatas = this.props.initDatas;

            this.setState({
                templateId : initDatas.templateId,
                channelId : initDatas.channelId,
                productName : initDatas.productName,
                eBayArtikelNr : initDatas.eBayArtikelNr
            });

        }

    }

}
