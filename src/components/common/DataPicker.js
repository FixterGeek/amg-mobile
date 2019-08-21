import React, { Component } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import PropTypes from 'prop-types'
import Theme from '../../utils/Theme'
import DatePicker from 'react-native-datepicker'
import moment from 'moment'
import Config from '../../utils/config'

export default class DataPicker extends Component {

    state = {
        focused: false,
        selected: false,
        date: '',
    }

    componentWillMount() {
        if (this.props.date) {
            this.setState({
                date: moment(this.props.date).format('YYYY-MM-DD'),
            })
        }
    }

    onChange(value) {
        if (typeof this.props.onChange === 'function') {
            this.props.onChange(value)
        }
        this.setState({
            date: value,
            selected: true,
        })
    }

    render() {
        const { isFocused, selected } = this.state
        const { label } = this.props
        return (
            <View style={[styles.view, (isFocused) ? styles.focused : null]}>
                <Text style={[
                    styles.label,
                    (selected) ? styles.labelOn : null]}>{label}</Text>
                <View style={styles.inner}>
                    <DatePicker
                        showIcon={false}
                        style={{ width: 200 }}
                        date={this.state.date}
                        mode="date"
                        androidMode="spinner"
                        placeholder="Select your birthday"
                        format="YYYY-MM-DD"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        customStyles={pickerStyles}
                        onDateChange={(date) => { this.onChange(date) }}
                    />
                </View>
            </View>
        )
    }
}

DataPicker.propTypes = {
    label: PropTypes.string.isRequired,
}

DataPicker.defaultProps = {
    dataSource: [],
    placeholder: 'Select an item...',
}

const styles = StyleSheet.create({
    view: {
        borderBottomColor: Theme.baseColors.line,
        borderBottomWidth: 1,
        alignSelf: 'stretch',
        marginVertical: 20,
    },
    inner: {
        flexDirection: 'row',
    },
    focused: {
        borderBottomColor: Theme.baseColors.main,
        borderBottomWidth: 1,
    },
    text: {
        paddingVertical: Theme.basePadding.text,
        flex: 4,
    },
    label: {
        color: Theme.baseColors.text.label,
        display: 'none',
        fontFamily: 'museo-sans-500',
        fontSize: 12,
    },
    labelOn: {
        display: 'flex',
    },
})

const pickerStyles = {
    dateTouch: {
        alignSelf: 'stretch',
        flex: 4,
    },
    dateIcon: {
        width: 0,
    },
    dateInput: {
        borderWidth: 0,
        marginLeft: 0,
        paddingLeft: 0,
        alignItems: 'flex-start',
    },
    placeholderText: {
        color: Theme.baseColors.text.label,
        paddingLeft: 0,
        marginLeft: 0,
        fontFamily: 'museo-sans-700',
        fontSize: Theme.baseFontSizes.button,
        textAlign: 'left',
    },
    dateText: {
        color: Theme.baseColors.text.input,
        fontFamily: 'museo-sans-700',
        fontSize: Theme.baseFontSizes.button,
        alignSelf: 'stretch',
        textAlign: 'left',
    },
}