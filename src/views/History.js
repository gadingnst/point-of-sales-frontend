import React, { Component } from 'react'
import { Result, Tabs } from 'antd'
import { connect } from 'react-redux'
import IconText from '../components/base/IconText'
import Statistic from '../components/history/Statistic'
import ListHistory from '../components/history/List'

const { TabPane } = Tabs

const mapState = ({ auth }) => ({
    isLoggedIn: auth.loggedIn
})

class History extends Component {
    render() {
        if (!this.props.isLoggedIn) {
            return (
                <Result
                    status="403"
                    title="403"
                    subTitle="Sorry, you are not authorized to access this page."
                />
            )
        }
        return (
            <Tabs defaultActiveKey="statistic" style={{ background: '#FFF' }}>
                <TabPane style={{ padding: '25px' }} tab={<IconText type="line-chart" text="Statistic" />} key="statistic">
                    <Statistic />
                </TabPane>
                <TabPane tab={<IconText type="unordered-list" text="List History" />} key="list">
                    <ListHistory />
                </TabPane>
            </Tabs>
        )
    }
}

export default connect(mapState)(History)