import React, { Component } from 'react';
import TopHeader from './Header';
import TplMainInfo from './TemplateEdit/TplMainInfo';
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

class TemplateEdit extends Component {

  constructor(props){
    super(props);
    this.getTemplate = this.getTemplate.bind(this);
    this.setTemplateDatas = this.setTemplateDatas.bind(this);
    this.saveTemplate = this.saveTemplate.bind(this);
    this.updateTemplate_Ajax = this.updateTemplate_Ajax.bind(this);
    this.activeLoadingInSubComponent = this.activeLoadingInSubComponent.bind(this);
    this.helper = new Helper();
  }

  state = {
    loading : true,
    template : null,
    version : ''
  }

  activeLoadingInSubComponent(){
    this.setState({
      loading : true
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
          loading : false,
          template : this.helper.testDecodeForMysql(data.template),
          version : data.template.version
        });

        templateDatas = JSON.parse(data.template.content);

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

    var newTpl = this.state.template;
    newTpl.content = JSON.stringify(templateDatas);
    this.setState({
      template : newTpl
    });
    
  }

  saveTemplate(){

    var self = this;

    Modal.confirm({
      title : 'System-Info 系统消息',
      content : 
      <div className="margin-t-10">
        <div className="margin-t-5">Werden Sie wirklich die Änderungen der Template in die Datenbank speichern?</div>
        <div className="margin-t-5">确定要将修改的内容保存到数据库中吗？</div>
      </div>,
      onOk(){
        self.setState ({
          loading : true
        });
        setTimeout(() => {
          self.updateTemplate_Ajax();
        }, 0);
      },
      onCancel(){
        //
      }
    });

  }

  updateTemplate_Ajax = async () => {

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
          template_db_id : this.props.match.params.id,
          templateDatas_db : templateDatas_db
        })
    };
    
    try {
      let response = await fetch( api_host + '/api/template/update', settings );
      let data = await response.json();
      
      if(data.confirmation === 'success'){
        Modal.success({
          title: 'System-Info 系统消息',
          content: 
          <div className="margin-t-10">
            <div className="margin-t-5">{ "[ID:" + data.id + "] " + data.message }</div>
            <div className="margin-t-5">{ "[模板ID:" + data.id + "] 修改的内容已经成功的存入了数据库。" }</div>
          </div>,
          onOk(){
            window.location.reload();
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

    let version = this.state.version;
    let layout = null;

    let tplWrap = <div></div>;

    if(this.state.template !== null){

      let tpl = this.state.template;

      let tplCtnt = JSON.parse(tpl.content);
      templateDatas.infoForm = tplCtnt.infoForm;
      if(templateDatas.infoForm === null){
        templateDatas.infoForm = {
          templateId : 0,
          productName : '',
          eBayArtikelNr : ''
        }
      }
      templateDatas.infoForm.templateId = this.props.match.params.id;
      templateDatas.header = tplCtnt.header;
      templateDatas.topSlider = tplCtnt.topSlider;
      templateDatas.body = tplCtnt.body;

      switch(version){
        case '18.01':
          layout = <BodyV1801 action={ 'edit' } initDatas={ templateDatas.body } imgLinkInternalPrefix={imgLinkInternalPrefix} setTemplateDatas={ this.setTemplateDatas } />;
          break;
        case '18.02':
          layout = <BodyV1802 action={ 'edit' } initDatas={ templateDatas.body } imgLinkInternalPrefix={imgLinkInternalPrefix} setTemplateDatas={ this.setTemplateDatas } />;
          break;
        case '18.03':
          layout = <BodyV1803 action={ 'edit' } initDatas={ templateDatas.body } imgLinkInternalPrefix={imgLinkInternalPrefix} setTemplateDatas={ this.setTemplateDatas } />;
          break;
        case '18.04':
          layout = <BodyV1804 action={ 'edit' } initDatas={ templateDatas.body } imgLinkInternalPrefix={imgLinkInternalPrefix} setTemplateDatas={ this.setTemplateDatas } />;
          break;
        default:
          window.location.href='/404';
      }
      
      tplWrap = <div>
                  <div className="row padding-t-100">
                    <TplMainInfo 
                      template_db_id={ tpl.template_db_id } 
                      create_at_dt={ tpl.create_at_dt } 
                      update_at_dt={ tpl.update_at_dt } 
                      channel={ tpl.channel } 
                      version={ tpl.version } 
                      is_active={ tpl.is_active } 
                      activeLoadingInSubComponent = { this.activeLoadingInSubComponent }
                    />
                  </div>
                  <div className="row">
                    <InfoForm action={ 'edit' } initDatas={ templateDatas.infoForm } setTemplateDatas={ this.setTemplateDatas } saveTemplate={ this.saveTemplate } />
                  </div>
                  <div className="row padding-t-15">
                    <Header action={ 'edit' } initDatas={ templateDatas.header } imgLinkInternalPrefix={imgLinkInternalPrefix} setTemplateDatas={ this.setTemplateDatas } />
                  </div>
                  <div className="row">
                    <TopSlider action={ 'edit' } initDatas={ templateDatas.topSlider } imgLinkInternalPrefix={imgLinkInternalPrefix} setTemplateDatas={ this.setTemplateDatas } />
                  </div>
                  <div className="row">
                    { layout }
                  </div>
                  <div className="row padding-b-15">
                    <Footer action={ 'edit' } imgLinkInternalPrefix={imgLinkInternalPrefix} setTemplateDatas={ this.setTemplateDatas } />
                  </div>
                </div>;
      
    }

    return (
      <div>
        <div className="row top-header width100per">
          <TopHeader page={ 'TemplateEdit' } />
        </div>
        <Spin spinning={this.state.loading} size="large" tip="Loading... Please wait...">
        { tplWrap }
        </Spin>
      </div>
    );

  }

  componentDidMount() {
    // ajax request
    this.getTemplate();
  }

}

export default TemplateEdit;
