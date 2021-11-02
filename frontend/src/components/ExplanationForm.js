import React, {Component} from 'react'
import {connect} from 'react-redux'

import {Layout, Table, Button, Tooltip, Tag, Alert, Spin} from 'antd'

import * as navActions from "../store/actions/nav"
import * as buildActions from "../store/actions/build"


const {Content} = Layout


class ExplanationForm extends Component {

    state = {
        dataSource: [],
        columns: [],
    }

    componentDidMount() {

        if (this.props.dataset.length === 0)
            this.props.explanationFail('Impossible compute explanations without dataset')
        else if (this.props.model.length === 0)
            this.props.explanationFail('Impossible compute explanations without model')
        else if (this.props.wrapper.length === 0)
            this.props.explanationFail('Impossible compute explanations without wrapper')
        else if (this.props.recordSelectedList.length === 0)
            this.props.explanationFail('Impossible compute explanations without record')
        else {
            console.log('Compute explanations')
            let dataset = this.props.dataset ? this.props.dataset[0].name : null
            let model = this.props.model ? this.props.model[0].name : null
            let wrapper = this.props.wrapper ? this.props.wrapper[0].name : null
            let idxList = this.props.recordSelectedList

            this.props.explanationRead(dataset, model, wrapper, idxList, this.props.leftPrefix, this.props.rightPrefix, this.props.label)
            this.forceUpdate()
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if ((this.props.explanationList.length > 0) && (this.props.explanationList !== prevProps.explanationList || this.state.dataSource.length === 0)) {
            console.log('Construct adversarial table interface')
            this.unpackExplanation(this.props.explanationList)
        }
    }

    clickButton = (record) => {
        console.log(record)
        this.props.openExplanationPopup(record)
    }


    getLabelType = (label, prediction) => {
        let th = 0.5
        if (label === 1 && prediction > th)
            return 'tp'
        else if (label === 1 && prediction <= th)
            return 'fn'
        else if (label === 0 && prediction > th)
            return 'fp'
        else if (label === 0 && prediction <= th)
            return 'tn'
        return 'error'
    }

    getColumns = (metricKeys) => {
        const columns = [
            {
                title: 'record_left'.toUpperCase(),
                dataIndex: 'record_left',
                ellipsis: {
                    showTitle: false,
                },
                render: record => (
                    <Tooltip placement="topLeft" title={record}>
                        {record}
                    </Tooltip>
                ),
            },
            {
                title: 'record_right'.toUpperCase(),
                dataIndex: 'record_right',
                ellipsis: {
                    showTitle: false,
                },
                render: record => (
                    <Tooltip placement="topLeft" title={record}>
                        {record}
                    </Tooltip>
                ),
            },
            {
                title: 'Prediction'.toUpperCase(),
                dataIndex: 'prediction',
                width: 120,
                sorter: (a, b) => a.prediction - b.prediction,
                sortDirections: ['descend', 'ascend'],
            },
            {
                title: 'Label'.toUpperCase(),
                dataIndex: 'label',
                width: 120,
                filters: [
                    {text: 'tp', value: 'tp'},
                    {text: 'tn', value: 'tn'},
                    {text: 'fp', value: 'fp'},
                    {text: 'fn', value: 'fn'},
                ],
                onFilter: (value, record) => record.label.indexOf(value) === 0,
                render: tag => {
                    let color = 'green'
                    if (tag === 'fp' || tag === 'fn') {
                        color = 'volcano'
                    }
                    return (
                        <Tag color={color} key={tag}>
                            {tag.toUpperCase()}
                        </Tag>
                    )
                },
            },
            {
                title: 'Landmark'.toUpperCase(),
                key: 'landmark',
                width: 120,
                render: (record) => {
                    return (
                        <Button
                            type="link"
                            onClick={() => this.clickButton(record)}
                        >
                            Explanation
                        </Button>
                    )
                }
            },
        ]

        for (let i = 0; i < metricKeys.length; i++) {
            columns.push({
                title: metricKeys[i].toUpperCase(),
                dataIndex: metricKeys[i],
                width: 120,
                sorter: (a, b) => a[metricKeys[i]] - b[metricKeys[i]],
                sortDirections: ['descend', 'ascend'],
            })
        }
        return columns
    }

    unpackExplanation = (dataList) => {
        let dataSource = []
        let metricsKeys = []

        for (let i = 0; i < dataList.length; i++) {
            // Select records
            let record = {
                key: i,
                record_left: dataList[i].record_left,
                record_right: dataList[i].record_right,
                record: dataList[i].record,
                prediction: Number(dataList[i].record.prediction).toFixed(4), // ToDO: check
                label: this.getLabelType(dataList[i].label, dataList[i].record.prediction),
                explanation: dataList[i].explanation,
            }

            metricsKeys = Object.entries(dataList[i].metrics).map(([key, value]) => {
                record[key] = Number(value).toFixed(4)
                return key
            })
            dataSource.push(record)
        }
        let columns = this.getColumns(metricsKeys)
        this.setState({dataSource, columns})

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
                {errorMessage}
                {loadingSpin}

                <Table
                    columns={this.state.columns}
                    dataSource={this.state.dataSource}
                    pagination={false}
                />

            </Content>
        )
    }
}

const mapStateToProps = state => {
    return {
        error: state.build.explanationError,
        loading: state.build.explanationLoading,

        dataset: state.build.dataset,
        model: state.build.model,
        wrapper: state.build.wrapper,
        leftPrefix: state.build.leftPrefix,
        rightPrefix: state.build.rightPrefix,
        label: state.build.label,

        recordSelectedList: state.build.recordSelectedList,
        explanationList: state.build.explanationList,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        openExplanationPopup: (scenario) => dispatch(navActions.openExplanationPopup(scenario)),
        explanationRead: (dataset, model, wrapper, idxList, leftPref, rightPref, label) => dispatch(buildActions.explanationRead(dataset, model, wrapper, idxList, leftPref, rightPref, label)),
        explanationFail: (error) => dispatch(buildActions.explanationFail(error)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ExplanationForm)