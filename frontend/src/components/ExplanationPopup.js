import React from "react"
import {connect} from 'react-redux'

import {Col, Modal, Row, Statistic, Table, Tabs} from "antd"

import * as navActions from "../store/actions/nav"
import Plot from "react-plotly.js"

class ExplanationPopup extends React.Component {

    render() {

        // Plot All params
        let leftList = []
        let rightList = []
        let ticktext = []
        let tickvals = []

        // Plot Single params
        let leftViewList = []
        let rightViewList = []
        let leftTicktext = []
        let leftTickvals = []
        let rightTicktext = []
        let rightTickvals = []

        let colorsLeft = []
        let colorsRight = []

        // Table params
        let columns = []
        let dataSource = []

        let sideColumns = []

        const red = '#e53935'
        const green = '#43a047' // '#76d275'
        const topK = 10

        if (this.props.scenario) {
            let explanation = this.props.scenario.explanation
            // Create value and index array for all plot
            for (let i = 0; i < explanation.length; i++) {
                tickvals.push(i)
                ticktext.push(explanation[i]['word'])
                leftList.push(explanation[i]['score_left_landmark'])
                rightList.push(explanation[i]['score_right_landmark'])
            }

            // Create value and index for left single plot
            let leftCopy = [...explanation]
            leftCopy.sort((a, b) => (Math.abs(a.score_left_landmark) > Math.abs(b.score_left_landmark)) ? -1 : 1)
            for (let i = 0; i < leftCopy.length && i < topK; i++) {
                if (leftCopy[i]['score_left_landmark'] === 0)
                    continue

                // ToDo: insert col prefix
                leftTicktext.push(leftCopy[i]['word'])
                leftTickvals.push(leftCopy[i]['column'] + '_' + leftCopy[i]['word'])
                leftViewList.push(leftCopy[i]['score_left_landmark'])

                if (leftCopy[i]['column'].startsWith('left'))
                    colorsLeft.push(green)
                else
                    colorsLeft.push(red)
            }

            // Create value and index for right single plot
            let rightCopy = [...explanation]
            rightCopy.sort((a, b) => (Math.abs(a.score_right_landmark) > Math.abs(b.score_right_landmark)) ? -1 : 1)
            for (let i = 0; i < rightCopy.length && i < topK; i++) {
                if (rightCopy[i]['score_right_landmark'] === 0)
                    continue

                // ToDo: insert col prefix
                rightTicktext.push(rightCopy[i]['word'])
                rightTickvals.push(rightCopy[i]['column'] + '_' + rightCopy[i]['word'])
                rightViewList.push(rightCopy[i]['score_right_landmark'])

                if (rightCopy[i]['column'].startsWith('right'))
                    colorsRight.push(green)
                else
                    colorsRight.push(red)
            }

            // this.props.scenario.record['entropy'] = 2.1849
            console.log('record', this.props.scenario.record)
            console.log('scenario', this.props.scenario)

            // Create columns array
            columns = Object.keys(this.props.scenario.record).map(val => {
                return {title: val.toUpperCase(), dataIndex: val, ellipsis: true}
            })

            console.log('columns', columns)
            // Remove key columns
            let i
            for (i = 0; i < columns.length; ++i) {
                if (columns[i].dataIndex === 'key')
                    break
            }
            if (i < columns.length)
                columns.splice(i, 1)

            // Move prediction column
            for (i = 0; i < columns.length; ++i) {
                if (columns[i].dataIndex === 'prediction')
                    break
            }
            if (i < columns.length)
                columns.push(columns.splice(i, 1)[0])

            // Move label column
            for (i = 0; i < columns.length; ++i) {
                if (columns[i].dataIndex === 'label')
                    break
            }
            if (i < columns.length)
                columns.push(columns.splice(i, 1)[0])


            dataSource.push(this.props.scenario.record)
            dataSource[0]['key'] = 0

            let leftPrefix = 'left_'
            let rightPrefix = 'right_'
            let lPrefixLen = leftPrefix.length
            let rPrefixLen = rightPrefix.length
            let rValue = {'side': 'right'}
            let lValue = {'side': 'left'}
            let otherData = {}

            for (const [col, value] of Object.entries(this.props.scenario.record)) {
                if (col.startsWith(leftPrefix)) {
                    lValue[col.slice(lPrefixLen)] = value
                } else if (col.startsWith(rightPrefix)) {
                    rValue[col.slice(rPrefixLen)] = value
                } else {
                    otherData[col] = value
                }
            }
            dataSource = []
            dataSource.push(lValue)
            dataSource.push(rValue)
            sideColumns = Object.keys(lValue).map(val => {
                return {title: val.toUpperCase(), dataIndex: val, ellipsis: true}
            })
            columns = sideColumns
            dataSource[0]['key'] = 0
            dataSource[1]['key'] = 1
            console.log(dataSource)
            console.log(columns)
        }

        return (
            <Modal
                centered={true}
                footer={null}
                title={'Landmark Explanation'}
                visible={this.props.showExplanationPopup}
                onCancel={this.props.closeExplanationPopup}
                width={'90%'}
            >

                <div style={{marginTop: 15}}>
                    {
                        this.props.scenario &&
                        <div>
                            <Table
                                size='small'
                                columns={columns}
                                dataSource={dataSource}
                                pagination={false}

                            />

                            <div style={{marginTop: 15}}>
                                <Row gutter={16} justify="space-around">
                                    <Col span={4}>
                                        <Statistic
                                            title="Label"
                                            value={this.props.scenario.record.label}
                                            precision={0}
                                            // valueStyle={{color: '#43a047'}}
                                        />
                                    </Col>
                                    <Col span={4}>
                                        <Statistic
                                            title="Prediction"
                                            value={this.props.scenario.prediction}
                                            precision={3}
                                            // valueStyle={{color: '#43a047'}}
                                        />
                                    </Col>
                                    <Col span={4}>
                                        <Statistic
                                            title="Entropy"
                                            value={this.props.scenario.entropy}
                                            precision={3}
                                            // valueStyle={{color: '#43a047'}}
                                        />
                                    </Col>


                                </Row>
                            </div>

                            <div style={{textAlign: 'center'}}>
                                <Tabs defaultActiveKey="1">
                                    <Tabs.TabPane tab="All" key="1">
                                        <Plot
                                            data={[
                                                {
                                                    y: leftList,
                                                    type: 'bar',
                                                    opacity: 0.6,
                                                    name: 'Left Landmark',
                                                },
                                                {
                                                    y: rightList,
                                                    type: 'bar',
                                                    opacity: 0.6,
                                                    name: 'Right Landmark',
                                                },
                                            ]}

                                            layout={{
                                                autosize: true,
                                                margin: {t: 24},
                                                xaxis: {
                                                    title: 'Words',
                                                    ticktext: ticktext,
                                                    tickvals: tickvals,
                                                    tickangle: 45,
                                                },
                                                yaxis: {title: 'Impact'},
                                            }}
                                            useResizeHandler={true}
                                            style={{width: "90%", height: "100%", paddingLeft: "5%"}}
                                        />
                                    </Tabs.TabPane>
                                    <Tabs.TabPane tab={`Top ${topK}`} key="2">
                                        <Plot
                                            data={[
                                                {
                                                    x: leftViewList,
                                                    y: leftTicktext,
                                                    text: leftTickvals,
                                                    type: 'bar',
                                                    orientation: 'h',
                                                    name: '',
                                                    xaxis: 'x2',
                                                    yaxis: 'y2',
                                                    opacity: 0.6,
                                                    marker: {'color': colorsLeft}
                                                },
                                                {
                                                    x: rightViewList,
                                                    y: rightTicktext,
                                                    text: rightTickvals,
                                                    type: 'bar',
                                                    orientation: 'h',
                                                    name: '',
                                                    opacity: 0.6,
                                                    marker: {'color': colorsRight}
                                                }
                                            ]}

                                            layout={{
                                                autosize: true,
                                                showlegend: false,
                                                grid: {rows: 1, columns: 2, pattern: 'independent'},
                                                yaxis: {
                                                    type: 'category',
                                                    autorange: "reversed",
                                                },
                                                yaxis2: {
                                                    type: 'category',
                                                    autorange: "reversed",
                                                    side: 'right',
                                                },
                                                xaxis: {
                                                    title: 'Right Landmark',
                                                    side: 'top',
                                                },
                                                xaxis2: {
                                                    title: 'Left Landmark',
                                                    side: 'top',
                                                },
                                                annotations: [
                                                    {
                                                        xref: 'paper',
                                                        yref: 'paper',
                                                        x: 0.9,
                                                        xanchor: 'left',
                                                        y: 1.2,
                                                        yanchor: 'bottom',
                                                        text: 'Injected token',
                                                        showarrow: false,
                                                        font: {color: green},
                                                    },
                                                    {
                                                        xref: 'paper',
                                                        yref: 'paper',
                                                        x: 0.9,
                                                        xanchor: 'left',
                                                        y: 1.2,
                                                        yanchor: 'top',
                                                        text: 'Original token',
                                                        showarrow: false,
                                                        font: {color: red},
                                                    }]
                                            }}
                                            useResizeHandler={true}
                                            style={{width: "90%", height: "100%", paddingLeft: "5%"}}
                                        />
                                    </Tabs.TabPane>
                                </Tabs>
                            </div>
                        </div>
                    }
                </div>
            </Modal>
        )
    }

}

const mapStateToProps = state => {
    return {
        showExplanationPopup: state.nav.showExplanationPopup,
        scenario: state.nav.scenario,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        closeExplanationPopup: () => dispatch(navActions.closeExplanationPopup()),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(ExplanationPopup)