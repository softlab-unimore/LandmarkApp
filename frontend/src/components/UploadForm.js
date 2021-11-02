import React, {Component} from 'react'
import {connect} from 'react-redux'

import {Layout, Row, Col, Upload, Button, Input, Alert, Spin} from 'antd'
import {UploadOutlined} from '@ant-design/icons'
import * as buildActions from "../store/actions/build"

const {Content} = Layout


class UploadForm extends Component {

    beforeUpload = (file, type) => {
        console.log('Upload ', type, ' file  ', file.name)
        this.props.fileUpload(file, type)
        return false
    }


    onRemove = (file, type) => {
        console.log('Remove ', type, ' file  ', file.name)
        if (type === 'model')
            this.props.modelRemoveUpload()
        else if (type === 'wrapper')
            this.props.wrapperRemoveUpload()
        else if (type === 'dataset')
            this.props.datasetRemoveUpload()


        return false
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
            <Content style={{margin: '24px 16px 0'}}>
                <div style={{padding: 24, background: '#fff', minHeight: 360}}>

                    {errorMessage}
                    {loadingSpin}

                    <Row type="flex" justify="center" align="top" gutter={[32, 16]}>
                        <Col span={10}>
                            <div>
                                <Upload
                                    listType='picture'
                                    beforeUpload={(file) => this.beforeUpload(file, 'model')}
                                    onRemove={(file) => this.onRemove(file, 'model')}
                                    fileList={this.props.model}
                                >
                                    <Button icon={<UploadOutlined/>}>Upload Model</Button>
                                </Upload>
                            </div>


                            <div style={{marginTop: '36px'}}>
                                <Upload
                                    listType='picture'
                                    beforeUpload={(file) => this.beforeUpload(file, 'wrapper')}
                                    onRemove={(file) => this.onRemove(file, 'wrapper')}
                                    fileList={this.props.wrapper}
                                >
                                    <Button icon={<UploadOutlined/>}>Upload Wrapper</Button>
                                </Upload>
                            </div>
                        </Col>

                        <Col span={10}>
                            <Upload
                                listType='picture'
                                beforeUpload={(file) => this.beforeUpload(file, 'dataset')}
                                onRemove={(file) => this.onRemove(file, 'dataset')}
                                fileList={this.props.dataset}
                            >
                                <Button icon={<UploadOutlined/>}>Upload Dataset</Button>
                            </Upload>
                        </Col>
                    </Row>

                    <Row style={{marginTop: '48px'}} type="flex" justify="center" align="top" gutter={[32, 16]}>
                        <Col span={10}>
                            <div>
                                <p>Left prefix</p>
                                <Input
                                    placeholder="Left prefix"
                                    size="large"
                                    value={this.props.leftPrefix}
                                    onChange={(e) => this.props.paramsSetLeftPrefix(e.target.value)}
                                    allowClear
                                />
                            </div>

                            <div style={{marginTop: '24px'}}>
                                <p>Right prefix</p>
                                <Input
                                    placeholder="Right prefix"
                                    size="large"
                                    value={this.props.rightPrefix}
                                    onChange={(e) => this.props.paramsSetRightPrefix(e.target.value)}
                                    allowClear
                                />
                            </div>
                        </Col>

                        <Col span={10}>
                            <p>Label column</p>
                            <Input
                                placeholder="Label Col"
                                size="large"
                                value={this.props.label}
                                onChange={(e) => this.props.paramsSetLabel(e.target.value)}
                                allowClear
                            />
                        </Col>
                    </Row>

                </div>

            </Content>
        )
    }
}

const mapStateToProps = state => {
    return {
        error: state.build.uploadError,
        loading: state.build.uploadLoading,

        dataset: state.build.dataset,
        leftPrefix: state.build.leftPrefix,
        rightPrefix: state.build.rightPrefix,
        label: state.build.label,
        model: state.build.model,
        wrapper: state.build.wrapper
    }
}

const mapDispatchToProps = dispatch => {
    return {
        paramsSetLeftPrefix: (leftPrefix) => dispatch(buildActions.paramsSetLeftPrefix(leftPrefix)),
        paramsSetRightPrefix: (rightPrefix) => dispatch(buildActions.paramsSetRightPrefix(rightPrefix)),
        paramsSetLabel: (label) => dispatch(buildActions.paramsSetLabel(label)),
        fileUpload: (file, type) => dispatch(buildActions.fileUpload(file, type)),
        datasetRemoveUpload: () => dispatch(buildActions.datasetRemoveUpload()),
        modelRemoveUpload: () => dispatch(buildActions.modelRemoveUpload()),
        wrapperRemoveUpload: () => dispatch(buildActions.wrapperRemoveUpload()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadForm)