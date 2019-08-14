import React, { Component } from 'react';
import { Alert, Button, Modal } from 'antd';

const config = require('../../config');

export default class TplMainInfo extends Component {

    constructor(props){
        super(props);
        this.deleteTemplate = this.deleteTemplate.bind(this);
        this.deleteTemplate_Ajax = this.deleteTemplate_Ajax.bind(this);
    }

    deleteTemplate = (id) => {
        var self = this;

        Modal.confirm({
        title : 'System-Info 系统消息',
        content : 
        <div className="margin-t-10">
            <div className="margin-t-5">Werden Sie wirklich die Template entfernen?</div>
            <div className="margin-t-5">确定要将此模板删除吗？</div>
        </div>,
        onOk(){
            self.props.activeLoadingInSubComponent();
            setTimeout(() => {
                self.deleteTemplate_Ajax(id);
            }, 0);
        },
        onCancel(){
            //
        }
        });

    }

    deleteTemplate_Ajax = async (id) => {
        
        // Settings
        const api_host = config.nodejs_api_host;
        const settings = {
            method: 'POST',
            headers: {
            "Content-Type": "application/x-www-form-urlencoded"
            },
            //mode: 'no-cors',
            body: JSON.stringify({
                template_db_id : id
            })
        };
        
        try {
            let response = await fetch( api_host + '/api/template/delete', settings );
            let data = await response.json();
            
            if(data.confirmation === 'success'){
                Modal.success({
                title: 'System-Info 系统消息',
                content: 
                <div className="margin-t-10">
                    <div className="margin-t-5">{ "[ID:" + data.id + "] " + data.message }</div>
                    <div className="margin-t-5">{ "[模板ID:" + data.id + "] 模板已经被成功删除。" }</div>
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

    }

    render() {

        let msg = <div className="col-md-12">
            Informational Notes
        </div>;

        let desc = <div>
            <div className="row col-md-12">
                <div className="col-md-4">
                    <b>Template ID:</b> { this.props.template_db_id }
                </div>
                <div className="col-md-4">
                    <b>Channel:</b> { this.props.channel }
                </div>
                <div className="col-md-4">
                    <b>Version:</b> { this.props.version }
                </div>
            </div>
            <div className="row col-md-12">
                <div className="col-md-4">
                    <b>Create at:</b> { this.props.create_at_dt }
                </div>
                <div className="col-md-4">
                    <b>Update at:</b> { this.props.update_at_dt }
                </div>
                <div className="col-md-4">
                    <Button type="danger" size="small" onClick={ () => this.deleteTemplate(this.props.template_db_id) } >Delete this Template</Button>
                </div>
            </div>
        </div>;

        return (
            <div className="width100per padding-15">
                <div className="row">
                    <div className="col-md-12">
                        <Alert
                            message = { msg }
                            description = { desc }
                            type = "info"
                            showIcon
                        />
                    </div>
                </div>
            </div>
        )

    }

}
