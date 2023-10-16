import {ConfigProvider} from 'antd';
import {FC, ReactNode} from 'react';
import {useTheme} from 'styled-components';
import {AppTheme} from 'AppTheme';

interface AntdConfigProps {
    children: ReactNode;
}

const AntdConfig: FC<AntdConfigProps> = ({children}) => {
    const theme = useTheme() as AppTheme;
    return (
        <ConfigProvider theme={{
            token: {
                colorBgBase: theme.color.bg,
                colorText: theme.color.text,
                colorBorder: theme.color.text,
                colorPrimaryHover: theme.color.hover,
                colorPrimaryActive: theme.color.text,
                colorPrimaryBorder: theme.color.text,
                colorIcon: theme.color.text,
                colorTextDisabled: theme.color.textDisabled
            },
            components: {
                Input: {
                    activeBorderColor: theme.color.hover
                },
                Select: {
                    colorBorder: theme.color.text,
                    optionActiveBg: theme.color.bgElevated,
                    optionSelectedBg: theme.color.bgElevated,
                    optionSelectedColor: theme.color.text
                }
            }
        }}>
            {children}
        </ConfigProvider>
    );
};

export default AntdConfig;