import React, { Component } from 'react';
import '../App.css';
import TopHeader from './Header';
import InfoForm from './Home/InfoForm';
import Header from './Home/Header';
import TopSlider from './Home/TopSlider';
import BodyV1801 from './Home/Body_v_18_01';
import BodyV1802 from './Home/Body_v_18_02';
import BodyV1803 from './Home/Body_v_18_03';
import BodyV1804 from './Home/Body_v_18_04';
import Footer from './Home/Footer';

import { Spin, Modal } from 'antd';

import Helper from './util/Helper';

const config = require('../config');

let templateDatas = {
  'infoForm' : null,
  'header' : null,
  'topSlider' : null,
  'body' : null
}

const imgLinkInternalPrefix = '/static/media/';

class Home extends Component  {

  constructor(props){
    super(props);
    this.setTemplateDatas = this.setTemplateDatas.bind(this);
    this.saveTemplate = this.saveTemplate.bind(this);
    this.saveTemplate_Ajax = this.saveTemplate_Ajax.bind(this);
    this.helper = new Helper();
  }

  state = {
    loading : false
  }

  setTemplateDatas(typ ,jObj){

    switch(typ){
      case 0:
        templateDatas.infoForm = jObj;
        break;
      case 1:
        templateDatas.header = jObj;
        break;
      case 2:
        templateDatas.topSlider = jObj;
        break;
      case 3:
        templateDatas.body = jObj;
        break;
      default:
        //
    }

  }

  saveTemplate(){

    var self = this;

    Modal.confirm({
      title : 'System-Info 系统消息',
      content : 
      <div className="margin-t-10">
        <div className="margin-t-5">Werden Sie wirklich die Template in die Datenbank speichern?</div>
        <div className="margin-t-5">确定要将此模板保存到数据库中吗？</div>
      </div>,
      onOk(){
        self.setState ({
          loading : true
        });
        setTimeout(() => {
          self.saveTemplate_Ajax();
        }, 0);
      },
      onCancel(){
        //
      }
    });

  }

  saveTemplate_Ajax = async () => {

    var create_by = 0;
    var update_by = 0;
    var channel_id = "1"; // default for eBay Mai&Mai
    if(templateDatas.infoForm !== null){
      channel_id =  "" + templateDatas.infoForm.channelId;
    }

    var version = this.props.match.params.v;
    var templateDatas_db = this.helper.textEncodeForMysql(templateDatas);

    // Settings
    const api_host = config.nodejs_api_host;
    const settings = {
        method: 'POST',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        //mode: 'no-cors',
        body: JSON.stringify({
          create_by : create_by,
          update_by : update_by,
          channel_id : channel_id,
          version : version,
          templateDatas_db : templateDatas_db
        })
    };
    
    try {
      let response = await fetch( api_host + '/api/template/add', settings );
      let data = await response.json();
      
      if(data.confirmation === 'success'){
        Modal.success({
          title: 'System-Info 系统消息',
          content: 
          <div className="margin-t-10">
            <div className="margin-t-5">{ "[ID:" + data.id + "] " + data.message }</div>
            <div className="margin-t-5">{ "[模板ID:" + data.id + "] 模板已经成功的存入了数据库。" }</div>
          </div>,
          onOk(){
            window.location.href = '/templates';
          }
        });
      }else{
        Modal.error({
          title: 'System-Fehler 系统错误',
          content: 
          <div className="margin-t-10">
            <div className="margin-t-5">{ data.message }</div>
          </div>,
        });
      }

    } catch(e) {
      Modal.error({
        title: 'System-Fehler 系统错误',
        content: 
        <div className="margin-t-10">
          <div className="margin-t-5">Sogood API Server ist nicht eingeschaltet.</div>
          <div className="margin-t-5">API服务器没有开启。</div>
        </div>,
      });
    }

    this.setState({
      loading : false
    });
    
  }

  render() {

    let version = this.props.match.params.v;
    let layout = null;

    switch(version){
      case '18.01':
        layout = <BodyV1801 action={ 'add' } imgLinkInternalPrefix={imgLinkInternalPrefix} setTemplateDatas={ this.setTemplateDatas } />;
        break;
      case '18.02':
        layout = <BodyV1802 action={ 'add' } imgLinkInternalPrefix={imgLinkInternalPrefix} setTemplateDatas={ this.setTemplateDatas } />;
        break;
      case '18.03':
        layout = <BodyV1803 action={ 'add' } imgLinkInternalPrefix={imgLinkInternalPrefix} setTemplateDatas={ this.setTemplateDatas } />;
        break;
      case '18.04':
        layout = <BodyV1804 action={ 'add' } imgLinkInternalPrefix={imgLinkInternalPrefix} setTemplateDatas={ this.setTemplateDatas } />;
        break;
      default:
        window.location.href='/404';
    }

    return (
      <div>
        <div className="row top-header width100per">
          <TopHeader page={ 'Home' } />
        </div>
        <Spin spinning={this.state.loading} size="large" tip="Loading... Please wait...">
        <div className="row padding-t-100">
          <InfoForm action={ 'add' } setTemplateDatas={ this.setTemplateDatas } saveTemplate={ this.saveTemplate } version={ version } />
        </div>
        <div className="row padding-t-15">
          <Header action={ 'add' } imgLinkInternalPrefix={imgLinkInternalPrefix} setTemplateDatas={ this.setTemplateDatas } />
        </div>
        <div className="row">
          <TopSlider action={ 'add' } imgLinkInternalPrefix={imgLinkInternalPrefix} setTemplateDatas={ this.setTemplateDatas } />
        </div>
        <div className="row">
          { layout }
        </div>
        <div className="row padding-b-15">
          <Footer action={ 'add' } imgLinkInternalPrefix={imgLinkInternalPrefix} setTemplateDatas={ this.setTemplateDatas } />
        </div>
        </Spin>
      </div>
    );
  }

}

export default Home;