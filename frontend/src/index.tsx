import {store} from 'store';
import {createRoot} from 'react-dom/client';
import * as serviceWorkerRegistration from 'pwa/serviceWorkerRegistration';
import App from 'App';
import {ThemeProvider} from 'styled-components';
import {theme} from 'AppTheme';
import {Provider} from 'react-redux';
import GlobalStyle from 'components/style/GlobalStyle';
import AntdConfig from 'components/style/AntdConfig';

const root = createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    // <StrictMode>
    <ThemeProvider theme={theme}>
        <AntdConfig>
            <Provider store={store}>
                <GlobalStyle />
                <App />
            </Provider>
        </AntdConfig>
    </ThemeProvider>
    // </StrictMode>
);
serviceWorkerRegistration.unregister();
