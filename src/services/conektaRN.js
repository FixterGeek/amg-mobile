import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Constants } from 'expo';
import { WebView } from 'react-native';
import Base64 from './Base64';
import { CONEKTA_KEY } from './url'

class Conekta extends Component {
    deviceId = Constants.deviceId.replace(/-/g, '');

    tokenizeCard = card =>
        new Promise(async (resolve, reject) => {
            try {
                const tokenRes = await fetch('https://api.conekta.io/tokens', {
                    method: 'POST',
                    body: JSON.stringify({ card }),
                    headers: {
                        Accept: 'application/vnd.conekta-v0.3.0+json',
                        'Content-Type': 'application/json',
                        // Authorization: `Basic ${window.btoa(`${CONEKTA_KEY}:`)}`,
                        Authorization: `Basic ${Base64.btoa(`${CONEKTA_KEY}:`)}`,
                        'Accept-Language': 'en', // TODO: Change this to get language from translation
                        'Conekta-Client-User-Agent': JSON.stringify({
                            agent: 'Conekta iOS SDK',
                        }),
                    },
                });
                const token = await tokenRes.json();
                resolve(token);
            } catch (error) {
                reject(error);
            }
        });

    render() {
        const html = `
      <html style="background: blue;">
        <head></head>
        <body>
          <script type="text/javascript" src="https://conektaapi.s3.amazonaws.com/v0.5.0/js/conekta.js" data-conekta-public-key="${CONEKTA_KEY}" data-conekta-session-id="${
            this.deviceId
            }"></script>
        </body>
      </html>
    `;
        const { children } = this.props;
        children({ tokenizeCard: this.tokenizeCard });
        return (
            <WebView
                source={{ html, baseUrl: 'web/' }}
                style={{ height: 0, width: 0 }}
                mixedContentMode="always"
            />
        );
    }
}

Conekta.propTypes = { children: PropTypes.func.isRequired };

export default Conekta;