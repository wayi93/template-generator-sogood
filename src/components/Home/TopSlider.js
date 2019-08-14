import React, { Component } from 'react';
import { Modal, Input, Icon } from 'antd';
// eslint-disable-next-line
import propTypes from 'prop-types';
import noImg140 from '../../images/no-img-1400-140.jpg';
import noImg500 from '../../images/no-img-1400-500.jpg';

export default class TopSlider extends Component {

	constructor(props){
    super(props);
    this.handleLayerOpen = this.handleLayerOpen.bind(this);
    this.handleLayerCancel = this.handleLayerCancel.bind(this);
		this.handleLayerOk = this.handleLayerOk.bind(this);
		this.onChangeImgLink = this.onChangeImgLink.bind(this);
  }

	state = {
		titleImgLink : noImg140,
		sliderImgLink01 : noImg500,
		sliderImgLink02 : noImg500,
		sliderImgLink03 : noImg500,
		sliderImgLink04 : noImg500,
		sliderImgLink05 : noImg500,
		titleImgLink_Cache : noImg140,
		sliderImgLink01_Cache : noImg500,
		sliderImgLink02_Cache : noImg500,
		sliderImgLink03_Cache : noImg500,
		sliderImgLink04_Cache : noImg500,
		sliderImgLink05_Cache : noImg500,
		modalText : 'Content of the modal',
		visibleLayer01 : false,
		confirmLoading01 : false,
		visibleLayer02 : false,
		confirmLoading02 : false
	}

	handleLayerOpen (id) {
		switch(id){
			case 1:
				this.setState({
					visibleLayer01 : true,
					titleImgLink_Cache : this.state.titleImgLink
				});
				break;
			case 2:
				this.setState({
					visibleLayer02 : true,
					sliderImgLink01_Cache : this.state.sliderImgLink01,
					sliderImgLink02_Cache : this.state.sliderImgLink02,
					sliderImgLink03_Cache : this.state.sliderImgLink03,
					sliderImgLink04_Cache : this.state.sliderImgLink04,
					sliderImgLink05_Cache : this.state.sliderImgLink05
				});
				break;
			default:
				//
		}
	}
	
	handleLayerCancel (id) {
    switch(id){
			case 1:
				this.setState({
					visibleLayer01 : false,
					titleImgLink : this.state.titleImgLink_Cache
				});
				break;
			case 2:
				this.setState({
					visibleLayer02 : false,
					sliderImgLink01 : this.state.sliderImgLink01_Cache,
					sliderImgLink02 : this.state.sliderImgLink02_Cache,
					sliderImgLink03 : this.state.sliderImgLink03_Cache,
					sliderImgLink04 : this.state.sliderImgLink04_Cache,
					sliderImgLink05 : this.state.sliderImgLink05_Cache
				});
				break;
			default:
				//
		}
  }

  handleLayerOk (id) {
    switch(id){
			case 1:
				this.setState({
					visibleLayer01 : false
				});
				break;
			case 2:
				this.setState({
					visibleLayer02 : false
				});
				break;
			default:
				//
		}
		setTimeout(() => {
      this.syncDatas();
    }, 0);
	}

	syncDatas = () => {
    this.props.setTemplateDatas(2, {
      titleImgLink : this.state.titleImgLink,
			sliderImgLink01 : this.state.sliderImgLink01,
			sliderImgLink02 : this.state.sliderImgLink02,
			sliderImgLink03 : this.state.sliderImgLink03,
			sliderImgLink04 : this.state.sliderImgLink04,
			sliderImgLink05 : this.state.sliderImgLink05
    });
  }
	
	onChangeImgLink (id, e) {

		let newImgLink = e.target.value;

		if(newImgLink === ''){
			
			switch(id){
				case 1:
					this.setState({
						titleImgLink : noImg140
					});
					break;
				case 21:
					this.setState({
						sliderImgLink01 : noImg500
					});
					break;
				case 22:
					this.setState({
						sliderImgLink02 : noImg500
					});
					break;
				case 23:
					this.setState({
						sliderImgLink03 : noImg500
					});
					break;
				case 24:
					this.setState({
						sliderImgLink04 : noImg500
					});
					break;
				case 25:
					this.setState({
						sliderImgLink05 : noImg500
					});
					break;
				default:
					//
			}

		}else{

			switch(id){
				case 1:
					this.setState({
						titleImgLink : newImgLink
					});
					break;
				case 21:
					this.setState({
						sliderImgLink01 : newImgLink
					});
					break;
				case 22:
					this.setState({
						sliderImgLink02 : newImgLink
					});
					break;
				case 23:
					this.setState({
						sliderImgLink03 : newImgLink
					});
					break;
				case 24:
					this.setState({
						sliderImgLink04 : newImgLink
					});
					break;
				case 25:
					this.setState({
						sliderImgLink05 : newImgLink
					});
					break;
				default:
					//
			}

		}

	}

