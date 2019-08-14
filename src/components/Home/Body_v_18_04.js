import React, { Component } from 'react';

import OneTitleManyImages from '../blocks/OneTitleManyImages';
import EbayProducts from '../blocks/EbayProducts';

export default class Body_v_18_04 extends Component{

	constructor(props){
        super(props);
        this.setBodyDatas = this.setBodyDatas.bind(this);
	}

	state = {
		blocks : {
			'EPS_1' : null,
			'OTMI_1' : null,
			'EPS_2' : null,
			'EPS_3' : null
		}
	}

	setBodyDatas(id, jObj){
		let blocksInState = this.state.blocks;
		blocksInState[id] = jObj;
		this.setState({
			blocks : blocksInState
		});

		setTimeout(() => {
			// set the blocks date into Home.js
			this.props.setTemplateDatas(3, this.state.blocks);
		}, 0);
		
	}

	render(){

		let locInitDatas = this.props.initDatas;
		if(locInitDatas === undefined || locInitDatas === null){
			locInitDatas = this.state.blocks;
		}

		return (
			<div className="width100per">
						<div className="col-md-12">
							<div id="tab-container" className="tab-container">
								<div id="content1" className="active">
									
									{/* >>> OneTitleEachRow5Products */}
									<EbayProducts action={ this.props.action } initDatas={ (locInitDatas.EPS_1 === null) ? this.state.blocks.EPS_1 : locInitDatas.EPS_1 } idPrefix={'EPS_1'} typ={'//BESTSELLER'} setBodyDatas={this.setBodyDatas} nrInRow={5} hasTitle={true} colClassName={'col-md-1-5'}  imgLinkInternalPrefix={ this.props.imgLinkInternalPrefix } />
									
									{/* /blocks/OneTitleManyImages.js */}
									<OneTitleManyImages action={ this.props.action } initDatas={ (locInitDatas.OTMI_1 === null) ? this.state.blocks.OTMI_1 : locInitDatas.OTMI_1 } idPrefix={'OTMI_1'} setBodyDatas={this.setBodyDatas} imgLinkInternalPrefix={ this.props.imgLinkInternalPrefix } />
									
									{/* >>> OneTitleEachRow5Products */}
									<EbayProducts action={ this.props.action } initDatas={ (locInitDatas.EPS_2 === null) ? this.state.blocks.EPS_2 : locInitDatas.EPS_2 } idPrefix={'EPS_2'} typ={'//SIMILAR'} setBodyDatas={this.setBodyDatas} nrInRow={5} hasTitle={true} colClassName={'col-md-1-5'}  imgLinkInternalPrefix={ this.props.imgLinkInternalPrefix } />
									
									{/* >>> OneTitleEachRow5Products */}
									<EbayProducts action={ this.props.action } initDatas={ (locInitDatas.EPS_3 === null) ? this.state.blocks.EPS_3 : locInitDatas.EPS_3 } idPrefix={'EPS_3'} typ={'//SIMILAR'} setBodyDatas={this.setBodyDatas} nrInRow={5} hasTitle={true} colClassName={'col-md-1-5'}  imgLinkInternalPrefix={ this.props.imgLinkInternalPrefix } />
									
								</div>
								<div id="content2">
								
									<div className="row">
										<div className="col-md-12 margin-b-10">
											Fabrik Seite
										</div>
									</div>
									
								</div>
								<ul className="tabs">
									{/*
										<li className="active"><a href="#content1" target="_blank"><i className="fa fa-file-alt"></i> Produktbeschreibung</a></li>
										<li><a href="#content2" target="_blank"><i className="fa fa-industry"></i> Unsere Fabrik</a></li>
									*/}
									<li className="active" styles="background-color: #434343;" ><i className="fa fa-file-alt"></i> Produktbeschreibung</li>
									<li></li>
								</ul>
								<div className="tab-content-wrap"></div>
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
					blocks : initDatas
				});

				setTimeout(() => {
					//console.log(this.state.blocks.OTMI_1);
				}, 0);
        
			}

		}

	}
	
}
