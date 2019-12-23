import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native'
import Modal from 'react-native-modal'

let clock = require('../../../assets/clock.png')

export default function GastroModal({
    clockImage,
    isVisible,
    title,
    text,
    onAccept,
    onCancel,
    cancelButtonText,
    acceptButtonText,
    noButtons,
    onlyOne
}) {
    return (
        <Modal isVisible={isVisible}>
            <View style={styles.modal}>
                <Text style={styles.modalTitle}>{title}</Text>
                {clockImage && <Image source={clock} />}
                <Text style={styles.modalSubTitle}>{text}</Text>
                {!noButtons && <View style={[styles.modalButtons]}>
                    {!onlyOne && <TouchableOpacity
                        onPress={onCancel}
                        style={styles.modalButtonCancel} >
                        <Text style={styles.textCancel}>{cancelButtonText}</Text>
                    </TouchableOpacity>}
                    <TouchableOpacity
                        onPress={onAccept}
                        style={styles.modalButton} >
                        <Text style={styles.buttonText}>{acceptButtonText}</Text>
                    </TouchableOpacity>
                </View>}
            </View>
        </Modal>
    )
}

GastroModal.defaultProps = {
    onlyOne: false,
    acceptButtonText: "Aceptar",
    cancelButtonText: "Cancelar",
    isVisible: false,
    title: "GASTRO",
    text: "¿Estas segur@ de realizar esta acción?",
    onAccept: () => { },
    onCancel: () => { },
}

let styles = StyleSheet.create({
    modal: {
        backgroundColor: "white",
        paddingVertical: 20,
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderRadius: 12,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        minHeight: 100
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20
    },
    modalSubTitle: {
        textAlign: "center",
        fontSize: 18,
        maxWidth: 200
    },
    modalButtons: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
        flexDirection: 'row'
    },
    modalButton: {
        marginHorizontal: 5,
        backgroundColor: "#5dbcd2",
        borderWidth: 0,
        paddingHorizontal: 15,
        paddingVertical: 15,
        minWidth: 120,
        textAlign: "center"
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    textCancel: {
        color: "#5dbcd2",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalButtonCancel: {
        marginHorizontal: 5,
        paddingHorizontal: 15,
        paddingVertical: 15,
        backgroundColor: "white",
        borderColor: "#5dbcd2",
        borderWidth: 2,
        minWidth: 120,

    },
})