  render() {
    return (
      <div className="width100per">
        <div className="col-md-12 margin-b-10 min-height-noImg">
					<img src={ this.state.titleImgLink } className="over-hand" width="100%" onClick={ () => this.handleLayerOpen(1) } alt="template-img-title 1400x140px" />
					<Modal title="Bild hinzufügen [ 输入图片的Link ]" 
					visible={ this.state.visibleLayer01 }
					confirmLoading={ this.state.confirmLoading01 }
					onCancel={ () => this.handleLayerCancel(1) } 
					onOk={ () => this.handleLayerOk(1) }
					>
						<div>Title ID: TITLE_1</div>
						<Input 
							placeholder="https://"
							prefix={<Icon type="link" />}
							value={ (this.state.titleImgLink).includes(this.props.imgLinkInternalPrefix) ? '' : this.state.titleImgLink }
							onChange={ (e) => this.onChangeImgLink(1, e) }
							size="large"
							className="margin-t-15"
						/>
					</Modal>
				</div>
				<div className="col-md-12 margin-b-10">
					<div className="slider">
					
						<input type="radio" name="slide_switch" id="id1" defaultChecked />
						<label htmlFor="id1">
							<img src={this.state.sliderImgLink01} width="100%" alt="template-img-slider 1400x500px" />
						</label>
						<img src={this.state.sliderImgLink01} className="over-hand" width="100%" onClick={ () => this.handleLayerOpen(2) } alt="template-img-slider 1400x500px" />
					
						<input type="radio" name="slide_switch" id="id2" />
						<label htmlFor="id2">
							<img src={this.state.sliderImgLink02} width="100%" alt="template-img-slider 1400x500px" />
						</label>
						<img src={this.state.sliderImgLink02} className="over-hand" width="100%" onClick={ () => this.handleLayerOpen(2) } alt="template-img-slider 1400x500px" />
						
						<input type="radio" name="slide_switch" id="id3" />
						<label htmlFor="id3">
							<img src={this.state.sliderImgLink03} width="100%" alt="template-img-slider 1400x500px" />
						</label>
						<img src={this.state.sliderImgLink03} className="over-hand" width="100%" onClick={ () => this.handleLayerOpen(2) } alt="template-img-slider 1400x500px" />
						
						<input type="radio" name="slide_switch" id="id4" />
						<label htmlFor="id4">
							<img src={this.state.sliderImgLink04} width="100%" alt="template-img-slider 1400x500px" />
						</label>
						<img src={this.state.sliderImgLink04} className="over-hand" width="100%" onClick={ () => this.handleLayerOpen(2) } alt="template-img-slider 1400x500px" />
						
						<input type="radio" name="slide_switch" id="id5" />
						<label htmlFor="id5">
							<img src={this.state.sliderImgLink05} width="100%" alt="template-img-slider 1400x500px" />
						</label>
						<img src={this.state.sliderImgLink05} className="over-hand" width="100%" onClick={ () => this.handleLayerOpen(2) } alt="template-img-slider 1400x500px" />

						<Modal title="Bild hinzufügen [ 输入图片的Link ]" 
						visible={ this.state.visibleLayer02 }
						confirmLoading={ this.state.confirmLoading02 }
						onCancel={ () => this.handleLayerCancel(2) } 
						onOk={ () => this.handleLayerOk(2) }
						>
							<div>Produkt Galerie 商品相册</div>
							<Input 
								placeholder="https://"
								prefix={<Icon type="link" />}
								value={ (this.state.sliderImgLink01).includes(this.props.imgLinkInternalPrefix) ? '' : this.state.sliderImgLink01 }
								onChange={ (e) => this.onChangeImgLink(21, e) }
								size="large"
								className="margin-t-15"
							/>
							<Input 
								placeholder="https://"
								prefix={<Icon type="link" />}
								value={ (this.state.sliderImgLink02).includes(this.props.imgLinkInternalPrefix) ? '' : this.state.sliderImgLink02 }
								onChange={ (e) => this.onChangeImgLink(22, e) }
								size="large"
								className="margin-t-10"
							/>
							<Input 
								placeholder="https://"
								prefix={<Icon type="link" />}
								value={ (this.state.sliderImgLink03).includes(this.props.imgLinkInternalPrefix) ? '' : this.state.sliderImgLink03 }
								onChange={ (e) => this.onChangeImgLink(23, e) }
								size="large"
								className="margin-t-10"
							/>
							<Input 
								placeholder="https://"
								prefix={<Icon type="link" />}
								value={ (this.state.sliderImgLink04).includes(this.props.imgLinkInternalPrefix) ? '' : this.state.sliderImgLink04 }
								onChange={ (e) => this.onChangeImgLink(24, e) }
								size="large"
								className="margin-t-10"
							/>
							<Input 
								placeholder="https://"
								prefix={<Icon type="link" />}
								value={ (this.state.sliderImgLink05).includes(this.props.imgLinkInternalPrefix) ? '' : this.state.sliderImgLink05 }
								onChange={ (e) => this.onChangeImgLink(25, e) }
								size="large"
								className="margin-t-10"
							/>
						</Modal>
						
					</div>
				</div>
      </div>
    );
  }

  	componentDidMount(){

		// init data
		if(this.props.action === 'edit'){

			let initDatas = this.props.initDatas;

			if(initDatas !== null){
				this.setState({
					titleImgLink : initDatas.titleImgLink,
					sliderImgLink01 : initDatas.sliderImgLink01,
					sliderImgLink02 : initDatas.sliderImgLink02,
					sliderImgLink03 : initDatas.sliderImgLink03,
					sliderImgLink04 : initDatas.sliderImgLink04,
					sliderImgLink05 : initDatas.sliderImgLink05,
					titleImgLink_Cache : initDatas.titleImgLink,
					sliderImgLink01_Cache : initDatas.sliderImgLink01,
					sliderImgLink02_Cache : initDatas.sliderImgLink02,
					sliderImgLink03_Cache : initDatas.sliderImgLink03,
					sliderImgLink04_Cache : initDatas.sliderImgLink04,
					sliderImgLink05_Cache : initDatas.sliderImgLink05
				});
			}

		}

	}

}