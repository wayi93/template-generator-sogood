import React, { Component } from 'react';
import { Spin, Modal, Table, Divider, Tag, Icon, Input, Button } from 'antd';
import TopHeader from './Header';
import { NavLink } from 'react-router-dom';

import Helper from './util/Helper';

const config = require('../config');

class Templates extends Component {

  constructor(props){
    super(props);
    this.getTemplates = this.getTemplates.bind(this);
    this.cloneTemplate = this.cloneTemplate.bind(this);
    this.cloneTemplate_Ajax = this.cloneTemplate_Ajax.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.helper = new Helper();
  }

  state = {
    searchText: '',
    loading : true,
    templates : null
  }

  handleSearch = (selectedKeys, confirm) => () => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  }

  handleReset = clearFilters => () => {
    clearFilters();
    this.setState({ searchText: '' });
  }

  getTemplates = async() => {

    // Settings
    const api_host = config.nodejs_api_host;
    const settings = {
        method: 'POST',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
    };

    try {

      let response = await fetch( api_host + '/api/templates', settings );
      let data = await response.json();
      
      if(data.confirmation === 'success'){

        this.setState({
          loading : false,
          templates : this.helper.testDecodeForMysql(data.templates)
        });

        setTimeout(() => {
          //console.log(this.state.templates);
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

  cloneTemplate (id, name) {

    let self = this;

    Modal.confirm({
      title : 'System-Info 系统消息',
      content : 
      <div className="margin-t-10">
        <div className="margin-t-5">Werden Sie wirklich die folgende Template duplizieren?</div>
        <div className="margin-t-5">确定要复制下面这个模板吗？</div>
        <div className="margin-t-10"><Icon type="copy" size="large" />{ ' ' + name }</div>
      </div>,
      onOk(){
        self.setState ({
          loading : true
        });
        setTimeout(() => {
          self.cloneTemplate_Ajax(id);
        }, 0);
      },
      onCancel(){
        //
      }
    });

  }

  cloneTemplate_Ajax = async (id) => {

    var create_by = 0;
    var update_by = 0;

    // Settings
    const api_host = config.nodejs_api_host;
    const settings = {
        method: 'POST',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        //mode: 'no-cors',
        body: JSON.stringify({
          template_db_id : id,
          create_by : create_by,
          update_by : update_by
        })
    };
    
    try {
      let response = await fetch( api_host + '/api/template/clone', settings );
      let data = await response.json();
      
      if(data.confirmation === 'success'){
        Modal.success({
          title: 'System-Info 系统消息',
          content: 
          <div className="margin-t-10">
            <div className="margin-t-5">{ "[ID:" + data.id + "] " + data.message }</div>
            <div className="margin-t-5">{ "[模板ID:" + data.id + "] 已经成功地复制了模板。" }</div>
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

    let tplsTb = '';
    let tplsTbColums = [];
    let tplsTbDatas = [];

    if(this.state.templates !== null){
      
      tplsTbColums = [
        {
          title : 'ID',
          dataIndex : 'meta_id',
          key : 'meta_id',
          align : 'center'
        },
        {
          title : 'Create at',
          dataIndex : 'create_at_dt',
          key : 'create_at_dt'
        },
        {
          title : 'Product Name',
          dataIndex : 'product_name',
          key : 'product_name',
          filterDropdown: ({
            setSelectedKeys, selectedKeys, confirm, clearFilters,
          }) => (
            <div className="custom-filter-dropdown filter-seach-wrap">
              <Input
                ref={ele => this.searchInput = ele}
                placeholder="Name"
                value={selectedKeys[0]}
                onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                onPressEnter={this.handleSearch(selectedKeys, confirm)}
                className="width50per margin-r-10"
              />
              <Button type="primary" onClick={this.handleSearch(selectedKeys, confirm)} className="margin-r-10">Search</Button>
              <Button onClick={this.handleReset(clearFilters)}>Reset</Button>
            </div>
          ),
          onFilter: (value, record) => record.product_name.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus();
              });
            }
          },
          render: (text) => {
            const { searchText } = this.state;
            return searchText ? (
              <span>
                {text.split(new RegExp(`(${searchText})`, 'gi')).map((fragment, i) => (
                  fragment.toLowerCase() === searchText.toLowerCase()
                    ? <span key={i} className="highlight">{fragment}</span> : fragment // eslint-disable-line
                ))}
              </span>
            ) : text;
          }
        },
        {
          title : 'eBay-Artikelnummer',
          dataIndex : 'ebay_artikelnummer',
          key : 'ebay_artikelnummer',
          align : 'center',
          filterDropdown: ({
            setSelectedKeys, selectedKeys, confirm, clearFilters,
          }) => (
            <div className="custom-filter-dropdown filter-seach-wrap">
              <Input
                ref={ele => this.searchInput = ele}
                placeholder="Artikelnummer"
                value={selectedKeys[0]}
                onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                onPressEnter={this.handleSearch(selectedKeys, confirm)}
                className="width50per margin-r-10"
              />
              <Button type="primary" onClick={this.handleSearch(selectedKeys, confirm)} className="margin-r-10">Search</Button>
              <Button onClick={this.handleReset(clearFilters)}>Reset</Button>
            </div>
          ),
          onFilter: (value, record) => record.ebay_artikelnummer.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus();
              });
            }
          },
          render: (text) => {
            const { searchText } = this.state;
            return searchText ? (
              <span>
                {text.split(new RegExp(`(${searchText})`, 'gi')).map((fragment, i) => (
                  fragment.toLowerCase() === searchText.toLowerCase()
                    ? <span key={i} className="highlight">{fragment}</span> : fragment // eslint-disable-line
                ))}
              </span>
            ) : text;
          }
        },
        {
          title : 'Channel',
          dataIndex : 'channel',
          key : 'channel',
          align : 'center',

          // Filter
          filters: [
            { text: 'eBay Mai&Mai', value: 'eBay Mai&Mai' },
            { text: 'eBay Sogood', value: 'eBay Sogood' },
          ],
          onFilter: (value, record) => record.channel.includes(value),

        },
        {
          title : 'Version',
          dataIndex : 'version',
          key : 'version',
          align : 'center',
          render: (text, record) => <div>
            <Tag color="blue">{ record.version }</Tag>
          </div>,

          // Filter
          filters: [
            { text: 'Version 18.01', value: '18.01' },
            { text: 'Version 18.02', value: '18.02' },
            { text: 'Version 18.03', value: '18.03' },
            { text: 'Version 18.04', value: '18.04' },
          ],
          onFilter: (value, record) => record.version.includes(value),

        },
        {
          title : '',
          dataIndex : '',
          key : 'action',
          render: (text, record) => <div>
            <NavLink to={ "/template/html/" + record.meta_id } >HTML</NavLink>
            <Divider type="vertical" />
            <NavLink to={ "#" } onClick={ () => this.cloneTemplate(record.meta_id, record.product_name) } >Clone</NavLink>
            <Divider type="vertical" />
            <NavLink to={ "/template/edit/" + record.meta_id } >Edit</NavLink>
          </div>
        }
      ];

      tplsTbDatas = this.state.templates;

      tplsTb = <Table 
      columns={tplsTbColums} 
      dataSource={tplsTbDatas} 
      size="large"
      rowKey={ (record, index) => `template-${index}` }
      />;

    }

    return (
      <div>
        <div className="row top-header width100per">
          <TopHeader page={ 'Templates' } />
        </div>
        <Spin spinning={this.state.loading} size="large" tip="Loading... Please wait...">
        <div className="row padding-t-115">
            <div className="col-md-12">
                
                {/** Templates Table */}
                { tplsTb }

            </div>
        </div>
        </Spin>
      </div>
    );
  }

  componentDidMount() {
    // ajax request
    this.getTemplates();
  }

}

export default Templates;
