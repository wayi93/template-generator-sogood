import React, { Component } from 'react';
import TopHeader from './Header';
import { Spin, Alert } from 'antd';

import imgV1801 from '../images/v18.01.jpg';
import imgV1802 from '../images/v18.02.jpg';
import imgV1803 from '../images/v18.03.jpg';
import imgV1804 from '../images/v18.04.jpg';

class Layouts extends Component {

  constructor(props){
    super(props);
    this.test = this.test.bind(this);
  }

  state = {
    loading : true
  }

  test(){
    console.log('Layouts');
  }

  render() {

    return (
      <div>
        <div className="row top-header width100per">
          <TopHeader page={ 'Layouts' } />
        </div>
        <Spin spinning={this.state.loading} size="large" tip="Loading... Please wait...">
          <div className="row padding-t-100">
            <Alert
              message="Bitte zuerst ein Layout auswählen."
              description="制作模板之前，先选择一个布局。"
              type="info"
              showIcon
              className="margin-t-20 margin-b-30 width100per"
            />
          </div>
          <div className="row margin-b-60">
              <div className="col-md-3 center margin-b-20">
                Version 18.01<br/>
                <a href="/create-a-template/version/18.01" ><img src={ imgV1801 } alt="template-img-layout-v18.01" /></a>
              </div>
              <div className="col-md-3 center margin-b-20">
                Version 18.02<br/>
                <a href="/create-a-template/version/18.02" ><img src={ imgV1802 } alt="template-img-layout-v18.02" /></a>
              </div>
              <div className="col-md-3 center margin-b-20">
                Version 18.03<br/>
                <a href="/create-a-template/version/18.03" ><img src={ imgV1803 } alt="template-img-layout-v18.03" /></a>
              </div>
              <div className="col-md-3 center margin-b-20">
                Version 18.04<br/>
                <a href="/create-a-template/version/18.04" ><img src={ imgV1804 } alt="template-img-layout-v18.04" /></a>
              </div>
          </div>
        </Spin>
      </div>
    );

  }

  componentDidMount(){
    this.setState({
      loading : false
    });
  }

}

export default Layouts;
