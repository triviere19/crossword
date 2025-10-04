import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ReactNode, useMemo } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';

export function useAppTheme() {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    const theme = useMemo(() =>
        createTheme({
            palette: {
                mode: prefersDarkMode ? 'dark' : 'light',
                primary: {
                    main: prefersDarkMode ? '#ffffff' : '#000000',
                },
                secondary: {
                    main: prefersDarkMode ? '#000000' : '#ffffff',
                },
            },
            components: {
                MuiButton: {
                    styleOverrides: {
                        root: {
                            borderRadius: 20,
                        },
                        outlined: {
                            borderWidth: '2px',
                            '&:hover': {
                                borderWidth: '2px',
                            },
                        },
                    }
                },
            }
        }),
        [prefersDarkMode]
    );

    return theme;
}

export function MuiThemeProvider({children}: { children: ReactNode }){
    const theme = useAppTheme();
    return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}