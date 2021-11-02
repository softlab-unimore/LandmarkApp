import React, {Component} from 'react'
import {connect} from 'react-redux'  

import {Layout, Row, Col, Steps, Button, Divider} from 'antd'  
import {LeftOutlined, RightOutlined} from '@ant-design/icons'  

import UploadForm from "../components/UploadForm"  
import SelectionForm from "../components/SelectionForm"  
import ExplanationForm from "../components/ExplanationForm"  

import * as navActions from "../store/actions/nav"


const {Content} = Layout  
const {Step} = Steps  

const MAX_STEP = 3  
const steps = [
    {
        title: 'Upload',
        content: 'Model & Dataset',
    },
    {
        title: 'Selection',
        content: 'Select Records',
    },
    {
        title: 'Landmark',
        content: 'Show Explanation',
    },
]  


class Builder extends Component {

    onChange = current => {
        // Go in selected step state
        this.props.setStep(current)  
    }  

    next() {
        // Go in next step
        if (this.props.currentStep < MAX_STEP) {
            const current = this.props.currentStep + 1  
            this.props.setStep(current)  
        }
    }

    prev() {
        // Go in prev step
        if (this.props.currentStep > 0) {
            const current = this.props.currentStep - 1  
            this.props.setStep(current)  
        }
    }

    render() {
        return (
            <Content style={{margin: '24px 16px 0'}}>
                <div style={{padding: 24, background: '#fff', minHeight: 360}}>
                    <Steps
                        current={this.props.currentStep}
                        onChange={this.onChange}
                        status='process'
                    >
                        {steps.map(item => (
                            <Step key={item.title} title={item.title} description={item.content}/>
                        ))}
                    </Steps>

                    <Divider/>

                    <Col span={4} offset={16} style={{textAlign: 'right'}}>
                        {
                            this.props.currentStep === steps.length - 1 &&
                            <Button type="primary" onClick={() => this.props.openAdversarialPopup()}>
                                Adversarial examples?
                            </Button>
                        }
                    </Col>


                    <div
                        style={{
                            margin: '16px',
                            minHeight: '270px',
                        }}
                    >
                        {
                            this.props.currentStep === 0 &&
                            <UploadForm/>
                        }
                        {
                            this.props.currentStep === 1 &&
                            <SelectionForm/>
                        }
                        {
                            this.props.currentStep === 2 &&
                            <ExplanationForm/>
                        }

                    </div>

                    <div style={{marginTop: '24px'}}>
                        <Row type="flex" justify="space-between" align="middle">
                            <Col span={4} style={{textAlign: 'left'}}>
                                {this.props.currentStep > 0 &&
                                (
                                    <Button type="normal" shape="circle" size="large" icon={<LeftOutlined/>}
                                            onClick={() => this.prev()}/>
                                )}
                            </Col>
                            <Col span={4} offset={16} style={{textAlign: 'right'}}>
                                {
                                    this.props.currentStep < steps.length - 1 &&
                                    (
                                        <Button type="primary" shape="circle" size="large" icon={<RightOutlined/>}
                                                onClick={() => this.next()}/>
                                    )
                                }
                            </Col>
                        </Row>
                    </div>
                </div>

            </Content>
        )  
    }
}

const mapStateToProps = state => {
    return {
        currentStep: state.nav.currentStep,
    }
}  

const mapDispatchToProps = dispatch => {
    return {
        setStep: (step) => dispatch(navActions.setStep(step)),
        openAdversarialPopup: () => dispatch(navActions.openAdversarialPopup()),
    }
}  

export default connect(mapStateToProps, mapDispatchToProps)(Builder)  