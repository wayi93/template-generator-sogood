import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

class Header extends Component {

    constructor(props){
        super(props);
        this.test = this.test.bind(this);
    }

    test(){
        console.log('Header');
    }

    render() {

        let page = this.props.page;

        let naviUl = null;
        
        switch(page){
            case 'Layouts':
                naviUl = <ul id="main-navi" className="width100per">
                        <li><NavLink to="/layouts">Select a Layout</NavLink></li>
                        <li><NavLink to="/templates">Templates List</NavLink></li>
                        <li id="liLogo" className="fRight"><img src="https://etg.idealhit.com/images/logo_190x80.png" alt="logo" height="80" /></li>
                    </ul>;
                break;
            case 'Home':
                naviUl = <ul id="main-navi" className="width100per">
                        <li><NavLink to="/layouts">Change Layout</NavLink></li>
                        <li><NavLink to="#" className="active">Create a Template</NavLink></li>    
                        <li><NavLink to="/templates">Templates List</NavLink></li>
                        <li id="liLogo" className="fRight"><img src="https://etg.idealhit.com/images/logo_190x80.png" alt="logo" height="80" /></li>
                    </ul>;
                break;
            case 'TemplateEdit':
                naviUl = <ul id="main-navi" className="width100per">
                            <li><NavLink to="/layouts">Create a Template</NavLink></li>
                            <li><NavLink to="#" className="active">Edit Template</NavLink></li>
                            <li><NavLink to="/templates">Templates List</NavLink></li>
                            <li id="liLogo" className="fRight"><img src="https://etg.idealhit.com/images/logo_190x80.png" alt="logo" height="80" /></li>
                        </ul>;
                break;
            case 'HtmlCode':
                naviUl = <ul id="main-navi" className="width100per">
                            <li><NavLink to="/layouts">Create a Template</NavLink></li>
                            <li><NavLink to="#" className="active">HTML Codes</NavLink></li>
                            <li><NavLink to="/templates">Templates List</NavLink></li>
                            <li id="liLogo" className="fRight"><img src="https://etg.idealhit.com/images/logo_190x80.png" alt="logo" height="80" /></li>
                        </ul>;
                break;
            default:
                naviUl = <ul id="main-navi" className="width100per">
                            <li><NavLink to="/layouts">Create a Template</NavLink></li>
                            <li><NavLink to="/templates">Templates List</NavLink></li>
                            <li id="liLogo" className="fRight"><img src="https://etg.idealhit.com/images/logo_190x80.png" alt="logo" height="80" /></li>
                        </ul>;
        }

        return (
            <header className="header-obj width100per">
                <div className="container bg-touming">
                    <nav>
                        { naviUl }
                    </nav>
                </div>
            </header>
        )

    }

}

export default Header;