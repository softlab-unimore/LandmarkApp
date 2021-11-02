import React from "react"
import {connect} from 'react-redux'

import {Modal, List, Row, Col, Divider, Tag, Alert, Spin} from "antd"
import * as navActions from "../store/actions/nav"
import * as buildActions from "../store/actions/build"

import AdversarialExample from "./AdversarialExample"


class AdversarialPopup extends React.Component {

    state = {
        dataSource: [],
        error: null,
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.showAdversarialPopup && !prevProps.showAdversarialPopup) {
            if (this.props.dataset.length === 0)
                this.props.adversarialFail('Impossible compute adversarial without dataset')

            else if (this.props.model.length === 0)
                this.props.adversarialFail('Impossible compute adversarial without model')

            else if (this.props.wrapper.length === 0)
                this.props.adversarialFail('Impossible compute adversarial without wrapper')

            else {
                let dataset = this.props.dataset ? this.props.dataset[0].name : null
                let model = this.props.model ? this.props.model[0].name : null
                let wrapper = this.props.wrapper ? this.props.wrapper[0].name : null
                let idxList = this.props.recordSelectedList

                this.props.adversarialRead(dataset, model, wrapper, idxList, this.props.leftPrefix, this.props.rightPrefix, this.props.label)
            }
        }
        if (this.props.adversarialList !== prevProps.adversarialList)
            this.getDataset(this.props.adversarialList)

    }

    getDataset = (adversarialList) => {
        let dataSource = adversarialList.filter((val) => {
            return (val.add.length > 0 && val.label === 1 && val.prediction >= 0.5)
        })

        this.setState({dataSource: dataSource, error: null})
    }

    render() {
        let errorMessage = null
        if (this.props.error) {
            errorMessage = (
                <Alert
                    message="Error"
                    description={this.props.error}
                    type="error"
                    showIcon
                    style={{
                        marginBottom: '24px'
                    }}
                />)
        }

        let loadingSpin = null
        if (this.props.loading)
            loadingSpin = (<Spin size="large"/>)


        return (
            <Modal
                title='Adversarial Record'
                centered={true}
                footer={null}
                visible={this.props.showAdversarialPopup}
                onCancel={this.props.closeAdversarialPopup}
                width={'80%'}
            >
                <div style={{marginTop: 15}}>
                    {errorMessage}
                    {loadingSpin}

                    <Row gutter={8} type="flex" align="middle">
                        <Col span={2} style={{textAlign: 'center'}}>
                            <Tag>RECORD</Tag>
                        </Col>
                        <Col span={10} style={{textAlign: 'center'}}>
                            <Tag color='green'>MATCH</Tag>
                        </Col>
                        <Col span={10} style={{textAlign: 'center'}}>
                            <Tag color='blue'>NO MATCH</Tag>
                        </Col>
                    </Row>

                    <Divider orientation="left"/>

                    <List
                        className="comment-list"
                        itemLayout="horizontal"
                        dataSource={this.state.dataSource}
                        renderItem={item => (
                            <li>
                                <AdversarialExample
                                    item={item}
                                />
                            </li>
                        )}
                    />
                </div>
            </Modal>
        )
    }
}

const mapStateToProps = state => {
    return {
        showAdversarialPopup: state.nav.showAdversarialPopup,
        adversarialList: state.build.adversarialList,

        error: state.build.adversarialError,
        loading: state.build.adversarialLoading,

        dataset: state.build.dataset,
        model: state.build.model,
        wrapper: state.build.wrapper,
        leftPrefix: state.build.leftPrefix,
        rightPrefix: state.build.rightPrefix,
        label: state.build.label,

        recordSelectedList: state.build.recordSelectedList,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        closeAdversarialPopup: () => dispatch(navActions.closeAdversarialPopup()),
        adversarialRead: (dataset, model, wrapper, idxList, leftPrefix, rightPrefix, label) => dispatch(buildActions.adversarialRead(dataset, model, wrapper, idxList, leftPrefix, rightPrefix, label)),
        adversarialFail: (error) => dispatch(buildActions.adversarialFail(error))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdversarialPopup)