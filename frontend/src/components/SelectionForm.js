import React, {Component} from 'react'
import {connect} from 'react-redux'

import {Alert, Button, Col, Input, Layout, Row, Spin, Table} from 'antd'

import * as buildActions from "../store/actions/build"

const {Content} = Layout


class SelectionForm extends Component {

    state = {
        columns: [],
        dataSource: [],
        selectedRowKeys: [],
    }

    componentDidMount() {
        if (this.props.dataset.length > 0) {
            console.log('Read records from the uploaded dataset')
            let name = this.props.dataset ? this.props.dataset[0].name : null
            this.props.recordRead(name)
        } else
            this.props.recordFail('Impossible read record without dataset')
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if ((this.props.recordList.length > 0) && (this.props.recordList !== prevProps.recordList || this.state.dataSource.length === 0)) {
            console.log('Construct dataset table interface')
            this.createTable(this.props.recordList)
        }
    }

    createTable = (dataList) => {
        let columns = []

        let dataSource = dataList.map((val, key) => {
            val['key'] = key
            return val
        })

        if (dataSource.length > 0) {
            columns = Object.keys(dataSource[0]).map(val => {
                return {title: val.toUpperCase(), dataIndex: val}
            })
        }

        let i
        for (i = 0; i < columns.length; ++i) {
            if (columns[i].dataIndex === 'key')
                break
        }
        if (i < columns.length)
            columns.splice(i, 1)

        this.setState({dataSource, columns})
    }

    onSearch = value => {
        console.log(value)
    }

    onSelectChange = (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
        this.props.recordSelectRecords(selectedRowKeys)
    }

    render() {
        const {recordSelectedList} = this.props
        const rowSelection = {
            recordSelectedList,
            onChange: this.onSelectChange,
            selections: [
                Table.SELECTION_ALL,
                Table.SELECTION_INVERT,
                Table.SELECTION_NONE,
            ],
        }

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

                <Row gutter={8} type="flex" align="middle">
                    <Col span={12}>
                        <Input.Search
                            placeholder="input search text"
                            allowClear
                            enterButton
                            size="large"
                            onSearch={this.onSearch}
                        />
                    </Col>
                    <Col span={2}>
                        <Button type="primary" shape="round" size='large'>
                            Clear filter
                        </Button>
                    </Col>
                </Row>

                <Table
                    rowSelection={rowSelection}
                    columns={this.state.columns}
                    dataSource={this.state.dataSource}
                    pagination={{position: ['topRight']}}
                    scroll={{x: 1300}}
                />

            </Content>
        )
    }
}

const mapStateToProps = state => {
    return {
        error: state.build.recordError,
        loading: state.build.recordLoading,

        dataset: state.build.dataset,

        recordList: state.build.recordList,
        recordSelectedList: state.build.recordSelectedList,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        recordRead: (name) => dispatch(buildActions.recordRead(name)),
        recordFail: (error) => dispatch(buildActions.recordFail(error)),
        recordSelectRecords: (recordSelectedList) => dispatch(buildActions.recordSelectRecords(recordSelectedList))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectionForm) 