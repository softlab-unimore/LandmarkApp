import React from 'react'
import {Row, Col, Statistic, Divider} from "antd"


const AdversarialExample = (props) => {
    let originalRecord
    let newRecordList = []

    const boxStyle = {padding: '8px'}
    const strikeStyle = {
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid',
        textDecorationColor: 'red'
    }

    if (props.item) {
        originalRecord = props.item.content
        let wordList = originalRecord.split(' ')

        for (let i = 0; i < props.item.add.length && i < 3; i++) {
            let singleNewRecord = wordList.map((val, key) => {

                if (props.item.add[i].position === key)
                    return (<span key={key} style={strikeStyle}>{val} </span>)
                else
                    return (<span key={key}>{val} </span>)
            })

            newRecordList.push((
                <Row key={i} gutter={{xs: 8, sm: 16, md: 24, lg: 32}}>
                    <Col className="gutter-row" span={20}>
                        {singleNewRecord}
                    </Col>
                    <Col className="gutter-row" span={4}>
                        <Statistic
                            key={i}
                            title="score"
                            value={props.item.add[i].prediction}
                            precision={3}
                            valueStyle={{color: '#e53935'}}
                        />
                    </Col>
                </Row>
            ))
        }
    }

    return (
        <div style={{marginTop: '32px'}}>
            <Row gutter={{xs: 8, sm: 16, md: 24, lg: 32}}>
                <Col className="gutter-row" span={2}>
                    <Statistic
                        value={132}
                    />
                </Col>
                <Col className="gutter-row" span={8}>
                    <div style={boxStyle}>{originalRecord}</div>
                </Col>
                <Col className="gutter-row" span={2}>
                    <Statistic
                        title="score"
                        value={props.item.prediction}
                        precision={3}
                        valueStyle={{color: '#43a047'}}
                    />
                </Col>

                <Col className="gutter-row" span={10}>
                    {newRecordList}
                </Col>
            </Row>

            <Divider orientation="left"/>
        </div>
    )
}

export default AdversarialExample