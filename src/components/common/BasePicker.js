import React, { Component } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import PropTypes from 'prop-types'
import RNPickerSelect from 'react-native-picker-select'

export default class BasePicker extends Component {

    inputRefs = {}

    state = {
        focused: false,
        selected: false,
    }

    onChange(value) {
        if (typeof this.props.onChange === 'function') {
            this.props.onChange(value)
        }
    }

    render() {
        const { isFocused, selected } = this.state
        const { label, placeholder, dataSource, defaultValue, style } = this.props
        return (
            <View style={[styles.view, (isFocused) ? styles.focused : null]}>
                <Text style={[
                    styles.label,
                    (selected) ? styles.labelOn : null]}>{label}</Text>
                <View style={styles.inner}>
                    <RNPickerSelect
                        value={(defaultValue) || 'M'}
                        placeholder={{
                            label: placeholder,
                            value: '',
                        }}
                        items={dataSource}
                        onValueChange={
                            (item) => {
                                if (item) {
                                    this.onChange(item)
                                    this.setState({
                                        selected: item,
                                    })
                                }
                            }
                        }
                        style={{ ...pickerSelectStyles }}
                        ref={(el) => {
                            this.inputRefs.picker = el
                        }}
                    />
                </View>
            </View>
        )
    }
}

BasePicker.propTypes = {
    label: PropTypes.string.isRequired,
}

BasePicker.defaultProps = {
    placeholder: 'Select an item...',
    dataSource: [],
}

const styles = StyleSheet.create({
    view: {
        borderBottomColor: "transparent",
        borderBottomWidth: 1,
        alignSelf: 'stretch',
        marginVertical: 20,

        color: "black",
        paddingLeft: 20,
        borderColor: 'transparent', borderWidth: 1,
        backgroundColor: "#f5f8f9", fontSize: 20,
        paddingVertical: 10, fontWeight: "300"
    },
    inner: {
        flexDirection: 'row',
    },
    focused: {
        borderBottomColor: "#1f2536",
        borderBottomWidth: 1,
    },
    text: {
        paddingVertical: 20,
        flex: 4,
    },
    label: {
        color: "#1f2536",
        display: 'none',
        fontFamily: 'museo-sans-500',
        fontSize: 12,
    },
    labelOn: {
        display: 'flex',
    },
})

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontFamily: 'museo-sans-700',
        fontSize: 18,
        color: "#1f2536",
        paddingTop: 10,
        paddingHorizontal: 0,
        paddingBottom: 10,
        borderWidth: 0,
        backgroundColor: 'transparent',
    },
    viewContainer: {
        flex: 4,
    },
    icon: {
        borderTopColor: "#1f2536",
    },
})