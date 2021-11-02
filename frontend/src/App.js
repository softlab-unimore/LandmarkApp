import React, {Component} from 'react'  
import {connect} from "react-redux"  

import './App.css'  
import "antd/dist/antd.css"  

import {Layout, PageHeader} from 'antd'  
import Sidepanel from './containers/Sidepanel'  
import Builder from './containers/Builder'  
import ExplanationPopup from "./components/ExplanationPopup"  
import AdversarialPopup from "./components/AdversarialPopup"  

const {Header, Footer} = Layout  

class App extends Component {
    render() {
        let title = ""  
        switch (this.props.item) {
            case 'explanation':
                title = 'Explanation'  
                break  
            case 'history':
                title = 'History'  
                break  
            default:
                title = 'LM'  
                break  
        }

        return (
            <Layout style={{minHeight: '100vh'}}>
                <Sidepanel/>

                <Layout>
                    <Header style={{background: '#fff', padding: 0}}>
                        <PageHeader
                            style={{
                                border: '1px solid rgb(235, 237, 240)',
                            }}
                            title="Landmark"
                            subTitle={title}
                        />
                    </Header>

                    {this.props.item === 'explanation' && <Builder/>}

                    <ExplanationPopup/>
                    <AdversarialPopup/>

                    <Footer style={{textAlign: 'center'}}>Softlab UniMoRe</Footer>
                </Layout>

            </Layout>
        )  
    }
}

const mapStateToProps = state => {
    return {
        item: state.items.item,
    }
}  


export default connect(mapStateToProps, null)(App)  


